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

        <div className="flex items-baseline gap-5">
          <div className="font-display text-[10rem] leading-[0.8] text-sc-orange">
            {data.years}
          </div>
          <div className="font-display text-4xl text-sc-cream/90 leading-tight">
            YEARS
            <br />
            STRONG
          </div>
        </div>

        <div className="flex items-center gap-5 border-t border-sc-cream/15 pt-5">
          <div
            className="flex h-[88px] w-[88px] flex-shrink-0 items-center justify-center rounded-xl bg-sc-orange/15 font-display text-4xl text-sc-orange ring-1 ring-sc-orange/40"
            aria-hidden
          >
            {data.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-4xl leading-[0.95] break-words text-sc-cream">
              {data.name}
            </div>
            {data.role && (
              <div className="font-mono text-lg text-sc-cream/65 mt-1">
                {data.role}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
