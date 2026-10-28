import Card from '../Card.jsx'
import { scaleOf, heightScaleOf } from '../../utils/cardSize.js'
import { PumpkinIcon } from '../icons.jsx'

// Countdown to Oct 31 of the current year. Only shown while the Halloween
// theme is active, so we never need to handle "after Halloween".
function countdown() {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const target = new Date(today.getFullYear(), 9, 31)
  const days = Math.round((target - today) / (1000 * 60 * 60 * 24))
  if (days <= 0) return { big: 'BOO!',  label: "IT'S HALLOWEEN" }
  if (days === 1) return { big: '1',    label: 'DAY TILL HALLOWEEN' }
  return { big: String(days), label: 'DAYS TILL HALLOWEEN' }
}

const BIG_BY_SCALE     = ['text-[6rem]', 'text-[10rem]', 'text-[16rem]']
const LABEL_BY_SCALE   = ['text-2xl',    'text-4xl',     'text-6xl']
const PUMPKIN_BY_SCALE = ['text-6xl',    'text-8xl',     'text-[9rem]']
const TAGLINE_BY_SCALE = ['text-xl',     'text-2xl',     'text-4xl']

export default function HalloweenCard({ data, size }) {
  const scale  = scaleOf(size)
  const vScale = heightScaleOf(size)   // countdown block is height-bound
  const { big, label } = countdown()
  const tall  = (size?.h || 1) > (size?.w || 1)   // 1×2: stack pumpkin above the number
  return (
    <Card surface="haunt">
      <div className="flex flex-col h-full gap-4">
        <header className="flex-shrink-0 flex items-center justify-between">
          <span className="font-mono text-xl tracking-widest text-sc-amber">
            ☾ COUNTDOWN
          </span>
          <span className="status-pip" aria-hidden />
        </header>

        <main className={`flex-1 min-h-0 overflow-hidden flex items-center justify-center gap-6 ${tall ? 'flex-col text-center' : ''}`}>
          <span className={`${PUMPKIN_BY_SCALE[vScale]} leading-none flex-shrink-0`}><PumpkinIcon /></span>
          <div className="flex flex-col min-w-0">
            <div className={`font-spooky ${BIG_BY_SCALE[vScale]} leading-[0.85] text-sc-orange`}>
              {big}
            </div>
            <div className={`font-spooky ${LABEL_BY_SCALE[vScale]} text-sc-cream/90 leading-tight tracking-wide`}>
              {label}
            </div>
          </div>
        </main>

        <footer className={`flex-shrink-0 font-body ${TAGLINE_BY_SCALE[scale]} text-sc-cream/85 border-t border-sc-orange/30 pt-4`}>
          {data.tagline}
        </footer>
      </div>
    </Card>
  )
}
