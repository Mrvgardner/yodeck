import Card from '../Card.jsx'
import { scaleOf, pickByLen } from '../../utils/cardSize.js'

const TITLE_BANDS = [25, 50, 90, 140]
const TITLE_TIERS = [
  ['text-4xl leading-[1.0]',  'text-6xl leading-[0.95]', 'text-8xl leading-[0.95]'],
  ['text-3xl leading-[1.1]',  'text-5xl leading-[1.0]',  'text-7xl leading-[1.0]'],
  ['text-2xl leading-[1.2]',  'text-4xl leading-[1.05]', 'text-6xl leading-[1.05]'],
  ['text-xl  leading-[1.25]', 'text-3xl leading-[1.1]',  'text-5xl leading-[1.1]'],
  ['text-lg  leading-[1.3]',  'text-2xl leading-[1.15]', 'text-4xl leading-[1.15]'],
]
const SNIPPET_BY_SCALE = ['text-base', 'text-xl', 'text-2xl']
const CLAMP_BY_SCALE   = ['line-clamp-3', 'line-clamp-4', 'line-clamp-6']

export default function FieldNoteCard({ data, size }) {
  const scale = scaleOf(size)
  const tCls  = pickByLen(data.title, scale, TITLE_BANDS, TITLE_TIERS)
  return (
    <Card surface="glass">
      <div className="flex flex-col h-full gap-4">
        <header className="flex-shrink-0 flex items-center justify-between">
          <span className="font-mono text-xl tracking-widest text-sc-amber">
            ⌁ FIELD NOTE
          </span>
          <span className="font-mono text-xl text-sc-cream/55">
            {data.timestamp}
          </span>
        </header>

        <main className="flex-1 min-h-0 overflow-hidden flex flex-col justify-center">
          <div className={`font-display text-sc-cream break-words ${tCls}`}>
            {data.title}
          </div>
          <p className={`font-body ${SNIPPET_BY_SCALE[scale]} text-sc-cream/80 mt-3 leading-snug ${CLAMP_BY_SCALE[scale]}`}>
            {data.snippet}
          </p>
        </main>

        <footer className="flex-shrink-0 flex items-center justify-between gap-4 border-t border-sc-cream/15 pt-4">
          <span className="font-mono text-base text-sc-cream/65 tracking-wider truncate min-w-0 flex-shrink">
            {(data.author || 'Team').toUpperCase()}
          </span>
          <span className="font-sc-bold text-base text-sc-orange whitespace-nowrap flex-shrink-0">
            switchcommerce.team
          </span>
        </footer>
      </div>
    </Card>
  )
}
