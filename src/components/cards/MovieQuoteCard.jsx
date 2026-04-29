import { useEffect, useState } from 'react'
import Card from '../Card.jsx'

// Auto-fit so longer quotes don't truncate.
function quoteSize(text) {
  const len = text?.length || 0
  if (len <= 40)  return 'text-6xl leading-[1.0]'
  if (len <= 75)  return 'text-5xl leading-[1.05]'
  if (len <= 120) return 'text-4xl leading-[1.1]'
  if (len <= 180) return 'text-3xl leading-[1.15]'
  return 'text-2xl leading-[1.2]'
}

// Two-stage reveal: quote alone for HIDDEN_MS, then attribution fades in.
// A thin gold progress bar at the bottom fills over the hidden window so
// people walking up know something's coming. Layout never shifts — the
// attribution row is always rendered, just opacity 0 → 1 on reveal.
const HIDDEN_MS  = 25_000
const FADE_MS    = 1_200

export default function MovieQuoteCard({ data }) {
  const tCls = quoteSize(data.text)
  const gold = 'text-[#d4a560]'
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setRevealed(false)
    const id = setTimeout(() => setRevealed(true), HIDDEN_MS)
    return () => clearTimeout(id)
  }, [data.text])

  return (
    <Card surface="cinema">
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center justify-between">
          <span className={`font-mono text-xl tracking-widest ${gold}`}>
            ▶ NAME THAT QUOTE
          </span>
          <span className="font-mono text-xl text-sc-cream/55 tracking-wider">
            {revealed && data.year ? data.year : '·'}
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center min-h-0">
          <span className={`font-display ${gold} text-7xl leading-none mb-2`} aria-hidden>“</span>
          <div className={`font-display text-sc-cream break-words ${tCls}`}>
            {data.text}
          </div>
        </div>

        {/* Attribution row — always rendered to hold layout; opacity flips on reveal */}
        <div className="border-t border-[#d4a560]/25 pt-5">
          <div
            className="flex items-center justify-between transition-opacity ease-out"
            style={{
              opacity: revealed ? 1 : 0,
              transitionDuration: `${FADE_MS}ms`,
            }}
          >
            <span className="font-display text-3xl text-sc-cream/95 truncate max-w-[60%]">
              {data.character || ' '}
            </span>
            <span className={`font-mono text-lg ${gold} tracking-wider truncate max-w-[40%] text-right`}>
              {data.source || ' '}
            </span>
          </div>

          {/* Subtle countdown — thin gold bar at the bottom of the card.
              Fills from 0 → 100% over the hidden window. Disappears on reveal. */}
          <div
            className="absolute left-0 right-0 bottom-0 h-[3px] overflow-hidden rounded-b-[28px]"
            aria-hidden
          >
            <div
              className="h-full bg-[#d4a560]/70"
              style={{
                width: revealed ? '100%' : '0%',
                opacity: revealed ? 0 : 1,
                transition: revealed
                  ? `opacity ${FADE_MS}ms ease-out`
                  : `width ${HIDDEN_MS}ms linear`,
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
