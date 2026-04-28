import { useMemo } from 'react'
import Background  from './components/Background.jsx'
import HeaderBar   from './components/HeaderBar.jsx'
import Stage       from './components/Stage.jsx'
import Ticker      from './components/Ticker.jsx'
import { useStageScheduler, buildDeck } from './hooks/useStageScheduler.js'
import { useWeather }       from './hooks/useWeather.js'
import { useNews }          from './hooks/useNews.js'
import { useFeeds }         from './hooks/useFeeds.js'
import { useFieldNotes }    from './hooks/useFieldNotes.js'
import { useNightlyReload } from './hooks/useNightlyReload.js'
import { fieldNotes as fallbackFieldNotes, youtubeFeeds, quotes } from './data/mock.js'
import { FAKE_HEADLINES } from './data/headlines.js'

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Date helpers ──────────────────────────────────────────────────
function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}
function daysBetween(a, b) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}
// MM-DD → next occurrence (this year, or next year if already past)
function nextOccurrence(mmdd) {
  const today = startOfToday()
  const [m, d] = mmdd.split('-').map(Number)
  let occ = new Date(today.getFullYear(), m - 1, d)
  if (occ < today) occ = new Date(today.getFullYear() + 1, m - 1, d)
  return occ
}

// ─── Filters ───────────────────────────────────────────────────────
function celebrationsInWindow(items, days = 7) {
  const today = startOfToday()
  return items
    .map(it => ({ ...it, _next: nextOccurrence(it.mmdd) }))
    .filter(it => daysBetween(today, it._next) <= days)
    .sort((a, b) => a._next - b._next)
}
function upcomingHolidays(items, days = 45) {
  const today = startOfToday()
  return items
    .filter(h => {
      const d = new Date(h.date + 'T00:00:00')
      const delta = daysBetween(today, d)
      return delta >= 0 && delta <= days
    })
    .sort((a, b) => a.date.localeCompare(b.date))
}
function currentlyOrSoonOut(items, days = 5) {
  const today = startOfToday()
  return items
    .filter(w => {
      const start = new Date(w.startDate + 'T00:00:00')
      const end   = new Date(w.endDate   + 'T23:59:59')
      return end >= today && daysBetween(today, start) <= days
    })
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
}
function withYears(items) {
  const thisYear = new Date().getFullYear()
  return items
    .map(a => ({ ...a, years: a.startYear ? thisYear - a.startYear : null }))
    .filter(a => a.years && a.years > 0)
}

// ─── App ───────────────────────────────────────────────────────────
export default function App() {
  // TV runs 8a–5p. Reload at 7:30 AM to clear state + pick up overnight
  // deploys before staff start their day. (Yodeck reloads anyway when it
  // first cycles to this page, so this is a belt-and-suspenders guard.)
  useNightlyReload({ hour: 7, minute: 30 })

  const weather     = useWeather()
  const news        = useNews()
  const liveFeeds   = useFeeds()       // refreshes hourly from /api/feeds
  const liveFNotes  = useFieldNotes()  // refreshes every 10 min from /api/field-notes
  const fieldNotes  = liveFNotes.length > 0 ? liveFNotes : fallbackFieldNotes

  const birthdays     = useMemo(() => celebrationsInWindow(liveFeeds.birthdays, 7),                     [liveFeeds.birthdays])
  const anniversaries = useMemo(() => withYears(celebrationsInWindow(liveFeeds.anniversaries, 7)),      [liveFeeds.anniversaries])
  const holidays      = useMemo(() => upcomingHolidays(liveFeeds.holidays, 45),                         [liveFeeds.holidays])
  const whosOut       = useMemo(() => currentlyOrSoonOut(liveFeeds.whosOut, 5),                         [liveFeeds.whosOut])

  const deck = useMemo(() => buildDeck({
    birthdays,
    anniversaries,
    holidays,
    whosOut,
    fieldNotes,
    news,
    youtubeFeeds,
    quotes,
    weatherCard: weather ? { kind: 'weather', ...weather } : null,
  }), [birthdays, anniversaries, holidays, whosOut, fieldNotes, news, weather])

  const placements = useStageScheduler({ deck })

  // Ticker is fake-headlines only now. Shuffled once per page load so the
  // sequence varies day-to-day without changing the marquee mid-stream.
  const tickerItems = useMemo(() => shuffle(FAKE_HEADLINES), [])

  return (
    <div className="flex h-screen w-screen flex-col">
      <Background />
      <HeaderBar weather={weather} />
      <Stage placements={placements} />
      <Ticker items={tickerItems} />
    </div>
  )
}
