import Card from '../Card.jsx'

export default function NewsCard({ data }) {
  return (
    <Card surface="glass">
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xl tracking-widest text-sc-amber">
            ✦ TECH NEWS
          </span>
          <span className="font-mono text-xl text-sc-cream/50 tracking-wider">
            HN · {data.score} pts
          </span>
        </div>

        <div className="font-display text-5xl leading-[0.95] text-sc-cream line-clamp-5">
          {data.title}
        </div>

        <div className="flex items-center justify-between border-t border-sc-cream/10 pt-5">
          <span className="font-mono text-xl text-sc-cream/60 tracking-wider truncate max-w-[60%]">
            {data.host}
          </span>
          <span className="font-mono text-xl text-sc-cream/40">
            via @{data.by}
          </span>
        </div>
      </div>
    </Card>
  )
}
