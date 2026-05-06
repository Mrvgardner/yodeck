import Card from '../Card.jsx'
import { scaleOf, pickByLen } from '../../utils/cardSize.js'

// Tiers per name length × card size.
//                     [ small (1x1), medium (2x1/1x2), large (2x2) ]
const NAME_BANDS = [12, 20]
const NAME_TIERS = [
  ['text-4xl leading-[1.0]',  'text-6xl leading-[0.95]', 'text-8xl leading-[0.95]'],
  ['text-3xl leading-[1.05]', 'text-5xl leading-[1.0]',  'text-7xl leading-[1.0]'],
  ['text-2xl leading-[1.1]',  'text-4xl leading-[1.05]', 'text-6xl leading-[1.05]'],
]

const AVATAR_BY_SCALE = ['h-[72px] w-[72px] text-3xl', 'h-[110px] w-[110px] text-5xl', 'h-[160px] w-[160px] text-7xl']
const FOOTER_BY_SCALE = ['text-2xl', 'text-4xl', 'text-6xl']

function birthdayLabel(next) {
  if (!next) return 'TODAY'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const occ = new Date(next)
  occ.setHours(0, 0, 0, 0)
  if (occ.getTime() === today.getTime()) return 'TODAY'
  return `${occ.getMonth() + 1}/${occ.getDate()}`
}

export default function BirthdayCard({ data, size }) {
  const scale  = scaleOf(size)
  const nCls   = pickByLen(data.name, scale, NAME_BANDS, NAME_TIERS)
  const avatar = AVATAR_BY_SCALE[scale]
  const footer = FOOTER_BY_SCALE[scale]
  const label  = birthdayLabel(data._next)
  return (
    <Card surface="amber">
      <div className="flex flex-col h-full gap-4">
        <header className="flex-shrink-0 flex items-center justify-between">
          <span className="font-mono text-xl tracking-widest text-white/85">
            ✦ BIRTHDAY
          </span>
          <span className="font-mono text-xl tracking-widest text-white/75">
            {label}
          </span>
        </header>

        <main className="flex-1 min-h-0 overflow-hidden flex items-center gap-5">
          <div
            className={`${avatar} flex flex-shrink-0 items-center justify-center rounded-2xl bg-white/15 font-display ring-1 ring-white/30`}
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
          <span className={`font-display ${footer} text-white tracking-wide`}>
            HAPPY BIRTHDAY
          </span>
          <span className={`font-display ${footer} text-white/95`}>🎂</span>
        </footer>
      </div>
    </Card>
  )
}
