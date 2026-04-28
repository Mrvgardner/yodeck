import { useEffect, useRef, useState } from 'react'
import { preloadCard } from '../utils/preload.js'

// Stage layout: 4 columns × 2 rows = 8 cells. Cards may span 1×1, 2×1, 1×2, 2×2.
// The scheduler maintains a set of "placements", each pinned to a rectangular
// region of the grid. When a placement's TTL expires it begins exiting; the
// cells it occupies are released for new placements as soon as exit starts,
// so a new card can rain in over the same region while the old one falls out.

export const COLS = 4
export const ROWS = 2

// Dwell times tuned for kitchen TV reading distance. Values pad enough
// time for someone walking past to digest the card without it feeling stale
// to someone standing nearby.
const DWELL = {
  birthday:    35_000,
  anniversary: 35_000,
  holiday:     32_000,
  whosout:     32_000,
  fieldnote:   45_000,   // longer body copy = more reading time
  weather:     38_000,
  news:        42_000,   // headline + description = more to absorb
  youtube:     150_000,  // 2½ min — long enough to actually enjoy
  quote:       30_000,
}

// Per-kind preferred sizes, in order of preference. Largest fitting size wins.
const SIZE_PREFS = {
  birthday:    [[1,1], [2,1]],
  anniversary: [[1,1], [2,1]],
  holiday:     [[1,1], [2,1]],
  whosout:     [[1,1], [2,1]],
  fieldnote:   [[2,1], [1,2], [1,1]],
  weather:     [[1,1], [2,1]],
  news:        [[2,1], [1,1]],
  youtube:     [[2,2], [2,1]],
  quote:       [[2,1], [1,1]],
}

const EXIT_MS         = 1500     // ~Card.jsx exit transition + buffer
const TICK_MS         = 500      // scheduler poll cadence
const RECENT_COOLDOWN = 90_000   // a card just removed can't reappear for this long
const KIND_COOLDOWN   = 12_000   // same kind can't reappear too quickly either

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function emptyOcc() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null))
}

function computeOcc(placements) {
  const occ = emptyOcc()
  for (const p of Object.values(placements)) {
    if (p.state !== 'live') continue
    for (let dy = 0; dy < p.h; dy++)
      for (let dx = 0; dx < p.w; dx++)
        occ[p.y + dy][p.x + dx] = p.id
  }
  return occ
}

function findFreeRects(occ, w, h) {
  const out = []
  for (let y = 0; y <= ROWS - h; y++) {
    for (let x = 0; x <= COLS - w; x++) {
      let ok = true
      for (let dy = 0; dy < h && ok; dy++)
        for (let dx = 0; dx < w && ok; dx++)
          if (occ[y + dy][x + dx] !== null) ok = false
      if (ok) out.push({ x, y, w, h })
    }
  }
  return shuffle(out)
}

function hasVacancy(occ) {
  for (let y = 0; y < ROWS; y++)
    for (let x = 0; x < COLS; x++)
      if (occ[y][x] === null) return true
  return false
}

// Stable identity per card so dedup works even after deck rebuilds.
function identityFor(card) {
  switch (card.kind) {
    case 'birthday':
    case 'anniversary': return `${card.kind}:${card.name}`
    case 'whosout':     return `${card.kind}:${card.name}:${card.startDate}`
    case 'holiday':     return `${card.kind}:${card.date}:${card.name}`
    case 'news':        return `${card.kind}:${card.id}`
    case 'fieldnote':   return `${card.kind}:${card.title}`
    case 'youtube':     return `${card.kind}:${card.videoId}`
    case 'quote':       return `${card.kind}:${card.text}`
    case 'weather':     return `${card.kind}:${card.location}`
    default:            return `${card.kind}:${JSON.stringify(card)}`
  }
}

// Public helper — call once with all sources to produce a deck with stable _ids.
export function buildDeck(sources) {
  const deck = []
  const push = arr => (arr || []).forEach(c => deck.push({ ...c, _id: identityFor(c) }))
  push(sources.birthdays)
  push(sources.anniversaries)
  push(sources.holidays)
  push(sources.whosOut)
  push(sources.fieldNotes)
  push(sources.news)
  push(sources.youtubeFeeds)
  push(sources.quotes)
  if (sources.weatherCard) deck.push({ ...sources.weatherCard, _id: identityFor(sources.weatherCard) })
  return deck
}

