import Card from '../Card.jsx'
import { scaleOf, pickByLen } from '../../utils/cardSize.js'

function fmtRange(start, end) {
  const s = new Date(start + 'T12:00:00')
  const e = new Date(end   + 'T12:00:00')
  const opt = { month: 'short', day: 'numeric' }
  if (start === end) return s.toLocaleDateString('en-US', opt).toUpperCase()
  return `${s.toLocaleDateString('en-US', opt)} – ${e.toLocaleDateString('en-US', opt)}`.toUpperCase()
}

const NAME_BANDS = [12, 20]
const NAME_TIERS = [
  ['text-4xl leading-[1.0]',  'text-6xl leading-[0.95]', 'text-8xl leading-[0.95]'],
  ['text-3xl leading-[1.05]', 'text-5xl leading-[1.0]',  'text-7xl leading-[1.0]'],
  ['text-2xl leading-[1.1]',  'text-4xl leading-[1.05]', 'text-6xl leading-[1.05]'],
]
const AVATAR_BY_SCALE = ['h-[64px] w-[64px] text-2xl', 'h-[100px] w-[100px] text-4xl', 'h-[140px] w-[140px] text-6xl']
const DAYS_BY_SCALE   = ['text-3xl', 'text-5xl', 'text-7xl']

export default function WhosOutCard({ data, size }) {
  const scale = scaleOf(size)
  const nCls  = pickByLen(data.name, scale, NAME_BANDS, NAME_TIERS)
  return (
    <Card surface="glass">
      <div className="flex flex-col h-full gap-4">
        <header className="flex-shrink-0 flex items-center justify-between">
          <span className="font-mono text-xl tracking-widest text-sc-amber">
            ✈ WHO'S OUT
          </span>
          <span className="font-mono text-base text-sc-cream/65 tracking-wider whitespace-nowrap">
            {fmtRange(data.startDate, data.endDate)}
          </span>
        </header>

        <main className="flex-1 min-h-0 overflow-hidden flex items-center gap-5">
          <div
            className={`${AVATAR_BY_SCALE[scale]} flex flex-shrink-0 items-center justify-center rounded-2xl bg-sc-amber/15 font-display text-sc-amber ring-1 ring-sc-amber/40`}
            aria-hidden
          >
            {data.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-display break-words text-sc-cream ${nCls}`}>
              {data.name}
            </div>
            <div className="font-mono text-base text-sc-cream/60 mt-2 tracking-wider">
              OUT OF OFFICE
            </div>
          </div>
        </main>

        <footer className="flex-shrink-0 flex items-end justify-between border-t border-sc-cream/15 pt-4">
          <span className={`font-display ${DAYS_BY_SCALE[scale]} text-sc-orange leading-none`}>
            {data.days ?? '—'}
            <span className="font-mono text-sm text-sc-cream/65 ml-2 tracking-wider align-middle">
              DAY{data.days === 1 ? '' : 'S'}
            </span>
          </span>
          <span className="font-mono text-xs text-sc-cream/40 tracking-wider">
            BAMBOO HR
          </span>
        </footer>
      </div>
    </Card>
  )
}
