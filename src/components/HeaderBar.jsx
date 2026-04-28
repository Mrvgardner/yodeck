import { useEffect, useState } from 'react'

function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

export default function HeaderBar({ weather }) {
  const now = useNow()
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  const date = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

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

      {/* Live clock */}
      <div className="flex items-baseline gap-4">
        <span className="font-display text-[8rem] leading-none text-sc-cream tracking-tight">
          {time.replace(/\sAM|\sPM/i, '')}
        </span>
        <span className="font-display text-5xl text-sc-orange">
          {time.match(/AM|PM/i)?.[0]}
        </span>
      </div>

      {/* Date + weather pill */}
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="font-sc-bold text-2xl text-sc-cream">
            {date.split(',')[0]}
          </div>
          <div className="font-mono text-xl text-sc-cream/60 tracking-wider">
            {date.split(',').slice(1).join(',').trim().toUpperCase()}
          </div>
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
