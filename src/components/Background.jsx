// Atmospheric backdrop — fully static for Yodeck performance.
// We previously had two 120–140px blur blobs animated with framer-motion;
// those caused continuous GPU compositing and made the whole page jerky on
// the kitchen player. Replaced with static radial gradients that give the
// same visual depth at zero animation cost.
export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-sc-navy-deep">
      {/* deep navy base wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 20% 0%, #002b5e 0%, #000d22 55%, #000814 100%)',
        }}
      />
      {/* static amber glow upper-right */}
      <div
        className="absolute -top-[12%] right-[-8%] h-[55%] w-[55%] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #ff4f00 0%, transparent 70%)' }}
      />
      {/* static blue glow lower-left */}
      <div
        className="absolute bottom-[-12%] left-[-10%] h-[60%] w-[60%] rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, #1d4980 0%, transparent 70%)' }}
      />
      {/* grid + scanlines + vignette — pure static patterns, no animation cost */}
      <div className="absolute inset-0 bg-stage-grid opacity-50" />
      <div className="absolute inset-0 bg-scanlines" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </div>
  )
}
