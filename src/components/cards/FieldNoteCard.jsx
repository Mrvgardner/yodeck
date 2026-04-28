import Card from '../Card.jsx'

export default function FieldNoteCard({ data }) {
  return (
    <Card surface="glass">
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xl tracking-widest text-sc-amber">
            ⌁ FIELD NOTE
          </span>
          <span className="font-mono text-xl text-sc-cream/50">
            {data.timestamp}
          </span>
        </div>

        <div>
          <div className="font-display text-6xl leading-[0.95] text-sc-cream">
            {data.title}
          </div>
          <p className="font-body text-2xl text-sc-cream/75 mt-6 leading-snug line-clamp-4">
            {data.snippet}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-sc-cream/10 pt-5">
          <span className="font-mono text-xl text-sc-cream/60 tracking-wider">
            {data.author.toUpperCase()}
          </span>
          <span className="font-sc-bold text-2xl text-sc-orange">
            switchcommerce.team
          </span>
        </div>
      </div>
    </Card>
  )
}
