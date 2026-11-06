import { memo, useEffect, useState } from 'react'

// Sporadic Christmas visitors, at most one at a time:
//   - Santa's sleigh (two reindeer, one red-nosed) flying across the top
//   - a runaway reindeer chased by an elf along the ground (the ticker's top)
// Rare on purpose: the first shows up about a minute after load, then one
// every 3–7 minutes, so most glances at the TV see just snow and lights.
// Legs gallop with CSS (keyframes in index.css); everything faces right and
// is mirrored for right-to-left passes.

const BROWN = '#8b5a2b', BROWN_LIGHT = '#b07a45', ANTLER = '#6b4423'
const rand  = (min, max) => min + Math.random() * (max - min)

// One leg: rotates from its top (hip) so the gallop swings naturally.
function Leg({ x, y, phase }) {
  return (
    <g className={`xm-leg ${phase === 'b' ? 'xm-leg-b' : ''}`}>
      <rect x={x} y={y} width="6" height="28" rx="2.5" fill={BROWN} />
      <rect x={x - 0.5} y={y + 25} width="7" height="5" rx="1.5" fill="#2b1d12" />
    </g>
  )
}

// Reindeer facing right, ~120×100. `glow` adds the red nose.
function Reindeer({ glow = false }) {
  return (
    <g>
      <path d="M88,24 L83,6 M85,14 L77,8 M93,22 L99,4 M96,12 L105,8" stroke={ANTLER} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <Leg x={33} y={62} phase="a" />
      <Leg x={42} y={62} phase="b" />
      <Leg x={70} y={62} phase="b" />
      <Leg x={79} y={62} phase="a" />
      <ellipse cx="24" cy="50" rx="6" ry="5" fill="#f3e9dc" />
      <ellipse cx="56" cy="56" rx="32" ry="15" fill={BROWN} />
      <ellipse cx="58" cy="62" rx="22" ry="7" fill={BROWN_LIGHT} />
      <path d="M72,50 L86,28 L98,36 L82,60 Z" fill={BROWN} />
      <ellipse cx="94" cy="31" rx="12" ry="9" fill={BROWN} />
      <ellipse cx="105" cy="34" rx="9" ry="6.5" fill={BROWN_LIGHT} />
      <path d="M86,24 L80,18 L88,27 Z" fill={BROWN} />
      <circle cx="95" cy="28" r="1.8" fill="#111" />
      <circle cx="113" cy="33" r={glow ? 4.5 : 3.5} fill={glow ? '#ff3b3b' : '#2b1d12'} />
      {glow && <circle cx="113" cy="33" r="8" fill="#ff3b3b" opacity="0.3" />}
    </g>
  )
}

// Running elf facing right, ~60×100.
function Elf() {
  return (
    <g>
      <g className="xm-leg"><rect x="22" y="72" width="7" height="18" fill="#e03131" /><rect x="22" y="78" width="7" height="4" fill="#fff" /><path d="M20,89 L33,89 Q38,89 37,84" stroke="#2f9e44" strokeWidth="5" fill="none" strokeLinecap="round" /></g>
      <g className="xm-leg xm-leg-b"><rect x="33" y="72" width="7" height="18" fill="#e03131" /><rect x="33" y="78" width="7" height="4" fill="#fff" /><path d="M31,89 L44,89 Q49,89 48,84" stroke="#2f9e44" strokeWidth="5" fill="none" strokeLinecap="round" /></g>
      {/* arms reaching forward for the reindeer */}
      <rect x="38" y="50" width="20" height="6" rx="3" fill="#2f9e44" transform="rotate(-20 38 53)" />
      <circle cx="58" cy="46" r="3.5" fill="#f1c27d" />
      <path d="M18,48 L44,48 L50,74 L12,74 Z" fill="#2f9e44" />
      <rect x="14" y="62" width="34" height="4" fill="#212529" />
      <rect x="28" y="61" width="6" height="6" fill="#ffd43b" />
      <circle cx="32" cy="38" r="10" fill="#f1c27d" />
      <path d="M41,35 L49,30 L42,40 Z" fill="#f1c27d" />
      <circle cx="35" cy="36" r="1.5" fill="#111" />
      <path d="M31,42 Q35,45 38,42" stroke="#111" strokeWidth="1.2" fill="none" />
      <path d="M20,32 L28,4 L46,30 Z" fill="#2f9e44" />
      <rect x="19" y="28" width="28" height="6" rx="3" fill="#fff" />
      <circle cx="28" cy="4" r="4" fill="#e03131" />
    </g>
  )
}

