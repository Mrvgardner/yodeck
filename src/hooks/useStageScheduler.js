import { useEffect, useRef, useState } from 'react'
import { preloadCard } from '../utils/preload.js'

// Stage layout: 4 columns × 2 rows = 8 cells. Cards span 2×1, 1×2 or 2×2.
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
  movie:       33_000,   // 25s hidden quote + ~8s reveal window
  halloween:   30_000,
}

// Variety rule: one card per kind on screen. The stage only holds 2–4 cards,
// so three movie quotes at once crowds out everything else. When a card
// exits, its slot waits (~1s) for the exit to finish rather than doubling
// up. Only when the whole deck has fewer kinds than the stage has slots
// (e.g. local dev with no news feed) may a second of a kind appear — never
// a third. YouTube is never doubled (audio collisions).
const KIND_CAP          = 1
const KIND_CAP_FALLBACK = 2
const MAX_SLOTS         = 4
const NEVER_DOUBLE      = new Set(['youtube'])

// How strongly each kind competes for an open slot. Quotes and movie quotes
// make up most of the deck by count, so without weighting they'd win nearly
// every draw and bury news, weather and people cards.
const KIND_WEIGHT = {
  birthday:    4,
  anniversary: 4,
  holiday:     3,
  whosout:     3,
  fieldnote:   3,
  news:        3,
  weather:     3,
  halloween:   2,
  youtube:     2,
  quote:       1,
  movie:       1,
}

// Per-kind allowed sizes. Every card spans at least 2 cells so the stage
// holds 2–4 cards at a time (big, readable at kitchen distance). Order
// doesn't matter — sizes are shuffled per placement for variety.
const SIZE_PREFS = {
  birthday:    [[2,1], [1,2], [2,2]],
  anniversary: [[2,1], [1,2], [2,2]],
  holiday:     [[2,1], [1,2], [2,2]],
  whosout:     [[2,1], [1,2]],
  fieldnote:   [[2,1], [1,2], [2,2]],
  weather:     [[2,1], [1,2], [2,2]],
  news:        [[2,1], [1,2], [2,2]],
  youtube:     [[2,2], [2,1]],   // videos are landscape, no 1x2
  quote:       [[2,1], [1,2], [2,2]],
  movie:       [[2,1], [1,2], [2,2]],
  halloween:   [[2,1], [1,2], [2,2]],
}
const DEFAULT_SIZES = [[2,1], [1,2]]

const EXIT_MS         = 900      // ~Card.jsx exit transition (0.8s) + buffer
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

