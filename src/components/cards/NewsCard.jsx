import Card from '../Card.jsx'
import { scaleOf, pickByLen } from '../../utils/cardSize.js'

const TITLE_BANDS = [30, 60, 100, 150]
const TITLE_TIERS = [
  ['text-4xl leading-[1.05]', 'text-6xl leading-[1.0]',  'text-8xl leading-[1.0]'],
  ['text-3xl leading-[1.1]',  'text-5xl leading-[1.05]', 'text-7xl leading-[1.05]'],
  ['text-2xl leading-[1.2]',  'text-4xl leading-[1.1]',  'text-6xl leading-[1.1]'],
  ['text-xl  leading-[1.25]', 'text-3xl leading-[1.15]', 'text-5xl leading-[1.15]'],
  ['text-lg  leading-[1.3]',  'text-2xl leading-[1.2]',  'text-4xl leading-[1.2]'],
]
const DESC_BY_SCALE  = ['text-base', 'text-xl', 'text-2xl']
const CLAMP_BY_SCALE = ['line-clamp-3', 'line-clamp-4', 'line-clamp-6']

export default function NewsCard({ data, size }) {
  const scale = scaleOf(size)
  const tCls  = pickByLen(data.title, scale, TITLE_BANDS, TITLE_TIERS)
  return (
    <Card surface="glass">
      <div className="flex flex-col h-full gap-4">
        <header className="flex-shrink-0 flex items-center justify-between">
          <span className="font-mono text-xl tracking-widest text-sc-amber">
            ✦ TECH NEWS
          </span>
          <span className="font-mono text-base text-sc-cream/55 tracking-wider truncate max-w-[55%]">
            {data.host}
          </span>
        </header>

        <main className="flex-1 min-h-0 overflow-hidden flex flex-col justify-center">
          <div className={`font-display text-sc-cream break-words ${tCls}`}>
            {data.title}
          </div>
          {data.description && (
            <p className={`font-body ${DESC_BY_SCALE[scale]} text-sc-cream/75 mt-3 leading-snug ${CLAMP_BY_SCALE[scale]}`}>
              {data.description}
            </p>
          )}
        </main>
      </div>
    </Card>
  )
}
