import Card from '../Card.jsx'

function nameSize(name) {
  const len = name?.length || 0
  if (len <= 12)  return 'text-3xl leading-[1.0]'
  if (len <= 20)  return 'text-2xl leading-[1.05]'
  return 'text-xl leading-[1.1]'
}

export default function AnniversaryCard({ data }) {
  const nCls = nameSize(data.name)
  return (
    <Card surface="glass">
      <div className="flex flex-col h-full gap-4">
        <header className="flex-shrink-0 flex items-center justify-between">
          <span className="font-mono text-xl tracking-widest text-sc-amber">
            ◆ ANNIVERSARY
          </span>
          <span className="status-pip" aria-hidden />
        </header>

        <main className="flex-1 min-h-0 overflow-hidden flex flex-col justify-center">
          <div className="flex items-baseline gap-4">
            <div className="font-display text-[6rem] leading-[0.8] text-sc-orange">
              {data.years}
            </div>
            <div className="font-display text-2xl text-sc-cream/90 leading-tight">
              YEARS<br />STRONG
            </div>
          </div>
        </main>

        <footer className="flex-shrink-0 flex items-center gap-4 border-t border-sc-cream/15 pt-4">
          <div
            className="flex h-[56px] w-[56px] flex-shrink-0 items-center justify-center rounded-xl bg-sc-orange/15 font-display text-2xl text-sc-orange ring-1 ring-sc-orange/40"
            aria-hidden
          >
            {data.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-display break-words text-sc-cream ${nCls}`}>
              {data.name}
            </div>
            {data.role && (
              <div className="font-mono text-base text-sc-cream/65 mt-1 truncate">
                {data.role}
              </div>
            )}
          </div>
        </footer>
      </div>
    </Card>
  )
}
