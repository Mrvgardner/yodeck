import Card from '../Card.jsx'
import { scaleOf, heightScaleOf } from '../../utils/cardSize.js'
import { TreeIcon } from '../icons.jsx'

// Counts down to Christmas, says Merry Christmas on the day, then counts down
// to New Year's for the last week of December (the theme runs through Jan 1).
function countdown() {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const y = today.getFullYear()
  const daysTo = (d) => Math.round((d - today) / (1000 * 60 * 60 * 24))
  if (today.getMonth() === 0) {
    return { big: String(y), label: 'HAPPY NEW YEAR', head: '✦ NEW YEAR' }
  }
  const toXmas = daysTo(new Date(y, 11, 25))
  if (toXmas > 1)   return { big: String(toXmas), label: 'DAYS TILL CHRISTMAS', head: '✦ COUNTDOWN' }
  if (toXmas === 1) return { big: '1',            label: 'DAY TILL CHRISTMAS',  head: '✦ COUNTDOWN' }
  if (toXmas === 0) return { big: 'MERRY',        label: 'CHRISTMAS',           head: '✦ CHRISTMAS' }
  const toNewYear = daysTo(new Date(y + 1, 0, 1))
  return { big: String(toNewYear), label: toNewYear === 1 ? 'DAY TILL NEW YEAR' : 'DAYS TILL NEW YEAR', head: '✦ NEW YEAR' }
}

const BIG_BY_SCALE     = ['text-[6rem]', 'text-[10rem]', 'text-[16rem]']
const LABEL_BY_SCALE   = ['text-2xl',    'text-4xl',     'text-6xl']
const TREE_BY_SCALE    = ['text-6xl',    'text-8xl',     'text-[9rem]']
const TAGLINE_BY_SCALE = ['text-xl',     'text-2xl',     'text-4xl']

export default function ChristmasCard({ data, size }) {
  const scale  = scaleOf(size)
  const vScale = heightScaleOf(size)   // countdown block is height-bound
  const { big, label, head } = countdown()
  const tall   = (size?.h || 1) > (size?.w || 1)   // 1×2: stack the tree above the number
  // A word ("MERRY") or a four-digit year needs a smaller size than a day count.
  const bigCls = /^\d{1,2}$/.test(big) ? BIG_BY_SCALE[vScale] : LABEL_BY_SCALE[Math.min(vScale + 1, 2)]
  return (
    <Card surface="festive">
      <div className="flex flex-col h-full gap-4">
        <header className="flex-shrink-0 flex items-center justify-between">
          <span className="font-mono text-xl tracking-widest text-[#ffd43b]">
            {head}
          </span>
          <span className="status-pip" aria-hidden />
        </header>

        <main className={`flex-1 min-h-0 overflow-hidden flex items-center justify-center gap-6 ${tall ? 'flex-col text-center' : ''}`}>
          <span className={`${TREE_BY_SCALE[vScale]} leading-none flex-shrink-0`}><TreeIcon /></span>
          <div className="flex flex-col min-w-0">
            <div className={`font-display ${bigCls} leading-[0.85] text-[#ffd43b]`}>
              {big}
            </div>
            <div className={`font-display ${LABEL_BY_SCALE[vScale]} text-sc-cream/90 leading-tight tracking-wide`}>
              {label}
            </div>
          </div>
        </main>

        <footer className={`flex-shrink-0 font-body ${TAGLINE_BY_SCALE[scale]} text-sc-cream/85 border-t border-[#ffd43b]/30 pt-4`}>
          {data.tagline}
        </footer>
      </div>
    </Card>
  )
}
