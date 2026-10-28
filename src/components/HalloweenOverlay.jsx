import { memo, useEffect, useState } from 'react'

// Halloween decorations layered over the whole screen:
//   - static cobwebs (top-left, with a resident spider, and bottom-right)
//   - every 14–30s, one "critter" crosses the screen: a bat, a small flock
//     of bats, a spider dropping on its silk, or a spider scurrying up.
//
// Everything animates with CSS transforms only (keyframes in index.css) and
// at most three critters exist at once, so it stays on the GPU fast path.
// pointer-events: none — purely decorative.

// ─── Cobweb ────────────────────────────────────────────────────────
// Built once: spokes fanning out from the corner, rings that sag toward it.
const WEB_R = 300
const WEB_PATH = (() => {
  const spokes = 8
  const angles = Array.from({ length: spokes }, (_, i) => (i / (spokes - 1)) * (Math.PI / 2))
  const pt = (r, a) => `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`
  let d = ''
  for (const a of angles) d += `M0,0 L${pt(WEB_R, a)} `
  const rings = [40, 82, 128, 178, 232, 286]
  rings.forEach((r0, ri) => {
    const rAt = i => r0 * (1 + 0.05 * Math.sin(i * 2.3 + ri))  // slight irregularity
    d += `M${pt(rAt(0), angles[0])} `
    for (let i = 0; i < spokes - 1; i++) {
      const mid = (angles[i] + angles[i + 1]) / 2
      d += `Q${pt(r0 * 0.84, mid)} ${pt(rAt(i + 1), angles[i + 1])} `
    }
  })
  return d
})()

function Cobweb({ className, style, size = WEB_R }) {
  return (
    <svg
      className={`absolute ${className}`}
      style={style}
      width={size} height={size}
      viewBox={`0 0 ${WEB_R} ${WEB_R}`}
      aria-hidden
    >
      <path d={WEB_PATH} fill="none" stroke="rgba(235,230,245,0.32)" strokeWidth="1.2" />
    </svg>
  )
}

// ─── Spider ────────────────────────────────────────────────────────
// Top-down, head up. Legs split into two alternating sets that rock in
// opposite directions — reads as walking.
const LEGS_A = 'M-4,-8 L-20,-24 L-26,-38 M-5,1 L-24,6 L-36,14 M5,-4 L24,-12 L36,-20 M4,6 L20,20 L26,36'
const LEGS_B = 'M-5,-4 L-24,-12 L-36,-20 M-4,6 L-20,20 L-26,36 M4,-8 L20,-24 L26,-38 M5,1 L24,6 L36,14'

