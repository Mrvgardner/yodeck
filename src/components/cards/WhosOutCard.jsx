import Card from '../Card.jsx'

function fmtRange(start, end) {
  const s = new Date(start + 'T12:00:00')
  const e = new Date(end   + 'T12:00:00')
  const opt = { month: 'short', day: 'numeric' }
  if (start === end) return s.toLocaleDateString('en-US', opt).toUpperCase()
  return `${s.toLocaleDateString('en-US', opt)} – ${e.toLocaleDateString('en-US', opt)}`.toUpperCase()
}

function nameSize(name) {
  const len = name?.length || 0
  if (len <= 14)  return 'text-5xl leading-[0.95]'
  if (len <= 22)  return 'text-4xl leading-[1.0]'
  return 'text-3xl leading-[1.05]'
}

export default function WhosOutCard({ data }) {
  const nCls = nameSize(data.name)
  return (
    <Card surface="glass">
      <div className="flex flex-col h-full gap-4">
        <header className="flex-shrink-0 flex items-center justify-between">
          <span className="font-mono text-xl tracking-widest text-sc-amber">
            ✈ WHO'S OUT
          </span>
          <span className="font-mono text-base text-sc-cream/65 tracking-wider whitespace-nowrap">
            {fmtRange(data.startDate, data.endDate)}
          </span>
        </header>

        <main className="flex-1 min-h-0 overflow-hidden flex items-center gap-5">
          <div
            className="flex h-[88px] w-[88px] flex-shrink-0 items-center justify-center rounded-2xl bg-sc-amber/15 font-display text-4xl text-sc-amber ring-1 ring-sc-amber/40"
            aria-hidden
          >
            {data.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-display break-words text-sc-cream ${nCls}`}>
              {data.name}
            </div>
            <div className="font-mono text-base text-sc-cream/60 mt-2 tracking-wider">
              OUT OF OFFICE
            </div>
          </div>
        </main>

        <footer className="flex-shrink-0 flex items-end justify-between border-t border-sc-cream/15 pt-4">
          <span className="font-display text-4xl text-sc-orange leading-none">
            {data.days ?? '—'}
            <span className="font-mono text-base text-sc-cream/65 ml-2 tracking-wider align-middle">
              DAY{data.days === 1 ? '' : 'S'}
            </span>
          </span>
          <span className="font-mono text-sm text-sc-cream/40 tracking-wider">
            BAMBOO HR
          </span>
        </footer>
      </div>
    </Card>
  )
}
