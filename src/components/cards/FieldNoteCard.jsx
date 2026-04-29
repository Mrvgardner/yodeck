import Card from '../Card.jsx'

function titleSize(title) {
  const len = title?.length || 0
  if (len <= 40)  return 'text-5xl leading-[1.0]'
  if (len <= 70)  return 'text-4xl leading-[1.05]'
  if (len <= 110) return 'text-3xl leading-[1.1]'
  return 'text-2xl leading-[1.15]'
}

export default function FieldNoteCard({ data }) {
  const tCls = titleSize(data.title)
  return (
    <Card surface="glass">
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xl tracking-widest text-sc-amber">
            ⌁ FIELD NOTE
          </span>
          <span className="font-mono text-xl text-sc-cream/55">
            {data.timestamp}
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center min-h-0">
          <div className={`font-display text-sc-cream break-words ${tCls}`}>
            {data.title}
          </div>
          <p className="font-body text-2xl text-sc-cream/80 mt-5 leading-snug line-clamp-4">
            {data.snippet}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-sc-cream/15 pt-5">
          <span className="font-mono text-lg text-sc-cream/65 tracking-wider truncate min-w-0 flex-shrink">
            {(data.author || 'Team').toUpperCase()}
          </span>
          <span className="font-sc-bold text-lg text-sc-orange whitespace-nowrap flex-shrink-0">
            switchcommerce.team
          </span>
        </div>
      </div>
    </Card>
  )
}
