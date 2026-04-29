import Card from '../Card.jsx'

function titleSize(title) {
  const len = title?.length || 0
  if (len <= 30)  return 'text-5xl leading-[1.0]'
  if (len <= 55)  return 'text-4xl leading-[1.05]'
  if (len <= 90)  return 'text-3xl leading-[1.1]'
  if (len <= 140) return 'text-2xl leading-[1.15]'
  return 'text-xl leading-[1.2]'
}

export default function FieldNoteCard({ data }) {
  const tCls = titleSize(data.title)
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
          <p className="font-body text-xl text-sc-cream/80 mt-4 leading-snug line-clamp-3">
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