export function useStageScheduler({ deck }) {
  const [placements, setPlacements] = useState({})

  // Refs so async tick logic always sees the freshest values without
  // re-creating the interval on every render.
  const placementsRef     = useRef(placements)
  const deckRef           = useRef(deck)
  const placingRef        = useRef(false)
  const skipUntilRef      = useRef(new Map())  // _id   → epoch ms (preload-failure cooldown)
  const recentEvictedRef  = useRef(new Map())  // _id   → epoch ms (just-evicted cooldown)
  const recentKindRef     = useRef(new Map())  // kind  → epoch ms (kind-just-shown cooldown)
  const placementSeq      = useRef(0)

  useEffect(() => { placementsRef.current = placements }, [placements])
  useEffect(() => { deckRef.current       = deck       }, [deck])

  async function tryPlaceOne() {
    if (placingRef.current) return false
    placingRef.current = true
    try {
      const current = placementsRef.current
      const occ = computeOcc(current)
      if (!hasVacancy(occ)) return false

      // On-screen set INCLUDES exiting cards — a card can't reappear while
      // its predecessor is still falling out.
      const onScreenIds   = new Set()
      const onScreenKinds = new Set()
      let bigOnScreen = false
      for (const p of Object.values(current)) {
        if (p.state === 'live' || p.state === 'exiting') {
          onScreenIds.add(p.card._id)
          onScreenKinds.add(p.card.kind)
          if (p.w > 1 || p.h > 1) bigOnScreen = true
        }
      }
      // Layout rule: at least one card on screen must span ≥ 2 cells. 8 small
      // cards is too dense to read at kitchen distance. When no big card is
      // present, we flip the size preferences so the next placement strongly
      // prefers a 2-cell-or-larger size.
      const needBig = !bigOnScreen

      const deckNow = deckRef.current
      const now = Date.now()

      // Recently-evicted cards (90s cooldown) — prevents a card from
      // immediately replacing itself when it falls away.
      const isRecentlyEvicted = (id) => {
        const t = recentEvictedRef.current.get(id)
        return t && t > now
      }
      // Same kind shown very recently (12s) → soft skip in pass 1, allowed in later passes.
      const isKindHot = (kind) => {
        const t = recentKindRef.current.get(kind)
        return t && t > now
      }

      // Pass 1 — strictest: not on screen, not same kind currently shown,
      //                     not the kind we just showed, not recently evicted.
      // Pass 2 — relax kind-hot rule (same kind allowed if cooled).
      // Pass 3 — fallback: only "not on screen" + "not just evicted".
      // Pass 4 — last resort: only "not currently on screen".
      const baseFilter = (c) => !onScreenIds.has(c._id) && !isRecentlyEvicted(c._id)
      const passes = [
        deckNow.filter(c => baseFilter(c) && !onScreenKinds.has(c.kind) && !isKindHot(c.kind)),
        deckNow.filter(c => baseFilter(c) && !onScreenKinds.has(c.kind)),
        deckNow.filter(c => baseFilter(c)),
        deckNow.filter(c => !onScreenIds.has(c._id)),
      ]

      for (const pool of passes) {
        for (const card of shuffle(pool)) {
          const skip = skipUntilRef.current.get(card._id)
          if (skip && skip > now) continue

          // When stage needs a big card, prefer big sizes for this kind.
          // We sort the kind's allowed sizes so cells > 1 come first.
          const baseSizes = SIZE_PREFS[card.kind] || [[1,1]]
          const sizes = needBig
            ? [...baseSizes].sort((a, b) => (b[0] * b[1]) - (a[0] * a[1]))
            : baseSizes
          let placed = false
          for (const [w, h] of sizes) {
            const rects = findFreeRects(occ, w, h)
            if (rects.length === 0) continue

            // Preload before commit. If it fails, skip card for 5 min and try the next.
            const ok = await preloadCard(card)
            if (!ok) {
              skipUntilRef.current.set(card._id, now + 5 * 60 * 1000)
              break
            }

            const rect = rects[0]
            const id = `p${++placementSeq.current}`
            const dwell  = DWELL[card.kind] ?? 22_000
            const jitter = 0.85 + Math.random() * 0.3
            const expiresAt = now + dwell * jitter

            const placement = {
              id, card,
              x: rect.x, y: rect.y, w: rect.w, h: rect.h,
              state: 'live', expiresAt,
            }
            // Critical: update the ref SYNCHRONOUSLY so a back-to-back
            // tryPlaceOne() in the same tick sees this card occupying its
            // cells. Without this, two placements per tick can collide.
            placementsRef.current = { ...placementsRef.current, [id]: placement }
            setPlacements(placementsRef.current)
            // Mark this kind as "recently shown" so the soft kind cooldown kicks in.
            recentKindRef.current.set(card.kind, now + KIND_COOLDOWN)
            placed = true
            return true
          }
          if (placed) return true
        }
      }
      return false
    } finally {
      placingRef.current = false
    }
  }

  // Single long-lived tick loop — only restarts when deck-availability flips.
  useEffect(() => {
    if (deck.length === 0) return
    let cancelled = false

    async function tick() {
      if (cancelled) return
      const now  = Date.now()
      const cur  = placementsRef.current

      // Phase 1: expire live → exiting; remove fully-exited
      let next = cur
      let mutated = false
      for (const [id, p] of Object.entries(cur)) {
        if (p.state === 'live' && p.expiresAt <= now) {
          if (!mutated) { next = { ...cur }; mutated = true }
          next[id] = { ...p, state: 'exiting', exitedAt: now }
        }
      }
      for (const [id, p] of Object.entries(next)) {
        if (p.state === 'exiting' && p.exitedAt + EXIT_MS <= now) {
          if (next === cur) { next = { ...cur }; mutated = true }
          // Remember we just removed this card so it can't immediately reappear.
          recentEvictedRef.current.set(p.card._id, now + RECENT_COOLDOWN)
          delete next[id]
        }
      }
      // Garbage-collect old cooldown entries so the maps don't grow unbounded.
      for (const [k, t] of recentEvictedRef.current) if (t <= now) recentEvictedRef.current.delete(k)
      for (const [k, t] of recentKindRef.current)    if (t <= now) recentKindRef.current.delete(k)
      if (mutated) {
        setPlacements(next)
        placementsRef.current = next  // update ref synchronously so tryPlaceOne sees it
      }

      // Phase 2: fill vacancies (up to 2 per tick to refill briskly)
      if (hasVacancy(computeOcc(placementsRef.current))) {
        const placed = await tryPlaceOne()
        if (placed && hasVacancy(computeOcc(placementsRef.current))) {
          await tryPlaceOne()
        }
      }
    }

    const id = setInterval(tick, TICK_MS)
    tick()  // kick once for fast initial fill
    return () => { cancelled = true; clearInterval(id) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck.length > 0])

  return Object.values(placements)
}
