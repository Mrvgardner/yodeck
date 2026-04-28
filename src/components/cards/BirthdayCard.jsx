import Card from '../Card.jsx'

// Hierarchy: name = hero, "happy birthday" = small accent.
// Long names wrap to 2 lines instead of truncating.
export default function BirthdayCard({ data }) {
  return (
    <Card surface="amber">
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xl tracking-widest text-white/85">
            ✦ BIRTHDAY
          </span>
          <span className="font-mono text-xl tracking-widest text-white/75">
            TODAY
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div
            className="flex h-[110px] w-[110px] flex-shrink-0 items-center justify-center rounded-2xl bg-white/15 font-display text-5xl ring-1 ring-white/30"
            aria-hidden
          >
            {data.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-5xl leading-[0.95] break-words text-white">
              {data.name}
            </div>
            {data.role && (
              <div className="font-mono text-xl text-white/75 mt-2">
                {data.role}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/25 pt-5">
          <span className="font-display text-4xl text-white tracking-wide">
            HAPPY BIRTHDAY
          </span>
          <span className="font-display text-4xl text-white/90">🎂</span>
        </div>
      </div>
    </Card>
  )
}
