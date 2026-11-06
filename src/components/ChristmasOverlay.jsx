import { memo } from 'react'
import ChristmasVisitors from './ChristmasVisitors.jsx'

// Christmas decorations layered over the whole screen:
//   - a string of lights along the very top edge, gently twinkling
//   - light, steady snowfall that settles at the ground line (top of ticker)
//   - snow banks heaped in the lower corners
//   - now and then, a visitor (see ChristmasVisitors.jsx)
//
// Everything is static markup with CSS animations (keyframes in index.css):
// transform/opacity only, no React state, no timers. Flakes loop forever with
// staggered negative delays so the screen is already snowing on load.

const rand = (min, max) => min + Math.random() * (max - min)

// ─── Lights ────────────────────────────────────────────────────────
const BULBS        = 22
const BULB_COLORS  = ['#ff4d4d', '#ffd43b', '#51cf66', '#4dabf7', '#f783ac']
// One scallop of wire per bulb; the wire is stretched to the screen width,
// bulbs are placed by percentage at the bottom of each scallop.
const WIRE = Array.from({ length: BULBS }, (_, i) => `Q${i * 100 + 50},26 ${(i + 1) * 100},4`).join(' ')
const LIGHTS = Array.from({ length: BULBS }, (_, i) => ({
  left:  `${((i + 0.5) / BULBS) * 100}%`,
  color: BULB_COLORS[i % BULB_COLORS.length],
  dur:   rand(1.6, 3.2),
  delay: -rand(0, 3),
}))

function Lights() {
  return (
    <div className="absolute top-0 inset-x-0 h-[40px]">
      <svg className="absolute inset-0 w-full h-[30px]" viewBox={`0 0 ${BULBS * 100} 30`} preserveAspectRatio="none" aria-hidden>
        <path d={`M0,4 ${WIRE}`} fill="none" stroke="#1f3b2a" strokeWidth="3" vectorEffect="non-scaling-stroke" />
      </svg>
      {LIGHTS.map((b, i) => (
        <div key={i} className="absolute top-[13px] -translate-x-1/2" style={{ left: b.left }}>
          <div className="mx-auto h-[5px] w-[7px] rounded-sm bg-[#3a4a3f]" />
          <div
            className="xm-bulb h-[16px] w-[11px] rounded-b-full rounded-t-[40%]"
            style={{ background: b.color, boxShadow: `0 0 12px 3px ${b.color}`, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }}
          />
        </div>
      ))}
    </div>
  )
}

// ─── Snow ──────────────────────────────────────────────────────────
const FLAKES = Array.from({ length: 26 }, () => {
  const dur = rand(14, 26)
  return {
    left:  `${rand(1, 99)}vw`,
    size:  rand(4, 9),
    alpha: rand(0.55, 0.95),
    dur,
    delay: -rand(0, dur),        // already mid-fall on load
    sway:  rand(2.5, 4.5),
  }
})

function Snow() {
  return FLAKES.map((f, i) => (
    <div key={i} className="xm-fall" style={{ left: f.left, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }}>
      <div className="xm-sway" style={{ animationDuration: `${f.sway}s`, animationDelay: `${f.delay}s` }}>
        <div className="rounded-full bg-white" style={{ width: f.size, height: f.size, opacity: f.alpha }} />
      </div>
    </div>
  ))
}

// ─── Snow banks ────────────────────────────────────────────────────
// Heaped at the corner, tapering toward the middle; mirrored for the right.
function SnowBank({ side }) {
  return (
    <svg
      className={`absolute bottom-[98px] ${side === 'left' ? 'left-0' : 'right-0'}`}
      style={side === 'right' ? { transform: 'scaleX(-1)' } : undefined}
      width="380" height="70" viewBox="0 0 380 70" aria-hidden
    >
      <defs>
        <linearGradient id={`bank-${side}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ffffff" />
          <stop offset="100%" stopColor="#c9d8ea" />
        </linearGradient>
      </defs>
      <path
        d="M0,70 L0,12 C28,2 60,6 92,16 C126,26 150,22 182,32 C226,46 268,50 318,60 C346,65 366,68 380,70 Z"
        fill={`url(#bank-${side})`}
      />
      <path d="M0,12 C28,2 60,6 92,16 C126,26 150,22 182,32 C226,46 268,50 318,60" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
    </svg>
  )
}

function ChristmasOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      <Snow />
      <SnowBank side="left" />
      <SnowBank side="right" />
      <Lights />
      <ChristmasVisitors />
    </div>
  )
}

export default memo(ChristmasOverlay)