// Order a pool kind-first: kinds drawn by weighted random (Efraimidis–
// Spirakis keys), cards shuffled within each kind.
function weightedByKind(pool) {
  const byKind = new Map()
  for (const c of pool) {
    if (!byKind.has(c.kind)) byKind.set(c.kind, [])
    byKind.get(c.kind).push(c)
  }
  return [...byKind.keys()]
    .map(k => ({ k, key: Math.random() ** (1 / (KIND_WEIGHT[k] ?? 1)) }))
    .sort((a, b) => b.key - a.key)
    .flatMap(({ k }) => shuffle(byKind.get(k)))
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

// 2-wide rects snap to even columns, so the 4×2 stage behaves as two 2×2
// halves. With only 2- and 4-cell cards, that guarantees no orphaned 1×1
// holes that nothing could fill.
function findFreeRects(occ, w, h) {
  const out = []
  const xStep = w === 2 ? 2 : 1
  for (let y = 0; y <= ROWS - h; y++) {
    for (let x = 0; x <= COLS - w; x += xStep) {
      let ok = true
      for (let dy = 0; dy < h && ok; dy++)
        for (let dx = 0; dx < w && ok; dx++)
          if (occ[y + dy][x + dx] !== null) ok = false
      if (ok) out.push({ x, y, w, h })
    }
  }
  return shuffle(out)
}

// The stage is two 2×2 halves (columns 0–1 and 2–3). If one card of a half
// left on its own, the gap would match its mate's shape (tall beside tall,
// wide under wide) and that orientation would lock in. So the cards in a
// half always leave together, and every turnover picks a fresh shape.
//   - mate finishing soon (≤ MATE_WAIT_MS): the expiring card waits for it,
//     so nobody gets cut off mid-read;
//   - otherwise the mate leaves early with it.
// Mates placed together afterwards stay in sync, so early exits are rare.
const halfOf = (p) => Math.floor(p.x / 2)
const MATE_WAIT_MS = 15_000
function liveMate(placements, p) {
  return Object.values(placements).find(q =>
    q.id !== p.id && q.state === 'live' && halfOf(q) === halfOf(p))
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
    case 'movie':       return `${card.kind}:${card.text}`
    case 'weather':     return `${card.kind}:${card.location}`
    case 'halloween':   return `${card.kind}:${card.tagline}`
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
  push(sources.movieQuotes)
  push(sources.extras)
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
      // its predecessor is still falling out, and concurrency caps still
      // apply to exiting cards (so no two YouTube videos crossfade).
      const onScreenIds   = new Set()
      const kindCounts    = new Map()  // kind → live+exiting count
      for (const p of Object.values(current)) {
        if (p.state === 'live' || p.state === 'exiting') {
          onScreenIds.add(p.card._id)
          kindCounts.set(p.card.kind, (kindCounts.get(p.card.kind) || 0) + 1)
        }
      }
      // Live shape mix, so new cards can lean toward whatever's missing.
      const shapeCounts = new Map()  // 'w×h' → live count
      for (const p of Object.values(current)) {
        if (p.state !== 'live') continue
        const k = `${p.w}x${p.h}`
        shapeCounts.set(k, (shapeCounts.get(k) || 0) + 1)
      }
      const countOf  = (kind) => kindCounts.get(kind) || 0
      const isCapped = (kind) => countOf(kind) >= KIND_CAP
      const isCappedFallback = (kind) =>
        countOf(kind) >= (NEVER_DOUBLE.has(kind) ? KIND_CAP : KIND_CAP_FALLBACK)
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

      // Pass 1 — strictest: kind not on screen, not the kind we just showed,
      //          card not recently evicted.
      // Pass 2 — relax the kind-hot rule.
      // Pass 3 — relax the eviction cooldown (still one per kind).
      // Pass 4 — only when the deck is kind-starved: allow a second of a kind.
      const fresh = (c) => !onScreenIds.has(c._id) && !isRecentlyEvicted(c._id)
      const kindStarved = new Set(deckNow.map(c => c.kind)).size < MAX_SLOTS
      const passes = [
        deckNow.filter(c => fresh(c) && !isCapped(c.kind) && !isKindHot(c.kind)),
        deckNow.filter(c => fresh(c) && !isCapped(c.kind)),
        deckNow.filter(c => !onScreenIds.has(c._id) && !isCapped(c.kind)),
        kindStarved ? deckNow.filter(c => fresh(c) && !isCappedFallback(c.kind)) : [],
      ]

      for (const pool of passes) {
        for (const card of weightedByKind(pool)) {
          const skip = skipUntilRef.current.get(card._id)
          if (skip && skip > now) continue

          // Least-shown shape first (ties shuffled) so wide, tall and 2×2
          // all get airtime instead of one orientation taking over.
          const sizes = shuffle(SIZE_PREFS[card.kind] || DEFAULT_SIZES)
            .sort((a, b) => (shapeCounts.get(`${a[0]}x${a[1]}`) || 0) - (shapeCounts.get(`${b[0]}x${b[1]}`) || 0))
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
          // Halves turn over as a unit (see liveMate / MATE_WAIT_MS).
          const mate = liveMate(cur, p)
          if (mate && mate.expiresAt > now && mate.expiresAt - now <= MATE_WAIT_MS) {
            next[id] = { ...p, expiresAt: mate.expiresAt }
            continue
          }
          next[id] = { ...p, state: 'exiting', exitedAt: now }
          if (mate && mate.expiresAt > now) {
            next[mate.id] = { ...mate, state: 'exiting', exitedAt: now }
          }
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
