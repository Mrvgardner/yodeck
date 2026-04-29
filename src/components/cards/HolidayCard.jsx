import Card from '../Card.jsx'
import { scaleOf, pickByLen } from '../../utils/cardSize.js'

function formatDate(iso) {
  const d = new Date(iso + 'T12:00:00')
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()
}
function daysUntil(iso) {
  const target = new Date(iso + 'T00:00:00')
  const today  = new Date(); today.setHours(0, 0, 0, 0)
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24))
  if (diff <= 0) return 'TODAY'
  if (diff === 1) return 'TOMORROW'
  return `IN ${diff} DAYS`
}

const NAME_BANDS = [12, 20, 30]
const NAME_TIERS = [
  ['text-5xl leading-[0.95]', 'text-7xl leading-[0.9]',  'text-9xl leading-[0.9]'],
  ['text-4xl leading-[1.0]',  'text-6xl leading-[0.95]', 'text-8xl leading-[0.95]'],
  ['text-3xl leading-[1.05]', 'text-5xl leading-[1.0]',  'text-7xl leading-[1.0]'],
  ['text-2xl leading-[1.1]',  'text-4xl leading-[1.05]', 'text-6xl leading-[1.05]'],
]
const BLURB_BY_SCALE = ['text-2xl', 'text-3xl', 'text-4xl']

export default function HolidayCard({ data, size }) {
  const scale = scaleOf(size)
  const nCls  = pickByLen(data.name, scale, NAME_BANDS, NAME_TIERS)
  return (
    <Card surface="cream">
      <div className="flex flex-col h-full gap-4">
        <header className="flex-shrink-0 flex items-center justify-between">
          <span className="font-mono text-xl tracking-widest text-sc-orange">
            ☼ HOLIDAY
          </span>
          <span className="font-mono text-xl tracking-widest text-sc-navy/60">
            {daysUntil(data.date)}
          </span>
        </header>

        <main className="flex-1 min-h-0 overflow-hidden flex flex-col justify-center">
          <div className={`font-display break-words text-sc-navy ${nCls}`}>
            {data.name.toUpperCase()}
          </div>
          <div className="font-mono text-xl text-sc-navy/70 mt-3">
            {formatDate(data.date)}
          </div>
        </main>

        <footer className={`flex-shrink-0 font-body ${BLURB_BY_SCALE[scale]} text-sc-navy/80 border-t border-sc-navy/15 pt-4`}>
          {data.blurb}
        </footer>
      </div>
    </Card>
  )
}
