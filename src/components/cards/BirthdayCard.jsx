import Card from '../Card.jsx'

function nameSize(name) {
  const len = name?.length || 0
  if (len <= 14)  return 'text-5xl leading-[0.95]'
  if (len <= 22)  return 'text-4xl leading-[1.0]'
  return 'text-3xl leading-[1.05]'
}

export default function BirthdayCard({ data }) {
  const nCls = nameSize(data.name)
  return (
    <Card surface="amber">
      <div className="flex flex-col h-full gap-4">
        <header className="flex-shrink-0 flex items-center justify-between">
          <span className="font-mono text-xl tracking-widest text-white/85">
            ✦ BIRTHDAY
          </span>
          <span className="font-mono text-xl tracking-widest text-white/75">
            TODAY
          </span>
        </header>

        <main className="flex-1 min-h-0 overflow-hidden flex items-center gap-5">
          <div
            className="flex h-[100px] w-[100px] flex-shrink-0 items-center justify-center rounded-2xl bg-white/15 font-display text-5xl ring-1 ring-white/30"
            aria-hidden
          >
            {data.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-display break-words text-white ${nCls}`}>
              {data.name}
            </div>
            {data.role && (
              <div className="font-mono text-base text-white/75 mt-2 truncate">
                {data.role}
              </div>
            )}
          </div>
        </main>

        <footer className="flex-shrink-0 flex items-center justify-between border-t border-white/25 pt-4">
          <span className="font-display text-3xl text-white tracking-wide">
            HAPPY BIRTHDAY
          </span>
          <span className="font-display text-3xl text-white/95">🎂</span>
        </footer>
      </div>
    </Card>
  )
}
