import Card from '../Card.jsx'

export default function AnniversaryCard({ data }) {
  return (
    <Card surface="glass">
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xl tracking-widest text-sc-amber">
            ◆ ANNIVERSARY
          </span>
          <span className="status-pip" aria-hidden />
        </div>

        <div className="flex items-baseline gap-6">
          <div className="font-display text-[14rem] leading-[0.8] text-sc-orange">
            {data.years}
          </div>
          <div className="font-display text-5xl text-sc-cream/90 leading-tight">
            YEARS
            <br />
            STRONG
          </div>
        </div>

        <div className="flex items-end gap-6">
          <div
            className="flex h-[100px] w-[100px] items-center justify-center rounded-xl bg-sc-orange/15 font-display text-5xl text-sc-orange ring-1 ring-sc-orange/40"
            aria-hidden
          >
            {data.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-5xl truncate">{data.name}</div>
            <div className="font-mono text-xl text-sc-cream/60 mt-1 truncate">
              {data.role}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
