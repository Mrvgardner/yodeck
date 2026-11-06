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

// ─── Fall ──────────────────────────────────────────────────────────
// Two leaf shapes in a few autumn colors, used by FallOverlay.
const MAPLE = 'M50,4 L57,24 L70,17 L66,37 L86,33 L77,48 L96,55 L72,62 L77,77 L58,69 L54,90 L50,88 L46,90 L42,69 L23,77 L28,62 L4,55 L23,48 L14,33 L34,37 L30,17 L43,24 Z'
const OVAL  = 'M50,6 C78,24 86,58 50,92 C14,58 22,24 50,6 Z'

export function LeafIcon({ shape = 'maple', color = '#e8590c', size = 48, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <path d={shape === 'maple' ? MAPLE : OVAL} fill={color} stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" strokeLinejoin="round" />
      {/* veins + stem */}
      <path
        d={shape === 'maple' ? 'M50,88 L50,30 M50,62 L30,50 M50,62 L70,50 M50,45 L36,30 M50,45 L64,30' : 'M50,92 L50,18 M50,60 L34,44 M50,60 L66,44 M50,42 L38,30 M50,42 L62,30'}
        stroke="rgba(0,0,0,0.28)" strokeWidth="2.5" fill="none" strokeLinecap="round"
      />
      <path d="M50,88 L50,99" stroke="#6b3a1e" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

// Friendly turkey for the Thanksgiving countdown card.
export function TurkeyIcon({ className = '' }) {
  const feathers = ['#c92a2a', '#e8590c', '#f59f00', '#e8590c', '#c92a2a']
  return (
    <svg className={className} width="1.1em" height="1em" viewBox="0 0 110 100" aria-hidden>
      {/* tail fan */}
      {feathers.map((c, i) => {
        const a = -70 + i * 35
        return <ellipse key={i} cx="55" cy="30" rx="13" ry="30" fill={c} transform={`rotate(${a} 55 58)`} />
      })}
      {/* body + head */}
      <ellipse cx="55" cy="66" rx="24" ry="26" fill="#7a4a2a" />
      <circle cx="55" cy="40" r="13" fill="#8b5a36" />
      <circle cx="50" cy="37" r="2.6" fill="#1a1a1a" />
      <circle cx="60" cy="37" r="2.6" fill="#1a1a1a" />
      <path d="M52,43 L58,43 L55,49 Z" fill="#f59f00" />
      <path d="M57,46 C61,48 61,55 57,57 C55,53 55,49 57,46 Z" fill="#c92a2a" />
      {/* feet */}
      <path d="M46,91 L44,98 M46,91 L48,98 M64,91 L62,98 M64,91 L66,98" stroke="#f59f00" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

// ─── Christmas ─────────────────────────────────────────────────────
// Decorated tree for the Christmas countdown card.
export function TreeIcon({ className = '' }) {
  const ornaments = [
    [42, 46, '#e03131'], [60, 54, '#ffd43b'], [36, 66, '#4dabf7'],
    [56, 72, '#e03131'], [70, 80, '#ffd43b'], [30, 82, '#e03131'], [48, 86, '#4dabf7'],
  ]
  return (
    <svg className={className} width="0.9em" height="1em" viewBox="0 0 90 100" aria-hidden>
      {/* star */}
      <path d="M45,2 L49,12 L60,12 L51,18 L55,29 L45,22 L35,29 L39,18 L30,12 L41,12 Z" fill="#ffd43b" />
      {/* three tiers */}
      <path d="M45,20 L66,48 L24,48 Z"  fill="#2b8a3e" />
      <path d="M45,34 L74,70 L16,70 Z"  fill="#2f9e44" />
      <path d="M45,50 L82,92 L8,92 Z"   fill="#37b24d" />
      {/* garland */}
      <path d="M28,58 Q45,66 64,56 M20,80 Q45,90 72,78" stroke="#fff3bf" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {ornaments.map(([x, y, c], i) => <circle key={i} cx={x} cy={y} r="3.6" fill={c} />)}
      {/* trunk */}
      <rect x="39" y="91" width="12" height="9" rx="1.5" fill="#7a4a2a" />
    </svg>
  )
}
