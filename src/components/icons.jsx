// Inline SVG stand-ins for emoji. The Yodeck player has no color-emoji font,
// so characters like 🎃 render as empty boxes on the TV. Sized in `em` so the
// surrounding text-size class (text-7xl etc.) still controls how big they are.

export function PumpkinIcon({ className = '' }) {
  return (
    <svg className={className} width="1.1em" height="1em" viewBox="0 0 110 100" aria-hidden>
      {/* stem */}
      <path d="M52,22 C50,12 54,5 62,3 L65,8 C59,10 58,15 59,22 Z" fill="#4c7a2a" />
      {/* body — overlapping lobes */}
      <ellipse cx="30" cy="60" rx="26" ry="34" fill="#e8620c" />
      <ellipse cx="80" cy="60" rx="26" ry="34" fill="#e8620c" />
      <ellipse cx="55" cy="60" rx="30" ry="38" fill="#ff7a1a" />
      <path d="M42,26 C34,46 34,76 42,96 M68,26 C76,46 76,76 68,96" stroke="#c94f05" strokeWidth="2.5" fill="none" />
      {/* carved face, lit from inside */}
      <path d="M34,50 L44,40 L50,52 Z M76,50 L66,40 L60,52 Z" fill="#ffd34d" />
      <path d="M30,66 Q55,90 80,66 L72,70 L67,64 L61,72 L55,65 L49,72 L43,64 L38,70 Z" fill="#ffd34d" />
    </svg>
  )
}

export function CakeIcon({ className = '' }) {
  return (
    <svg className={className} width="1em" height="1em" viewBox="0 0 100 100" aria-hidden>
      {/* candle + flame */}
      <rect x="46" y="14" width="8" height="22" rx="2" fill="currentColor" />
      <path d="M50,2 C56,9 56,13 50,14 C44,13 44,9 50,2 Z" fill="#ffd34d" />
      {/* tiers */}
      <rect x="22" y="36" width="56" height="24" rx="5" fill="currentColor" />
      <rect x="10" y="60" width="80" height="30" rx="6" fill="currentColor" opacity="0.85" />
      {/* frosting drips */}
      <path d="M22,44 Q30,50 36,44 Q43,50 50,44 Q57,50 64,44 Q71,50 78,44" stroke="#ff4f00" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M10,70 Q20,77 30,70 Q40,77 50,70 Q60,77 70,70 Q80,77 90,70" stroke="#ff4f00" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// ─── Weather ───────────────────────────────────────────────────────
// Replaces ☀ ⛅ ☁ ☂ ❄ ⚡, which the player can't draw either.
const SUN    = '#ffc247'
const CLOUD  = '#e8eef5'
const SHADE  = '#b9c6d4'
const RAIN   = '#6cc4ff'

function Sun({ cx = 50, cy = 50, r = 18 }) {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4
    const x1 = cx + Math.cos(a) * (r + 7), y1 = cy + Math.sin(a) * (r + 7)
    const x2 = cx + Math.cos(a) * (r + 16), y2 = cy + Math.sin(a) * (r + 16)
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={SUN} strokeWidth="6" strokeLinecap="round" />
  })
  return <g>{rays}<circle cx={cx} cy={cy} r={r} fill={SUN} /></g>
}

// Cloud whose flat bottom sits at y = 78 + dy.
function Cloud({ fill = CLOUD, dy = 0 }) {
  return (
    <path
      transform={`translate(0 ${dy})`}
      d="M24,78 C12,78 8,62 20,57 C18,43 34,36 43,45 C47,30 72,30 74,48 C88,47 92,64 82,70 C82,75 79,78 74,78 Z"
      fill={fill}
    />
  )
}

export function WeatherIcon({ code, className = '' }) {
  let body
  if (code == null) {
    body = <circle cx="50" cy="50" r="5" fill={SHADE} />
  } else if (code === 0) {
    body = <Sun />
  } else if (code <= 3) {
    body = <><Sun cx={36} cy={36} r={15} /><Cloud dy={6} /></>
  } else if (code <= 48) {
    body = <><Cloud fill={SHADE} dy={-14} /><Cloud dy={0} /></>
  } else if ((code <= 67) || (code >= 80 && code <= 82)) {
    body = (
      <>
        <Cloud dy={-14} />
        {[30, 50, 70].map(x => (
          <line key={x} x1={x} y1="72" x2={x - 6} y2="90" stroke={RAIN} strokeWidth="6" strokeLinecap="round" />
        ))}
      </>
    )
  } else if (code <= 77) {
    body = (
      <>
        <Cloud dy={-14} />
        {[30, 50, 70].map((x, i) => (
          <circle key={x} cx={x} cy={i % 2 ? 88 : 80} r="5" fill="#ffffff" />
        ))}
      </>
    )
  } else if (code >= 95) {
    body = (
      <>
        <Cloud fill={SHADE} dy={-14} />
        <path d="M54,62 L40,82 L50,82 L44,98 L62,74 L52,74 L58,62 Z" fill={SUN} />
      </>
    )
  } else {
    body = <circle cx="50" cy="50" r="5" fill={SHADE} />
  }
  return (
    <svg className={className} width="1em" height="1em" viewBox="0 0 100 100" aria-hidden>
      {body}
    </svg>
  )
}
