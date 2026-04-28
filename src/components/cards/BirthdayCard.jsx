import Card from '../Card.jsx'

export default function BirthdayCard({ data }) {
  return (
    <Card surface="amber">
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xl tracking-widest text-white/80">
            ◇ BIRTHDAY
          </span>
          <span className="font-mono text-xl tracking-widest text-white/70">
            TODAY
          </span>
        </div>

        <div>
          <div className="font-display text-[9rem] leading-[0.85] tracking-tight">
            HAPPY<br/>BIRTHDAY
          </div>
        </div>

        <div className="flex items-end gap-8">
          <div
            className="flex h-[120px] w-[120px] items-center justify-center rounded-2xl bg-white/15 font-display text-6xl ring-1 ring-white/30"
            aria-hidden
          >
            {data.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-6xl leading-tight truncate">
              {data.name}
            </div>
            <div className="font-mono text-2xl text-white/80 mt-2 truncate">
              {data.role}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
