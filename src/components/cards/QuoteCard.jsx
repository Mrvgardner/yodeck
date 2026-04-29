import Card from '../Card.jsx'

// Auto-fit so longer "motivational" punchlines don't get cropped.
// Sized for the amber surface; tighter line-height than other cards
// because Bebas Neue can look loose at the largest sizes.
function quoteSize(text) {
  const len = text?.length || 0
  if (len <= 35)  return 'text-7xl leading-[0.95]'
  if (len <= 65)  return 'text-6xl leading-[1.0]'
  if (len <= 100) return 'text-5xl leading-[1.05]'
  if (len <= 140) return 'text-4xl leading-[1.1]'
  if (len <= 200) return 'text-3xl leading-[1.15]'
  return 'text-2xl leading-[1.2]'
}

export default function QuoteCard({ data }) {
  const tCls = quoteSize(data.text)
  return (
    <Card surface="amber">
      <div className="flex flex-col h-full justify-between">
        <span className="font-mono text-xl tracking-widest text-white/85">
          ❝ THOUGHT
        </span>

        <div className="flex-1 flex flex-col justify-center min-h-0">
          <div className={`font-display text-white break-words ${tCls}`}>
            {data.text}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/25 pt-5">
          <span className="font-mono text-lg text-white/85 tracking-wider truncate max-w-[80%]">
            — {data.attribution}
          </span>
          <img src="/logos/sc-icon-white.png" alt="" className="h-8 opacity-90 flex-shrink-0" />
        </div>
      </div>
    </Card>
  )
}
