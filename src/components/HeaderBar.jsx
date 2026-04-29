import { memo, useEffect, useState } from 'react'
import LiveClock from './LiveClock.jsx'

function useTodayDate() {
  // Re-evaluates only on midnight crossings — avoids a per-second re-render
  // for a value that changes once a day.
  const [today, setToday] = useState(() => new Date())
  useEffect(() => {
    const now = new Date()
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1)
    const t = setTimeout(() => setToday(new Date()), nextMidnight - now)
    return () => clearTimeout(t)
  }, [today])
  return today
}

function HeaderBarBase({ weather }) {
  const today = useTodayDate()
  const date = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const [weekday, ...rest] = date.split(',')
  const restDate = rest.join(',').trim().toUpperCase()

  return (
    <header className="flex items-center justify-between px-12 py-8 border-b border-sc-cream/10">
      {/* Brand mark */}
      <div className="flex items-center gap-6">
        <img src="/logos/sc-logo-white.png" alt="Switch Commerce" className="h-20" />
        <div className="hidden xl:flex flex-col leading-tight border-l border-sc-cream/15 pl-6">
          <span className="font-mono text-base text-sc-cream/50 tracking-widest">CHANNEL</span>
          <span className="font-sc-bold text-3xl text-sc-cream">KITCHEN</span>
        </div>
      </div>

      {/* Live clock — isolated so per-second ticks don't re-render the rest */}
      <LiveClock />

      {/* Date + weather pill */}
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="font-sc-bold text-2xl text-sc-cream">{weekday}</div>
          <div className="font-mono text-xl text-sc-cream/60 tracking-wider">{restDate}</div>
        </div>
        {weather && (
          <div className="flex items-center gap-3 rounded-full bg-sc-orange/15 ring-1 ring-sc-orange/40 px-6 py-3">
            <span className="status-pip" aria-hidden />
            <span className="font-display text-4xl text-sc-cream">
              {weather.tempF}°
            </span>
            <span className={`font-mono text-lg tracking-wider ${weather.funnyCondition ? 'text-sc-amber italic' : 'text-sc-cream/70'}`}>
              {(weather.funnyCondition || weather.condition || '').toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </header>
  )
}

// Memo so HeaderBar only re-renders when weather actually changes (every
// ~15 min) — not whenever a parent re-renders for unrelated reasons.
export default memo(HeaderBarBase)
