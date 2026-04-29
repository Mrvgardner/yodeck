import { useEffect, useState } from 'react'
import Card from '../Card.jsx'
import { scaleOf, pickByLen } from '../../utils/cardSize.js'

const QUOTE_BANDS = [25, 50, 90, 140]
const QUOTE_TIERS = [
  ['text-4xl leading-[1.0]',  'text-6xl leading-[0.95]', 'text-8xl leading-[0.95]'],
  ['text-3xl leading-[1.1]',  'text-5xl leading-[1.0]',  'text-7xl leading-[1.0]'],
  ['text-2xl leading-[1.2]',  'text-4xl leading-[1.05]', 'text-6xl leading-[1.05]'],
  ['text-xl  leading-[1.25]', 'text-3xl leading-[1.1]',  'text-5xl leading-[1.1]'],
  ['text-lg  leading-[1.3]',  'text-2xl leading-[1.15]', 'text-4xl leading-[1.15]'],
]
const GLYPH_BY_SCALE     = ['text-3xl',         'text-5xl',         'text-7xl']
const CHARACTER_BY_SCALE = ['text-2xl',         'text-3xl',         'text-5xl']

const HIDDEN_MS = 25_000
const FADE_MS   = 1_200

export default function MovieQuoteCard({ data, size }) {
  const scale = scaleOf(size)
  const tCls  = pickByLen(data.text, scale, QUOTE_BANDS, QUOTE_TIERS)
  const gold  = 'text-[#d4a560]'
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setRevealed(false)
    const id = setTimeout(() => setRevealed(true), HIDDEN_MS)
    return () => clearTimeout(id)
  }, [data.text])

  return (
    <Card surface="cinema">
      <div className="flex flex-col h-full gap-4">
        <header className="flex-shrink-0 flex items-center justify-between">
          <span className={`font-mono text-xl tracking-widest ${gold}`}>
            ▶ NAME THAT QUOTE
          </span>
          <span className="font-mono text-xl text-sc-cream/55 tracking-wider">
            {revealed && data.year ? data.year : '·'}
          </span>
        </header>

        <main className="flex-1 min-h-0 overflow-hidden flex flex-col justify-center">
          <span className={`font-display ${gold} ${GLYPH_BY_SCALE[scale]} leading-none mb-1`} aria-hidden>“</span>
          <div className={`font-display text-sc-cream break-words ${tCls}`}>
            {data.text}
          </div>
        </main>

        <footer
          className="flex-shrink-0 flex items-center justify-between gap-4 border-t pt-4 transition-all ease-out"
          style={{
            opacity: revealed ? 1 : 0,
            borderColor: revealed ? 'rgba(212, 165, 96, 0.25)' : 'transparent',
            transitionDuration: `${FADE_MS}ms`,
          }}
        >
          <span className={`font-display ${CHARACTER_BY_SCALE[scale]} text-sc-cream/95 truncate min-w-0`}>
            {data.character || ' '}
          </span>
          <span className={`font-mono text-base ${gold} tracking-wider truncate flex-shrink-0 max-w-[45%] text-right`}>
            {data.source || ' '}
          </span>
        </footer>
      </div>

      {/* Countdown bar */}
      <div
        className="absolute left-0 right-0 bottom-0 h-[4px] overflow-hidden rounded-b-[28px]"
        aria-hidden
        style={{
          opacity: revealed ? 0 : 1,
          transition: `opacity ${FADE_MS}ms ease-out`,
        }}
      >
        <div
          className="h-full bg-[#d4a560]"
          style={{ animation: `fillBar ${HIDDEN_MS}ms linear forwards` }}
        />
      </div>
    </Card>
  )
}
