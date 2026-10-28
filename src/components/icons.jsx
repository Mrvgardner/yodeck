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
