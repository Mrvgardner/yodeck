import Card from '../Card.jsx'
import { scaleOf, pickByLen } from '../../utils/cardSize.js'

const NAME_BANDS = [12, 20]
const NAME_TIERS = [
  ['text-3xl leading-[1.0]',  'text-5xl leading-[0.95]', 'text-7xl leading-[0.95]'],
  ['text-2xl leading-[1.05]', 'text-4xl leading-[1.0]',  'text-6xl leading-[1.0]'],
  ['text-xl  leading-[1.1]',  'text-3xl leading-[1.05]', 'text-5xl leading-[1.05]'],
]

const NUM_BY_SCALE     = ['text-[6rem]', 'text-[10rem]', 'text-[16rem]']
const LABEL_BY_SCALE   = ['text-2xl',    'text-4xl',     'text-6xl']
const AVATAR_BY_SCALE  = ['h-[56px] w-[56px] text-2xl', 'h-[80px] w-[80px] text-4xl', 'h-[120px] w-[120px] text-6xl']

export default function AnniversaryCard({ data, size }) {
  const scale = scaleOf(size)
  const nCls  = pickByLen(data.name, scale, NAME_BANDS, NAME_TIERS)
  return (
    <Card surface="glass">
      <div className="flex flex-col h-full gap-4">
        <header className="flex-shrink-0 flex items-center justify-between">
          <span className="font-mono text-xl tracking-widest text-sc-amber">
            ◆ ANNIVERSARY
          </span>
          <span className="status-pip" aria-hidden />
        </header>

        <main className="flex-1 min-h-0 overflow-hidden flex flex-col justify-center">
          <div className="flex items-baseline gap-4">
            <div className={`font-display ${NUM_BY_SCALE[scale]} leading-[0.8] text-sc-orange`}>
              {data.years}
            </div>
            <div className={`font-display ${LABEL_BY_SCALE[scale]} text-sc-cream/90 leading-tight`}>
              YEARS<br />STRONG
            </div>
          </div>
        </main>

        <footer className="flex-shrink-0 flex items-center gap-4 border-t border-sc-cream/15 pt-4">
          <div
            className={`${AVATAR_BY_SCALE[scale]} flex flex-shrink-0 items-center justify-center rounded-xl bg-sc-orange/15 font-display text-sc-orange ring-1 ring-sc-orange/40`}
            aria-hidden
          >
            {data.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-display break-words text-sc-cream ${nCls}`}>
              {data.name}
            </div>
            {data.role && (
              <div className="font-mono text-base text-sc-cream/65 mt-1 truncate">
                {data.role}
              </div>
            )}
          </div>
        </footer>
      </div>
    </Card>
  )
}
