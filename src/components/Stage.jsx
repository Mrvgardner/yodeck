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
import { COLS, ROWS }  from '../hooks/useStageScheduler.js'

function CardFor({ card }) {
  if (!card) return null
  switch (card.kind) {
    case 'birthday':    return <BirthdayCard    data={card} />
    case 'anniversary': return <AnniversaryCard data={card} />
    case 'holiday':     return <HolidayCard     data={card} />
    case 'fieldnote':   return <FieldNoteCard   data={card} />
    case 'weather':     return <WeatherCard     data={card} />
    case 'news':        return <NewsCard        data={card} />
    case 'youtube':     return <YouTubeCard     data={card} />
    case 'quote':       return <QuoteCard       data={card} />
    case 'whosout':     return <WhosOutCard     data={card} />
    default:            return null
  }
}

// Each placement renders into its own grid cell (with spans). AnimatePresence
// inside each placement-cell lets the rain in / fall out animations overlap
// with neighbors without affecting layout.
export default function Stage({ placements }) {
  return (
    <main className="relative flex-1 px-8 py-6 stage-mask">
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
              {p.state === 'live' && <CardFor key={p.card._id} card={p.card} />}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </main>
  )
}
