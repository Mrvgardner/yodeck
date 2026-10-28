import { memo, useEffect, useState } from 'react'

// Self-contained clock so the rest of HeaderBar (logo, weather pill, date)
// doesn't re-render. The display has minute resolution, so we wake once per
// minute, scheduled against the wall clock so it never drifts.
function LiveClockBase() {
  const [time, setTime] = useState(() => fmt(new Date()))
  useEffect(() => {
    let id
    const schedule = () => {
      const now = new Date()
      // +50ms so we land just after the boundary, not just before it.
      const ms = 60_000 - (now.getSeconds() * 1000 + now.getMilliseconds()) + 50
      id = setTimeout(() => {
        setTime(fmt(new Date()))
        schedule()
      }, ms)
    }
    schedule()
    return () => clearTimeout(id)
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

const TIME_FMT = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
function fmt(d) {
  return TIME_FMT.format(d)
}

export default memo(LiveClockBase)
