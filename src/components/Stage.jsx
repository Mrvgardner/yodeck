import { memo, useMemo } from 'react'
import { AnimatePresence, LazyMotion, domAnimation } from 'framer-motion'
import BirthdayCard    from './cards/BirthdayCard.jsx'
import AnniversaryCard from './cards/AnniversaryCard.jsx'
import HolidayCard     from './cards/HolidayCard.jsx'
import FieldNoteCard   from './cards/FieldNoteCard.jsx'
import WeatherCard     from './cards/WeatherCard.jsx'
import NewsCard        from './cards/NewsCard.jsx'
import YouTubeCard     from './cards/YouTubeCard.jsx'
import QuoteCard       from './cards/QuoteCard.jsx'
import WhosOutCard     from './cards/WhosOutCard.jsx'
import MovieQuoteCard  from './cards/MovieQuoteCard.jsx'
import HalloweenCard   from './cards/HalloweenCard.jsx'
import { COLS, ROWS, useStageScheduler } from '../hooks/useStageScheduler.js'

// Memoized so a card never re-renders unless its data identity actually changes.
// Big win for the YouTube card — without memo, every parent re-render would
// remount the iframe.
//
// w/h are passed as primitives (not a `size` object) so memo's shallow compare
// actually holds — a fresh `{ w, h }` literal per render would defeat it and
// re-render every card on every scheduler tick.
const CardFor = memo(function CardFor({ card, w, h }) {
  const size = useMemo(() => ({ w, h }), [w, h])
  if (!card) return null
  switch (card.kind) {
    case 'birthday':    return <BirthdayCard    data={card} size={size} />
    case 'anniversary': return <AnniversaryCard data={card} size={size} />
    case 'holiday':     return <HolidayCard     data={card} size={size} />
    case 'fieldnote':   return <FieldNoteCard   data={card} size={size} />
    case 'weather':     return <WeatherCard     data={card} size={size} />
    case 'news':        return <NewsCard        data={card} size={size} />
    case 'youtube':     return <YouTubeCard     data={card} size={size} />
    case 'quote':       return <QuoteCard       data={card} size={size} />
    case 'whosout':     return <WhosOutCard     data={card} size={size} />
    case 'movie':       return <MovieQuoteCard  data={card} size={size} />
    case 'halloween':   return <HalloweenCard   data={card} size={size} />
    default:            return null
  }
})

const GRID_STYLE = {
  gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
  gridTemplateRows:    `repeat(${ROWS}, minmax(0, 1fr))`,
}

// Each placement renders into its own grid cell (with spans). AnimatePresence
// inside each placement-cell lets the rain in / fall out animations overlap
// with neighbors without affecting layout.
//
// The scheduler lives here (not in App) so its frequent placement updates
// only re-render the stage — header, ticker and background stay untouched.
// LazyMotion + domAnimation ships only the animation features Card uses
// (variants, exit) instead of the full framer-motion bundle.
function Stage({ deck }) {
  const placements = useStageScheduler({ deck })
  return (
    <LazyMotion features={domAnimation} strict>
      <main className="relative flex-1 px-8 py-6">
        <div className="grid h-full gap-8" style={GRID_STYLE}>
          {placements.map(p => (
            <div
              key={p.id}
              className="relative"
              style={{
                gridColumn: `${p.x + 1} / span ${p.w}`,
                gridRow:    `${p.y + 1} / span ${p.h}`,
              }}
            >
              <AnimatePresence>
                {p.state === 'live' && (
                  <CardFor key={p.card._id} card={p.card} w={p.w} h={p.h} />
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </main>
    </LazyMotion>
  )
}

export default memo(Stage)
