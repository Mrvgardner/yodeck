import { useLayoutEffect, useRef, useState } from 'react'
import Card from '../Card.jsx'
import { scaleOf, pickByLen } from '../../utils/cardSize.js'

// This week's shout-outs (Assembly recognitions, via switchcommerce.team
// Field Notes). When they don't all fit, the list drifts upward in a
// seamless loop: it's rendered twice and moved up by exactly one copy.
// Speed is fixed in px/s so a long week scrolls no faster than a short one.

const SCROLL_PX_PER_SEC = 32

const NAME_BANDS = [18, 32, 50]
const NAME_TIERS = [
  ['text-3xl leading-[1.0]',  'text-4xl leading-[1.0]',  'text-5xl leading-[1.0]'],
  ['text-2xl leading-[1.05]', 'text-3xl leading-[1.05]', 'text-4xl leading-[1.05]'],
  ['text-xl leading-[1.1]',   'text-2xl leading-[1.1]',  'text-3xl leading-[1.1]'],
  ['text-lg leading-[1.15]',  'text-xl leading-[1.15]',  'text-2xl leading-[1.15]'],
]
const MESSAGE_BY_SCALE = ['text-base', 'text-xl', 'text-2xl']
const META_BY_SCALE    = ['text-xs',   'text-sm', 'text-base']

function recipientLabel(h) {
  const names = h.recipients.join(', ')
  if (!h.others) return names
  const more = `${h.others} other${h.others === 1 ? '' : 's'}`
  return names ? `${names} + ${more}` : more
}

function weekLabel(iso) {
  const d = new Date(iso + 'T12:00:00')
  if (Number.isNaN(d.getTime())) return ''
  return `WEEK OF ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}`
}

function Recognition({ h, scale }) {
  const label = recipientLabel(h)
  const meta  = [h.from && `FROM ${h.from.toUpperCase()}`, h.badge && h.badge.toUpperCase()].filter(Boolean).join(' · ')
  return (
    <div className="rounded-2xl bg-white/[0.06] ring-1 ring-white/10 px-6 py-5">
      <div className={`font-display text-sc-cream break-words ${pickByLen(label, scale, NAME_BANDS, NAME_TIERS)}`}>
        {label}
      </div>
      {meta && (
        <div className={`font-mono ${META_BY_SCALE[scale]} tracking-wider text-sc-amber mt-2`}>
          {meta}
        </div>
      )}
      {h.message && (
        <p className={`font-body ${MESSAGE_BY_SCALE[scale]} text-sc-cream/85 leading-snug mt-3`}>
          “{h.message}”
        </p>
      )}
    </div>
  )
}

export default function HighlightsCard({ data, size }) {
  const scale     = scaleOf(size)
  const items     = data.items || []
  const windowRef = useRef(null)
  const listRef   = useRef(null)
  // null = fits, no motion; otherwise the loop duration in seconds.
  const [loopSecs, setLoopSecs] = useState(null)

  // Measure one copy of the list against the visible window. Re-measured on
  // resize so late-loading fonts (Bebas, Barlow) don't leave it wrong.
  useLayoutEffect(() => {
    const win = windowRef.current, list = listRef.current
    if (!win || !list) return
    const measure = () => {
      const listH = list.offsetHeight
      setLoopSecs(listH > win.clientHeight ? listH / SCROLL_PX_PER_SEC : null)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(win); ro.observe(list)
    return () => ro.disconnect()
  }, [items, scale])

  const scrolling = loopSecs != null
  const copy = (i) => (
    // pb-4 matches the space-y-4 gap so the seam between copies is even.
    <div key={i} ref={i === 0 ? listRef : undefined} className="space-y-4 pb-4" aria-hidden={i === 1 || undefined}>
      {items.map((h, j) => <Recognition key={j} h={h} scale={scale} />)}
    </div>
  )

  return (
    <Card surface="glass">
      <div className="flex flex-col h-full gap-4">
        <header className="flex-shrink-0 flex items-center justify-between">
          <span className="font-mono text-xl tracking-widest text-sc-amber">
            ★ SHOUT-OUTS
          </span>
          <span className="font-mono text-base text-sc-cream/60 tracking-wider">
            {weekLabel(data.date)}
          </span>
        </header>

        <main ref={windowRef} className={`flex-1 min-h-0 overflow-hidden relative ${scrolling ? 'highlights-window' : ''}`}>
          <div
            className={scrolling ? 'highlights-scroll' : ''}
            style={scrolling ? { animationDuration: `${loopSecs}s` } : undefined}
          >
            {copy(0)}
            {scrolling && copy(1)}
          </div>
        </main>

        <footer className="flex-shrink-0 flex items-center justify-between gap-4 border-t border-sc-cream/15 pt-4">
          <span className="font-mono text-base text-sc-cream/65 tracking-wider whitespace-nowrap">
            {items.length} RECOGNITION{items.length === 1 ? '' : 'S'}
          </span>
          {/* Too long for a one-column card next to the count. */}
          {(size?.w || 1) > 1 && (
            <span className="font-sc-bold text-base text-sc-orange whitespace-nowrap">
              switchcommerce.team
            </span>
          )}
        </footer>
      </div>
    </Card>
  )
}
