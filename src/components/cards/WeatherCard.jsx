import Card from '../Card.jsx'

// Map weather code → small glyph for the hourly strip.
// Kept tiny on purpose so the card reads as data, not decoration.
function glyphFor(code) {
  if (code == null)         return '·'
  if (code === 0)           return '☀'
  if (code <= 3)            return '⛅'
  if (code <= 48)           return '☁'
  if (code <= 67)           return '☂'
  if (code <= 77)           return '❄'
  if (code <= 82)           return '☂'
  if (code >= 95)           return '⚡'
  return '·'
}

function formatHour(iso) {
  const d = new Date(iso)
  // 12-hour without minutes for the forecast strip — "3 PM"
  return d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }).replace(/\s/, ' ')
}

export default function WeatherCard({ data }) {
  if (!data) return null
  const funny = data.funnyCondition
  const conditionText = funny || data.condition
  const hourly = Array.isArray(data.hourly) ? data.hourly : []

  return (
    <Card surface="storm">
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xl tracking-widest text-sc-amber">
            ◐ FORECAST
          </span>
          <span className="font-mono text-xl text-sc-cream/65 tracking-wider">
            {data.location?.toUpperCase?.() || data.location}
          </span>
        </div>

        {/* Current conditions row — compact so the forecast strip gets room */}
        <div className="flex items-end gap-5">
          <div className="font-display text-[9rem] leading-[0.85] text-sc-cream">
            {data.tempF}
          </div>
          <div className="flex flex-col gap-1 pb-3">
            <span className="font-display text-4xl text-sc-amber leading-none">°F</span>
            <span className={`font-display text-2xl leading-tight ${funny ? 'text-sc-amber italic' : 'text-sc-cream/85'}`}>
              {conditionText}
            </span>
            <span className="font-mono text-base text-sc-cream/55 mt-1 tracking-wider">
              HI {data.highF}° · LO {data.lowF}° · WIND {data.windMph} MPH
            </span>
          </div>
        </div>

        {/* Hourly strip — compact 3-line layout (time / glyph / temp) tuned
            so the bottom row doesn't clip even at the widest grid spans. */}
        <div className="border-t border-sc-cream/15 pt-3">
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
        </div>
      </div>
    </Card>
  )
}
