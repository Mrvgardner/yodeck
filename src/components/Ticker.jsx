// Bottom ticker — endless horizontal marquee that scrolls UNDER the orange
// "LIVE · KITCHEN FEED" badge. The badge is z-10 and the marquee is z-0 so
// the text visibly slides behind the badge.
//
// To keep the loop seamless, items are duplicated and the track translates
// from 0% → -50% (animation in index.css).
export default function Ticker({ items }) {
  if (!items || items.length === 0) return null
  const trackItems = [...items, ...items]

  return (
    <footer className="relative h-[100px] border-t border-sc-cream/10 overflow-hidden bg-sc-navy-deep/60">
      {/* Marquee — fills full width, z-0 (default), runs continuously */}
      <div className="absolute inset-0 flex items-center">
        <div className="ticker-track">
          {trackItems.map((it, i) => (
            <span key={i} className="font-display text-3xl text-sc-cream tracking-wide">
              <span className="text-sc-orange mr-4">◆</span>
              {it}
            </span>
          ))}
        </div>
      </div>

      {/* Soft fade under the badge so text "dissolves" into the orange edge
          rather than disappearing in a hard line. */}
      <div className="pointer-events-none absolute left-[380px] top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-sc-navy-deep/80 to-transparent" />

      {/* Right-edge fade so text doesn't hit the screen edge cold */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-sc-navy-deep to-transparent" />

      {/* Orange badge — overlays the marquee, fixed at left */}
      <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center gap-4 bg-sc-orange px-8 shadow-[8px_0_24px_rgba(0,0,0,0.4)]">
        <span
          className="status-pip"
          aria-hidden
          style={{ background: 'white', boxShadow: '0 0 12px white' }}
        />
        <span className="font-sc-bold text-2xl text-white whitespace-nowrap">LIVE · KITCHEN FEED</span>
      </div>
    </footer>
  )
}
