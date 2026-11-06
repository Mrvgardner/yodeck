import { memo } from 'react'

// Atmospheric backdrop — fully static for Yodeck performance.
// We previously had two 120–140px blur blobs animated with framer-motion;
// those caused continuous GPU compositing and made the whole page jerky on
// the kitchen player. Replaced with static radial gradients that give the
// same visual depth at zero animation cost.
// Per-theme base wash and lower-left glow; the upper-right glow varies more
// (Halloween moon, fall sunset, Christmas moonlight) and is handled inline below.
const BASE = {
  normal:    'radial-gradient(ellipse at 20% 0%, #002b5e 0%, #000d22 55%, #000814 100%)',
  halloween: 'radial-gradient(ellipse at 20% 0%, #2a0f4a 0%, #0c0620 55%, #05030f 100%)',
  fall:      'radial-gradient(ellipse at 20% 0%, #3b1d0c 0%, #140b10 55%, #07050a 100%)',
  christmas: 'radial-gradient(ellipse at 20% 0%, #0f3a2a 0%, #071a16 55%, #030a0b 100%)',
}
const LOWER_GLOW = { normal: '#1d4980', halloween: '#5b1f8a', fall: '#a33b12', christmas: '#8b1a2b' }

function Background({ theme }) {
  const halloween = theme === 'halloween'
  const fall      = theme === 'fall'
  const christmas = theme === 'christmas'
  const key       = BASE[theme] ? theme : 'normal'
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-sc-navy-deep">
      {/* base wash: deep navy, or the theme's purple / dusk brown / evergreen */}
      <div className="absolute inset-0" style={{ background: BASE[key] }} />
      {halloween ? (
        /* harvest moon upper-right — a soft disc plus a wide glow */
        <>
          <div
            className="absolute -top-[18%] right-[-6%] h-[70%] w-[50%] rounded-full opacity-40"
            style={{ background: 'radial-gradient(circle, #ff8a2b 0%, transparent 65%)' }}
          />
          <div
            className="absolute top-[6%] right-[9%] h-[300px] w-[300px] rounded-full opacity-25"
            style={{ background: 'radial-gradient(circle at 40% 40%, #ffe2b0 0%, #ffb547 55%, #ff7a1a 100%)' }}
          />
        </>
      ) : christmas ? (
        /* soft, cold moonlight upper-right */
        <div
          className="absolute -top-[16%] right-[-6%] h-[60%] w-[50%] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #fff6d8 0%, #9fd3ff 40%, transparent 70%)' }}
        />
      ) : fall ? (
        /* low autumn sunset glow upper-right */
        <div
          className="absolute -top-[16%] right-[-8%] h-[65%] w-[58%] rounded-full opacity-35"
          style={{ background: 'radial-gradient(circle, #ff8a2b 0%, #c2410c 35%, transparent 70%)' }}
        />
      ) : (
        /* static amber glow upper-right */
        <div
          className="absolute -top-[12%] right-[-8%] h-[55%] w-[55%] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #ff4f00 0%, transparent 70%)' }}
        />
      )}
      {/* static glow lower-left (blue normally; purple, rust or cranberry when themed) */}
      <div
        className="absolute bottom-[-12%] left-[-10%] h-[60%] w-[60%] rounded-full opacity-30"
        style={{ background: `radial-gradient(circle, ${LOWER_GLOW[key]} 0%, transparent 70%)` }}
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

export default memo(Background)
