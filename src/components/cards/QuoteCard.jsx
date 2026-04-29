import Card from '../Card.jsx'
import { scaleOf, pickByLen } from '../../utils/cardSize.js'

const QUOTE_BANDS = [25, 50, 80, 130, 180]
const QUOTE_TIERS = [
  ['text-5xl leading-[1.0]',  'text-7xl leading-[0.95]', 'text-9xl leading-[0.95]'],
  ['text-4xl leading-[1.05]', 'text-6xl leading-[1.0]',  'text-8xl leading-[1.0]'],
  ['text-3xl leading-[1.1]',  'text-5xl leading-[1.05]', 'text-7xl leading-[1.05]'],
  ['text-2xl leading-[1.2]',  'text-4xl leading-[1.1]',  'text-6xl leading-[1.1]'],
  ['text-xl  leading-[1.25]', 'text-3xl leading-[1.15]', 'text-5xl leading-[1.15]'],
  ['text-lg  leading-[1.3]',  'text-2xl leading-[1.2]',  'text-4xl leading-[1.2]'],
]

export default function QuoteCard({ data, size }) {
  const scale = scaleOf(size)
  const tCls  = pickByLen(data.text, scale, QUOTE_BANDS, QUOTE_TIERS)
  return (
    <Card surface="amber">
      <div className="flex flex-col h-full gap-4">
        <header className="flex-shrink-0">
          <span className="font-mono text-xl tracking-widest text-white/85">
            ❝ THOUGHT
          </span>
        </header>

        <main className="flex-1 min-h-0 overflow-hidden flex flex-col justify-center">
          <div className={`font-display text-white break-words ${tCls}`}>
            {data.text}
          </div>
        </main>

        <footer className="flex-shrink-0 flex items-center justify-between gap-4 border-t border-white/25 pt-4">
          <span className="font-mono text-base text-white/85 tracking-wider truncate min-w-0">
            — {data.attribution}
          </span>
          <img src="/logos/sc-icon-white.png" alt="" className="h-8 opacity-90 flex-shrink-0" />
        </footer>
      </div>
    </Card>
  )
}
