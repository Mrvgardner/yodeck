import Card from '../Card.jsx'

function glyphFor(code) {
  if (code == null) return '·'
  if (code === 0)   return '☀'
  if (code <= 3)    return '⛅'
  if (code <= 48)   return '☁'
  if (code <= 67)   return '☂'
  if (code <= 77)   return '❄'
  if (code <= 82)   return '☂'
  if (code >= 95)   return '⚡'
  return '·'
}

function formatHour(iso) {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }).replace(/\s/, ' ')
}

export default function WeatherCard({ data }) {
  if (!data) return null
  const funny = data.funnyCondition
  const conditionText = funny || data.condition
  const hourly = Array.isArray(data.hourly) ? data.hourly : []

  return (
    <Card surface="storm">
      <div className="flex flex-col h-full gap-4">
        <header className="flex-shrink-0 flex items-center justify-between">
          <span className="font-mono text-xl tracking-widest text-sc-amber">
            ◐ FORECAST
          </span>
          <span className="font-mono text-xl text-sc-cream/65 tracking-wider">
            {data.location?.toUpperCase?.() || data.location}
          </span>
        </header>

        <main className="flex-1 min-h-0 overflow-hidden flex items-end gap-5">
          <div className="font-display text-[8rem] leading-[0.85] text-sc-cream">
            {data.tempF}
          </div>
          <div className="flex flex-col gap-1 pb-2 min-w-0">
            <span className="font-display text-3xl text-sc-amber leading-none">°F</span>
            <span className={`font-display text-2xl leading-tight break-words ${funny ? 'text-sc-amber italic' : 'text-sc-cream/85'}`}>
              {conditionText}
            </span>
            <span className="font-mono text-sm text-sc-cream/55 mt-1 tracking-wider whitespace-nowrap">
              HI {data.highF}° · LO {data.lowF}° · {data.windMph} MPH
            </span>
          </div>
        </main>

        <footer className="flex-shrink-0 border-t border-sc-cream/15 pt-3">
          <div className="font-mono text-xs text-sc-cream/45 tracking-widest mb-2">
            NEXT HOURS
          </div>
          <div className="grid grid-cols-6 gap-2">
            {hourly.map((h, i) => (
              <div
                key={h.time + i}
                className="flex flex-col items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10 px-1 py-2"
              >
                <span className="font-mono text-xs text-sc-cream/65 tracking-wider leading-tight">
                  {formatHour(h.time)}
                </span>
                <span className="text-2xl leading-none my-0.5" aria-hidden>
                  {glyphFor(h.code)}
                </span>
                <span className="font-display text-xl text-sc-cream leading-none">
                  {h.tempF}°
                </span>
              </div>
            ))}
          </div>
        </footer>
      </div>
    </Card>
  )
}
