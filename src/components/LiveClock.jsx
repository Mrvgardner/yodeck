import { memo, useEffect, useState } from 'react'

// Self-contained clock so the rest of HeaderBar (logo, weather pill, date)
// doesn't re-render every second. Tick on a 1s interval, but only the time
// string needs to flip — the surrounding tree stays stable.
function LiveClockBase() {
  const [time, setTime] = useState(() => fmt(new Date()))
  useEffect(() => {
    // Align the next tick to the start of the next minute so the seconds
    // boundary doesn't drift. After alignment we tick every 1s for accuracy.
    const id = setInterval(() => setTime(fmt(new Date())), 1000)
    return () => clearInterval(id)
  }, [])

  // Split the trailing AM/PM so the meridiem can be styled separately.
  const [main, meridiem] = time.split(' ')

  return (
    <div className="flex items-baseline gap-4">
      <span className="font-display text-[8rem] leading-none text-sc-cream tracking-tight">
        {main}
      </span>
      <span className="font-display text-5xl text-sc-orange">
        {meridiem}
      </span>
    </div>
  )
}

function fmt(d) {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export default memo(LiveClockBase)
