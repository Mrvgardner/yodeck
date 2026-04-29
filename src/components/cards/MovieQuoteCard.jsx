import { useEffect, useState } from 'react'
import Card from '../Card.jsx'

// Sized to fit cleanly even in a 1x1 cell at TV resolution.
// Larger cards (2x1, 1x2) just give the text more breathing room.
function quoteSize(text) {
  const len = text?.length || 0
  if (len <= 25)  return 'text-4xl leading-[1.0]'
  if (len <= 50)  return 'text-3xl leading-[1.1]'
  if (len <= 90)  return 'text-2xl leading-[1.2]'
  if (len <= 140) return 'text-xl leading-[1.25]'
  return 'text-lg leading-[1.3]'
}

const HIDDEN_MS = 25_000
const FADE_MS   = 1_200

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
          <span className={`font-display ${gold} text-3xl leading-none mb-1`} aria-hidden>“</span>
          <div className={`font-display text-sc-cream break-words ${tCls}`}>
            {data.text}
          </div>
        </main>

        {/* Footer holds layout — opacity flips on reveal so it never shifts */}
        <footer
          className="flex-shrink-0 flex items-center justify-between gap-4 border-t pt-4 transition-all ease-out"
          style={{
            opacity: revealed ? 1 : 0,
            borderColor: revealed ? 'rgba(212, 165, 96, 0.25)' : 'transparent',
            transitionDuration: `${FADE_MS}ms`,
          }}
        >
          <span className="font-display text-2xl text-sc-cream/95 truncate min-w-0">
            {data.character || ' '}
          </span>
          <span className={`font-mono text-base ${gold} tracking-wider truncate flex-shrink-0 max-w-[45%] text-right`}>
            {data.source || ' '}
          </span>
        </footer>
      </div>

      {/* Countdown bar — fills over the hidden window via CSS keyframe,
          fades on reveal. Sits at the very bottom edge of the card. */}
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
