import { memo } from 'react'
import { AnimatePresence } from 'framer-motion'
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
import { COLS, ROWS }  from '../hooks/useStageScheduler.js'

// Memoized so a card never re-renders unless its data identity actually changes.
// Big win for the YouTube card — without memo, every parent re-render would
// remount the iframe.
//
// `size` is the cell footprint ({ w, h }) — every card uses it to pick text
// and ornament sizes appropriate for the actual rendered area.
const CardFor = memo(function CardFor({ card, size }) {
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
    default:            return null
  }
})

// Each placement renders into its own grid cell (with spans). AnimatePresence
// inside each placement-cell lets the rain in / fall out animations overlap
// with neighbors without affecting layout.
export default function Stage({ placements }) {
  return (
    <main className="relative flex-1 px-8 py-6">
      <div
        className="grid h-full gap-8"
        style={{
          gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
          gridTemplateRows:    `repeat(${ROWS}, minmax(0, 1fr))`,
        }}
      >
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
                <CardFor key={p.card._id} card={p.card} size={{ w: p.w, h: p.h }} />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </main>
  )
}
