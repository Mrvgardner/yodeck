import Card from '../Card.jsx'

// Auto-fit title font based on length so the headline always fits.
// Description below gives the headline context — short cryptic titles
// stop being mysterious because the summary fills in the gap.
function titleSize(title) {
  const len = title?.length || 0
  if (len <= 45)  return 'text-5xl leading-[1.05]'
  if (len <= 80)  return 'text-4xl leading-[1.1]'
  if (len <= 120) return 'text-3xl leading-[1.15]'
  return 'text-2xl leading-[1.2]'
}

export default function NewsCard({ data }) {
  const tCls = titleSize(data.title)
  return (
    <Card surface="glass">
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xl tracking-widest text-sc-amber">
            ✦ TECH NEWS
          </span>
          <span className="font-mono text-lg text-sc-cream/55 tracking-wider truncate max-w-[55%]">
            {data.host}
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center min-h-0">
          <div className={`font-display text-sc-cream break-words ${tCls}`}>
            {data.title}
          </div>
          {data.description && (
            <p className="font-body text-xl text-sc-cream/75 mt-4 leading-snug line-clamp-4">
              {data.description}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
