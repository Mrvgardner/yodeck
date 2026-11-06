import Card from '../Card.jsx'
import { scaleOf, heightScaleOf } from '../../utils/cardSize.js'
import { thanksgivingOf } from '../../utils/theme.js'
import { TurkeyIcon } from '../icons.jsx'

// Countdown to Thanksgiving; on the day it says so, and the day after it
// switches to Black Friday (the fall theme ends that night).
function countdown() {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const days = Math.round((thanksgivingOf(today.getFullYear()) - today) / (1000 * 60 * 60 * 24))
  if (days < 0)   return { big: 'GO!',  label: "IT'S BLACK FRIDAY",      head: '★ BLACK FRIDAY' }
  if (days === 0) return { big: 'HAPPY', label: 'THANKSGIVING',          head: '✦ THANKSGIVING' }
  if (days === 1) return { big: '1',    label: 'DAY TILL THANKSGIVING', head: '✦ COUNTDOWN' }
  return { big: String(days), label: 'DAYS TILL THANKSGIVING', head: '✦ COUNTDOWN' }
}

const BIG_BY_SCALE     = ['text-[6rem]', 'text-[10rem]', 'text-[16rem]']
const LABEL_BY_SCALE   = ['text-2xl',    'text-4xl',     'text-6xl']
const TURKEY_BY_SCALE  = ['text-6xl',    'text-8xl',     'text-[9rem]']
const TAGLINE_BY_SCALE = ['text-xl',     'text-2xl',     'text-4xl']

export default function ThanksgivingCard({ data, size }) {
  const scale  = scaleOf(size)
  const vScale = heightScaleOf(size)   // countdown block is height-bound
  const { big, label, head } = countdown()
  const tall   = (size?.h || 1) > (size?.w || 1)   // 1×2: stack turkey above the number
  // Words ("HAPPY", "GO!") need a smaller size than a one- or two-digit number.
  const bigCls = /^\d+$/.test(big) ? BIG_BY_SCALE[vScale] : LABEL_BY_SCALE[Math.min(vScale + 1, 2)]
  return (
    <Card surface="harvest">
      <div className="flex flex-col h-full gap-4">
        <header className="flex-shrink-0 flex items-center justify-between">
          <span className="font-mono text-xl tracking-widest text-sc-amber">
            {head}
          </span>
          <span className="status-pip" aria-hidden />
        </header>

        <main className={`flex-1 min-h-0 overflow-hidden flex items-center justify-center gap-6 ${tall ? 'flex-col text-center' : ''}`}>
          <span className={`${TURKEY_BY_SCALE[vScale]} leading-none flex-shrink-0`}><TurkeyIcon /></span>
          <div className="flex flex-col min-w-0">
            <div className={`font-display ${bigCls} leading-[0.85] text-sc-amber`}>
              {big}
            </div>
            <div className={`font-display ${LABEL_BY_SCALE[vScale]} text-sc-cream/90 leading-tight tracking-wide`}>
              {label}
            </div>
          </div>
        </main>

        <footer className={`flex-shrink-0 font-body ${TAGLINE_BY_SCALE[scale]} text-sc-cream/85 border-t border-sc-amber/30 pt-4`}>
          {data.tagline}
        </footer>
      </div>
    </Card>
  )
}
