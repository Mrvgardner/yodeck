import { motion } from 'framer-motion'

// Atmospheric backdrop: layered radial gradients + grid + scanlines.
// Two slow-drifting orange/blue glows give the stage depth without distracting.
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
      {/* drifting amber glow upper-right */}
      <motion.div
        className="absolute -top-[12%] right-[-8%] h-[55%] w-[55%] rounded-full blur-[120px] opacity-30"
        style={{ background: 'radial-gradient(circle, #ff4f00 0%, transparent 65%)' }}
        animate={{ x: [0, 40, -10, 0], y: [0, 20, -10, 0] }}
        transition={{ duration: 60, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* drifting blue glow lower-left */}
      <motion.div
        className="absolute bottom-[-12%] left-[-10%] h-[60%] w-[60%] rounded-full blur-[140px] opacity-40"
        style={{ background: 'radial-gradient(circle, #1d4980 0%, transparent 65%)' }}
        animate={{ x: [0, -30, 20, 0], y: [0, -20, 15, 0] }}
        transition={{ duration: 75, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* grid */}
      <div className="absolute inset-0 bg-stage-grid opacity-60" />
      {/* scanlines */}
      <div className="absolute inset-0 bg-scanlines" />
      {/* vignette */}
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