function SpiderSvg({ size = 70, fast = false }) {
  const legCls = fast ? 'hw-legs-fast' : 'hw-legs'
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" aria-hidden className="overflow-visible">
      {[LEGS_A, LEGS_B].map((d, i) => (
        <g key={i} className={`${legCls} ${i ? 'hw-legs-b' : ''}`}>
          <path d={d} fill="none" stroke="rgba(255,215,170,0.35)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="#141014" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
      <ellipse cx="0" cy="9" rx="10" ry="13" fill="#141014" stroke="rgba(255,215,170,0.45)" strokeWidth="1" />
      <circle cx="0" cy="-8" r="7" fill="#141014" stroke="rgba(255,215,170,0.45)" strokeWidth="1" />
      <circle cx="-2.6" cy="-11" r="1.5" fill="#ff5a1f" />
      <circle cx="2.6" cy="-11" r="1.5" fill="#ff5a1f" />
    </svg>
  )
}

// ─── Bat ───────────────────────────────────────────────────────────
const WING_L = 'M60,28 C50,12 30,6 4,14 C12,20 14,26 12,33 C20,28 26,30 28,39 C34,33 42,33 46,41 C50,35 55,33 60,35 Z'
const WING_R = 'M60,28 C70,12 90,6 116,14 C108,20 106,26 108,33 C100,28 94,30 92,39 C86,33 78,33 74,41 C70,35 65,33 60,35 Z'

function BatSvg({ width = 120 }) {
  const stroke = 'rgba(255,180,110,0.4)'
  return (
    <svg width={width} height={width / 2} viewBox="0 0 120 60" aria-hidden className="overflow-visible">
      <path className="hw-wing" d={WING_L} fill="#150a1c" stroke={stroke} strokeWidth="1.2" />
      <path className="hw-wing" d={WING_R} fill="#150a1c" stroke={stroke} strokeWidth="1.2" />
      <ellipse cx="60" cy="34" rx="5" ry="9" fill="#150a1c" stroke={stroke} strokeWidth="1" />
      <path d="M55,24 L56,15 L59,22 Z M65,24 L64,15 L61,22 Z" fill="#150a1c" stroke={stroke} strokeWidth="1" />
      <circle cx="60" cy="27" r="6" fill="#150a1c" stroke={stroke} strokeWidth="1" />
      <circle cx="57.8" cy="26.5" r="1.2" fill="#ff8a2b" />
      <circle cx="62.2" cy="26.5" r="1.2" fill="#ff8a2b" />
    </svg>
  )
}

// ─── Critters ──────────────────────────────────────────────────────
const rand = (min, max) => min + Math.random() * (max - min)

function makeCritter() {
  const roll = Math.random()
  const id = Date.now()
  if (roll < 0.35) {
    const dur = rand(7, 10)
    return { id, type: 'bat', life: dur * 1000 + 200,
      bats: [{ y: rand(8, 55), dur, delay: 0, scale: rand(0.9, 1.3), rtl: Math.random() < 0.5 }] }
  }
  if (roll < 0.5) {
    const rtl = Math.random() < 0.5
    const y   = rand(10, 45)
    const dur = rand(8, 10)
    const bats = [0, 1, 2].map(i => ({
      y: y + rand(-6, 6) + i * 4, dur: dur + rand(-0.6, 0.6), delay: i * rand(0.4, 0.8),
      scale: rand(0.6, 1.0), rtl,
    }))
    return { id, type: 'bat', bats, life: Math.max(...bats.map(b => (b.dur + b.delay) * 1000)) + 200 }
  }
  if (roll < 0.78) {
    return { id, type: 'drop', x: rand(6, 94), drop: rand(28, 55), life: 11_200 }
  }
  return { id, type: 'scurry', x: rand(4, 96), life: 7_200 }
}

function Critter({ c }) {
  if (c.type === 'bat') {
    return c.bats.map((b, i) => (
      <div
        key={i}
        className="hw-fly"
        style={{
          top: `${b.y}vh`,
          animationDuration: `${b.dur}s`,
          animationDelay: `${b.delay}s`,
          animationDirection: b.rtl ? 'reverse' : 'normal',
        }}
      >
        <div className="hw-bob" style={{ animationDelay: `${-i * 0.5}s` }}>
          <div style={{ transform: `scale(${b.rtl ? -b.scale : b.scale}, ${b.scale})` }}>
            <BatSvg />
          </div>
        </div>
      </div>
    ))
  }
  if (c.type === 'drop') {
    return (
      <div className="hw-drop" style={{ left: `${c.x}vw`, '--drop': `${c.drop}vh` }}>
        <div className="hw-thread" />
        <div className="hw-sway">
          <SpiderSvg size={64} />
        </div>
      </div>
    )
  }
  return (
    <div className="hw-scurry" style={{ left: `${c.x}vw` }}>
      <div className="hw-zigzag">
        <SpiderSvg size={56} fast />
      </div>
    </div>
  )
}

function HalloweenOverlay() {
  const [critter, setCritter] = useState(null)

  // One critter at a time: spawn → let it finish → wait 14–30s → repeat.
  // The first one shows up quickly so the theme is obvious right away.
  useEffect(() => {
    let id
    const spawn = () => {
      const c = makeCritter()
      setCritter(c)
      id = setTimeout(() => {
        setCritter(null)
        id = setTimeout(spawn, rand(14_000, 30_000))
      }, c.life)
    }
    id = setTimeout(spawn, 3_000)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      <Cobweb className="top-0 left-0" />
      <Cobweb className="bottom-[100px] right-0" size={200} style={{ transform: 'scale(-1, -1)' }} />

      {/* Resident spider hanging from the top-left web */}
      <div className="absolute top-0 left-[150px]">
        <div className="hw-resident">
          <div className="w-px h-[150px] mx-auto bg-[rgba(240,235,225,0.45)]" />
          <div className="-mt-2"><SpiderSvg size={40} /></div>
        </div>
      </div>

      {critter && <Critter key={critter.id} c={critter} />}
    </div>
  )
}

export default memo(HalloweenOverlay)
