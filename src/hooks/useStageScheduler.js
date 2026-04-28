import { useEffect, useRef, useState } from 'react'
import { preloadCard } from '../utils/preload.js'

// Stage layout: 4 columns × 2 rows = 8 cells. Cards may span 1×1, 2×1, 1×2, 2×2.
// The scheduler maintains a set of "placements", each pinned to a rectangular
// region of the grid. When a placement's TTL expires it begins exiting; the
// cells it occupies are released for new placements as soon as exit starts,
// so a new card can rain in over the same region while the old one falls out.

export const COLS = 4
export const ROWS = 2

const DWELL = {
  birthday:    24_000,
  anniversary: 24_000,
  holiday:     22_000,
  whosout:     22_000,
  fieldnote:   30_000,
  weather:     26_000,
  news:        24_000,
  youtube:     60_000,
  quote:       20_000,
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

const EXIT_MS = 1500       // ~Card.jsx exit transition + buffer
const TICK_MS = 500        // scheduler poll cadence

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
  const placementsRef = useRef(placements)
  const deckRef       = useRef(deck)
  const placingRef    = useRef(false)
  const skipUntilRef  = useRef(new Map())  // _id → epoch ms cooldown
  const placementSeq  = useRef(0)

  useEffect(() => { placementsRef.current = placements }, [placements])
  useEffect(() => { deckRef.current       = deck       }, [deck])

  async function tryPlaceOne() {
    if (placingRef.current) return false
    placingRef.current = true
    try {
      const current = placementsRef.current
      const occ = computeOcc(current)
      if (!hasVacancy(occ)) return false

      const onScreenIds   = new Set()
      const onScreenKinds = new Set()
      for (const p of Object.values(current)) {
        if (p.state === 'live') {
          onScreenIds.add(p.card._id)
          onScreenKinds.add(p.card.kind)
        }
      }

      const deckNow = deckRef.current
      const now = Date.now()

      // Pass 1: prefer kinds NOT currently on screen (variety)
      // Pass 2: any non-duplicate (so the stage doesn't go empty if one kind dominates)
      const passes = [
        deckNow.filter(c => !onScreenIds.has(c._id) && !onScreenKinds.has(c.kind)),
        deckNow.filter(c => !onScreenIds.has(c._id)),
      ]

      for (const pool of passes) {
        for (const card of shuffle(pool)) {
          const skip = skipUntilRef.current.get(card._id)
          if (skip && skip > now) continue

          const sizes = SIZE_PREFS[card.kind] || [[1,1]]
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

            setPlacements(prev => ({
              ...prev,
              [id]: {
                id, card,
                x: rect.x, y: rect.y, w: rect.w, h: rect.h,
                state: 'live', expiresAt,
              },
            }))
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
          delete next[id]
        }
      }
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
