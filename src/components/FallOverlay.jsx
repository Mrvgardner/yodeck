import { memo, useEffect, useState } from 'react'
import { LeafIcon } from './icons.jsx'

// Fall decorations layered over the whole screen:
//   - fallen leaves piled in the lower corners, on the ticker's top edge
//   - a few leaves drifting down at a time (sway + slow spin), coming to
//     rest on that same ground line
//   - every so often, a gust blows a handful of leaves across the screen
//
// Transform-only CSS animations (keyframes in index.css), never more than
// ~10 leaves in flight, pointer-events: none — same budget as the Halloween
// overlay.

const COLORS = ['#c92a2a', '#e8590c', '#f59f00', '#d9480f', '#a0522d', '#e67700']
const rand   = (min, max) => min + Math.random() * (max - min)
const pick   = (arr) => arr[Math.floor(Math.random() * arr.length)]

// ─── Ground piles ──────────────────────────────────────────────────
// Leaves that have already fallen, heaped in the lower corners on the
// "ground" (the top edge of the ticker): deepest at the corner, thinning out
// toward the middle. Built once from a fixed seed so the piles don't
// reshuffle on every render.
const PILE_WIDTH  = 230   // px the pile spreads out from the corner
const PILE_HEIGHT = 95    // px it heaps up at the corner
const PILE_LEAVES = 34

function seeded(i) {
  const x = Math.sin(i * 12.9898 + 4.1414) * 43758.5453
  return x - Math.floor(x)
}

const PILE = Array.from({ length: PILE_LEAVES }, (_, i) => {
  const along  = Math.pow(seeded(i), 2.2)                 // bias toward the corner
  const x      = along * PILE_WIDTH
  const height = Math.pow(1 - along, 1.4) * PILE_HEIGHT    // mound slopes down
  return {
    x,
    y:     seeded(i + 50) * height,                        // px above the ground
    size:  30 + seeded(i + 100) * 26,
    rot:   seeded(i + 150) * 360,
    shape: seeded(i + 200) < 0.6 ? 'maple' : 'oval',
    color: COLORS[Math.floor(seeded(i + 250) * COLORS.length)],
  }
  // Draw the lowest leaves first so higher ones sit on top of them.
}).sort((a, b) => a.y - b.y)

function Pile({ side }) {
  return (
    <div
      className={`absolute bottom-[100px] ${side === 'left' ? 'left-0' : 'right-0'}`}
      style={side === 'right' ? { transform: 'scaleX(-1)' } : undefined}
    >
      {PILE.map((l, i) => (
        // Sink each leaf a little below the ground line so the pile looks
        // like it's resting on it, not hovering.
        <div
          key={i}
          className="absolute"
          style={{ left: l.x - l.size / 2, bottom: l.y - l.size * 0.35, transform: `rotate(${l.rot}deg) scaleY(0.75)` }}
        >
          <LeafIcon shape={l.shape} color={l.color} size={l.size} />
        </div>
      ))}
    </div>
  )
}

// ─── Falling leaves ────────────────────────────────────────────────
function makeLeaf(id) {
  const dur = rand(13, 19)
  return {
    id, dur, life: dur * 1000 + 300,
    x:     rand(3, 95),
    sway:  rand(2.4, 4),
    spin:  rand(5, 9) * (Math.random() < 0.5 ? -1 : 1),
    size:  rand(34, 54),
    shape: Math.random() < 0.6 ? 'maple' : 'oval',
    color: pick(COLORS),
  }
}

function makeGust(id) {
  const rtl = Math.random() < 0.5
  const leaves = Array.from({ length: 6 }, (_, i) => ({
    y: rand(12, 70), delay: i * rand(0.15, 0.4), dur: rand(5, 7),
    size: rand(30, 48), spin: rand(1.2, 2.2), shape: Math.random() < 0.6 ? 'maple' : 'oval', color: pick(COLORS),
  }))
  return { id, rtl, leaves, life: Math.max(...leaves.map(l => (l.delay + l.dur) * 1000)) + 300 }
}

function FallingLeaf({ l }) {
  return (
    <div className="fl-fall" style={{ left: `${l.x}vw`, animationDuration: `${l.dur}s` }}>
      <div className="fl-sway" style={{ animationDuration: `${l.sway}s` }}>
        <div className="fl-spin" style={{ animationDuration: `${Math.abs(l.spin)}s`, animationDirection: l.spin < 0 ? 'reverse' : 'normal' }}>
          <LeafIcon shape={l.shape} color={l.color} size={l.size} />
        </div>
      </div>
    </div>
  )
}

function Gust({ g }) {
  return g.leaves.map((l, i) => (
    <div
      key={i}
      className="fl-gust"
      style={{ top: `${l.y}vh`, animationDuration: `${l.dur}s`, animationDelay: `${l.delay}s`, animationDirection: g.rtl ? 'reverse' : 'normal' }}
    >
      <div className="fl-spin" style={{ animationDuration: `${l.spin}s` }}>
        <LeafIcon shape={l.shape} color={l.color} size={l.size} />
      </div>
    </div>
  ))
}

const MAX_FALLING = 4

function FallOverlay() {
  const [leaves, setLeaves] = useState([])
  const [gust, setGust]     = useState(null)

  // Drifting leaves: add one every 4–9s (up to MAX_FALLING), each removes
  // itself when its fall finishes.
  useEffect(() => {
    let seq = 0
    const timers = new Set()
    const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn() }, ms); timers.add(t) }
    const spawn = () => {
      setLeaves(cur => {
        if (cur.length >= MAX_FALLING) return cur
        const l = makeLeaf(++seq)
        later(() => setLeaves(c => c.filter(x => x.id !== l.id)), l.life)
        return [...cur, l]
      })
      later(spawn, rand(4_000, 9_000))
    }
    later(spawn, 1_500)
    return () => timers.forEach(clearTimeout)
  }, [])

  // Gusts: one every 40–75s; the first shows up quickly so it's obvious.
  useEffect(() => {
    let id, seq = 0
    const blow = () => {
      const g = makeGust(++seq)
      setGust(g)
      id = setTimeout(() => {
        setGust(null)
        id = setTimeout(blow, rand(40_000, 75_000))
      }, g.life)
    }
    id = setTimeout(blow, 8_000)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      <Pile side="left" />
      <Pile side="right" />

      {leaves.map(l => <FallingLeaf key={l.id} l={l} />)}
      {gust && <Gust key={gust.id} g={gust} />}
    </div>
  )
}

export default memo(FallOverlay)
