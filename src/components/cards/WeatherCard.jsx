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

// Build a one-line summary from the hourly strip — e.g.:
//   "Steady 60s · Light rain at 4 PM"
//   "Warming through afternoon · Clear all evening"
function summaryFor(hourly) {
  if (!hourly || hourly.length === 0) return ''
  const temps  = hourly.map(h => h.tempF)
  const min    = Math.min(...temps)
  const max    = Math.max(...temps)
  const range  = max - min
  const tempBit = range <= 3
    ? `Steady ${Math.round((min + max) / 2)}°`
    : `${min}° → ${max}°`
  // Find first hour with rain/snow/storm
  const wet = hourly.find(h => h.code >= 51)
  if (wet) {
    return `${tempBit} · ${wet.condition} at ${formatHour(wet.time)}`
  }
  return `${tempBit} · ${hourly[0].condition.toLowerCase()} ahead`
}

export default function WeatherCard({ data }) {
  if (!data) return null
  const hourly  = Array.isArray(data.hourly) ? data.hourly : []
  const summary = summaryFor(hourly)

  return (
    <Card surface="storm">
      <div className="flex flex-col h-full gap-3">
        <header className="flex-shrink-0 flex items-center justify-between">
          <span className="font-mono text-base tracking-widest text-sc-amber">
            ◐ FORECAST
          </span>
          <span className="font-mono text-base text-sc-cream/65 tracking-wider">
            {data.location?.toUpperCase?.() || data.location}
          </span>
        </header>

        {/* Main content = the forecast strip itself, taking the bulk of the card */}
        <main className="flex-1 min-h-0 overflow-hidden">
          <div className="grid grid-cols-6 gap-2 h-full">
            {hourly.map((h, i) => (
              <div
                key={h.time + i}
                className="flex flex-col items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10 px-1 py-2 min-h-0"
              >
                <span className="font-mono text-xs text-sc-cream/65 tracking-wider leading-tight">
                  {formatHour(h.time)}
                </span>
                <span className="text-3xl leading-none my-1" aria-hidden>
                  {glyphFor(h.code)}
                </span>
                <span className="font-display text-2xl text-sc-cream leading-none">
                  {h.tempF}°
                </span>
              </div>
            ))}
          </div>
        </main>

        <footer className="flex-shrink-0 border-t border-sc-cream/15 pt-3 flex items-center justify-between gap-3">
          <span className="font-mono text-xs text-sc-cream/45 tracking-widest whitespace-nowrap">
            NEXT 6 HOURS
          </span>
          <span className="font-display text-base text-sc-cream/85 truncate">
            {summary}
          </span>
        </footer>
      </div>
    </Card>
  )
}
