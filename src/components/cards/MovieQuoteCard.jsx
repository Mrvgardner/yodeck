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

export default function MovieQuoteCard({ data }) {
  const tCls = quoteSize(data.text)
  // Warm gold accent against the cinema-charcoal surface.
  const gold = 'text-[#d4a560]'
  return (
    <Card surface="cinema">
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center justify-between">
          <span className={`font-mono text-xl tracking-widest ${gold}`}>
            ▶ NOW QUOTING
          </span>
          {data.year && (
            <span className="font-mono text-xl text-sc-cream/55 tracking-wider">
              {data.year}
            </span>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-center min-h-0">
          <span className={`font-display ${gold} text-7xl leading-none mb-2`} aria-hidden>“</span>
          <div className={`font-display text-sc-cream break-words ${tCls}`}>
            {data.text}
          </div>
        </div>

        <div className={`flex items-center justify-between border-t border-[#d4a560]/25 pt-5`}>
          <span className="font-display text-3xl text-sc-cream/95 truncate max-w-[60%]">
            {data.character}
          </span>
          <span className={`font-mono text-lg ${gold} tracking-wider truncate max-w-[40%] text-right`}>
            {data.source}
          </span>
        </div>
      </div>
    </Card>
  )
}
