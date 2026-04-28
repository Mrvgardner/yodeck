import Card from '../Card.jsx'

export default function QuoteCard({ data }) {
  return (
    <Card surface="amber">
      <div className="flex flex-col h-full justify-between">
        <span className="font-mono text-xl tracking-widest text-white/80">
          ❝ THOUGHT
        </span>

        <div className="font-display text-7xl leading-[0.95] text-white">
          {data.text}
        </div>

        <div className="flex items-center justify-between border-t border-white/20 pt-5">
          <span className="font-mono text-xl text-white/80 tracking-wider">
            — {data.attribution}
          </span>
          <img src="/logos/sc-icon-white.png" alt="" className="h-10 opacity-90" />
        </div>
      </div>
    </Card>
  )
}
