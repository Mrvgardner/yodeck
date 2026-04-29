import Card from '../Card.jsx'
import { scaleOf } from '../../utils/cardSize.js'

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
function summaryFor(hourly) {
  if (!hourly || hourly.length === 0) return ''
  const temps = hourly.map(h => h.tempF)
  const min   = Math.min(...temps)
  const max   = Math.max(...temps)
  const range = max - min
  const tempBit = range <= 3
    ? `Steady ${Math.round((min + max) / 2)}°`
    : `${min}° → ${max}°`
  const wet = hourly.find(h => h.code >= 51)
  if (wet) return `${tempBit} · ${wet.condition} at ${formatHour(wet.time)}`
  return `${tempBit} · ${hourly[0].condition.toLowerCase()} ahead`
}

const TIME_BY_SCALE  = ['text-xs',     'text-base',   'text-xl']
const GLYPH_BY_SCALE = ['text-3xl',    'text-5xl',    'text-7xl']
const TEMP_BY_SCALE  = ['text-2xl',    'text-4xl',    'text-6xl']
const CELL_PAD       = ['py-2',        'py-4',        'py-6']

export default function WeatherCard({ data, size }) {
  if (!data) return null
  const scale  = scaleOf(size)
  const hourly = Array.isArray(data.hourly) ? data.hourly : []
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

        <main className="flex-1 min-h-0 overflow-hidden">
          <div className="grid grid-cols-6 gap-2 h-full">
            {hourly.map((h, i) => (
              <div
                key={h.time + i}
                className={`flex flex-col items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10 px-1 ${CELL_PAD[scale]} min-h-0`}
              >
                <span className={`font-mono ${TIME_BY_SCALE[scale]} text-sc-cream/65 tracking-wider leading-tight`}>
                  {formatHour(h.time)}
                </span>
                <span className={`${GLYPH_BY_SCALE[scale]} leading-none my-1`} aria-hidden>
                  {glyphFor(h.code)}
                </span>
                <span className={`font-display ${TEMP_BY_SCALE[scale]} text-sc-cream leading-none`}>
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
