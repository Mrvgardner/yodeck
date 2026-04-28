import Card from '../Card.jsx'

function fmtRange(start, end) {
  const s = new Date(start + 'T12:00:00')
  const e = new Date(end   + 'T12:00:00')
  const opt = { month: 'short', day: 'numeric' }
  if (start === end) return s.toLocaleDateString('en-US', opt).toUpperCase()
  return `${s.toLocaleDateString('en-US', opt)} – ${e.toLocaleDateString('en-US', opt)}`.toUpperCase()
}

export default function WhosOutCard({ data }) {
  return (
    <Card surface="glass">
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xl tracking-widest text-sc-amber">
            ✈ WHO'S OUT
          </span>
          <span className="font-mono text-xl text-sc-cream/60 tracking-wider">
            {fmtRange(data.startDate, data.endDate)}
          </span>
        </div>

        <div className="flex items-end gap-6">
          <div
            className="flex h-[120px] w-[120px] items-center justify-center rounded-2xl bg-sc-amber/15 font-display text-6xl text-sc-amber ring-1 ring-sc-amber/40"
            aria-hidden
          >
            {data.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-6xl leading-tight truncate text-sc-cream">
              {data.name}
            </div>
            <div className="font-mono text-2xl text-sc-cream/60 mt-2">
              OUT OF OFFICE
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-sc-cream/10 pt-5">
          <span className="font-display text-5xl text-sc-orange leading-none">
            {data.days ?? '—'}
            <span className="font-mono text-xl text-sc-cream/60 ml-3 tracking-wider align-middle">
              DAY{data.days === 1 ? '' : 'S'}
            </span>
          </span>
          <span className="font-mono text-xl text-sc-cream/40 tracking-wider">
            BAMBOO HR
          </span>
        </div>
      </div>
    </Card>
  )
}