// Santa in his sleigh, pulled by two reindeer. ~430×100, facing right.
function Sleigh() {
  return (
    <svg width="430" height="100" viewBox="0 0 430 100" className="overflow-visible" aria-hidden>
      {/* reins from Santa's hands to both reindeer */}
      <path d="M80,36 Q170,30 262,42 M80,36 Q230,34 372,38" stroke="#5c3a1e" strokeWidth="2" fill="none" />
      {/* sack, Santa, sleigh body, runner */}
      <ellipse cx="34" cy="30" rx="18" ry="16" fill="#a0522d" />
      <circle cx="66" cy="34" r="16" fill="#c92a2a" />
      <circle cx="70" cy="14" r="9" fill="#f1c27d" />
      <path d="M62,16 Q70,34 79,16 Z" fill="#fff" />
      <path d="M61,10 L70,-6 L80,10 Z" fill="#c92a2a" />
      <rect x="60" y="8" width="21" height="5" rx="2.5" fill="#fff" />
      <circle cx="70" cy="-6" r="3.5" fill="#fff" />
      <path d="M14,42 L108,42 Q122,42 124,54 L120,74 L22,74 Q8,60 14,42 Z" fill="#c92a2a" stroke="#ffd43b" strokeWidth="3" />
      <path d="M34,74 L34,84 M98,74 L98,84" stroke="#ffd43b" strokeWidth="3" />
      <path d="M8,84 L130,84 Q150,84 150,66" stroke="#ffd43b" strokeWidth="4" fill="none" strokeLinecap="round" />
      <g transform="translate(200,-2)"><Reindeer /></g>
      <g transform="translate(310,-8)"><Reindeer glow /></g>
    </svg>
  )
}

function Chase() {
  return (
    <svg width="300" height="100" viewBox="0 0 300 100" className="overflow-visible" aria-hidden>
      <g transform="translate(0,0)"><Elf /></g>
      <g transform="translate(150,0)"><Reindeer glow /></g>
    </svg>
  )
}

function makeVisitor() {
  const id  = Date.now()
  const rtl = Math.random() < 0.5
  if (Math.random() < 0.55) {
    return { id, rtl, type: 'sleigh', y: rand(8, 26), dur: rand(11, 14) }
  }
  return { id, rtl, type: 'chase', dur: rand(8, 10) }
}

function Visitor({ v }) {
  const sprite = v.type === 'sleigh' ? <Sleigh /> : <Chase />
  return (
    <div
      className="xm-across"
      style={{
        ...(v.type === 'sleigh' ? { top: `${v.y}vh` } : { bottom: 96 }),
        animationDuration: `${v.dur}s`,
        animationDirection: v.rtl ? 'reverse' : 'normal',
      }}
    >
      <div className={v.type === 'sleigh' ? 'xm-glide' : 'xm-trot'}>
        <div style={v.rtl ? { transform: 'scaleX(-1)' } : undefined}>{sprite}</div>
      </div>
    </div>
  )
}

// Dev-only: ?visitors=now shows one right away and then every ~15s, to
// preview without waiting minutes. Stripped from production builds.
const FAST = import.meta.env.DEV && new URLSearchParams(window.location.search).get('visitors') === 'now'
const FIRST_MS = FAST ? [1_500, 2_000]  : [45_000, 90_000]
const GAP_MS   = FAST ? [4_000, 6_000]  : [180_000, 420_000]

function ChristmasVisitors() {
  const [visitor, setVisitor] = useState(null)

  useEffect(() => {
    let id
    const show = () => {
      const v = makeVisitor()
      setVisitor(v)
      id = setTimeout(() => {
        setVisitor(null)
        id = setTimeout(show, rand(...GAP_MS))
      }, v.dur * 1000 + 300)
    }
    id = setTimeout(show, rand(...FIRST_MS))
    return () => clearTimeout(id)
  }, [])

  return visitor ? <Visitor key={visitor.id} v={visitor} /> : null
}

export default memo(ChristmasVisitors)
