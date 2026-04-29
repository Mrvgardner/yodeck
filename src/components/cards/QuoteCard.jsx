import Card from '../Card.jsx'

function quoteSize(text) {
  const len = text?.length || 0
  if (len <= 25)  return 'text-5xl leading-[1.0]'
  if (len <= 50)  return 'text-4xl leading-[1.05]'
  if (len <= 80)  return 'text-3xl leading-[1.1]'
  if (len <= 130) return 'text-2xl leading-[1.2]'
  if (len <= 180) return 'text-xl leading-[1.25]'
  return 'text-lg leading-[1.3]'
}

export default function QuoteCard({ data }) {
  const tCls = quoteSize(data.text)
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
