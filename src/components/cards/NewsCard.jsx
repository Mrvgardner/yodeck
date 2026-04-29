import Card from '../Card.jsx'

function titleSize(title) {
  const len = title?.length || 0
  if (len <= 35)  return 'text-5xl leading-[1.0]'
  if (len <= 70)  return 'text-4xl leading-[1.05]'
  if (len <= 110) return 'text-3xl leading-[1.1]'
  if (len <= 160) return 'text-2xl leading-[1.15]'
  return 'text-xl leading-[1.2]'
}

export default function NewsCard({ data }) {
  const tCls = titleSize(data.title)
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
            <p className="font-body text-lg text-sc-cream/75 mt-3 leading-snug line-clamp-3">
              {data.description}
            </p>
          )}
        </main>
      </div>
    </Card>
  )
}
