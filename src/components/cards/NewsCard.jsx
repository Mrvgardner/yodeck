import Card from '../Card.jsx'

// News card scales the headline font down based on how long the headline is,
// so very long titles still render fully without ellipsis. Short titles look
// big and punchy.
function sizeFor(title) {
  const len = title?.length || 0
  if (len <= 50)  return 'text-5xl leading-[1.05]'
  if (len <= 90)  return 'text-4xl leading-[1.1]'
  if (len <= 130) return 'text-3xl leading-[1.15]'
  return 'text-2xl leading-[1.2]'
}

export default function NewsCard({ data }) {
  const titleClass = sizeFor(data.title)
  return (
    <Card surface="glass">
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xl tracking-widest text-sc-amber">
            ✦ TECH NEWS
          </span>
          <span className="font-mono text-xl text-sc-cream/55 tracking-wider">
            HN · {data.score} pts
          </span>
        </div>

        <div className={`font-display text-sc-cream break-words ${titleClass}`}>
          {data.title}
        </div>

        <div className="flex items-center justify-between border-t border-sc-cream/15 pt-5">
          <span className="font-mono text-lg text-sc-cream/65 tracking-wider truncate max-w-[60%]">
            {data.host}
          </span>
          <span className="font-mono text-lg text-sc-cream/45">
            via @{data.by}
          </span>
        </div>
      </div>
    </Card>
  )
}
