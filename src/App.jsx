import { useEffect, useMemo } from 'react'
import Background  from './components/Background.jsx'
import HeaderBar   from './components/HeaderBar.jsx'
import Stage       from './components/Stage.jsx'
import Ticker      from './components/Ticker.jsx'
import HalloweenOverlay from './components/HalloweenOverlay.jsx'
import FallOverlay      from './components/FallOverlay.jsx'
import { buildDeck }        from './hooks/useStageScheduler.js'
import { useWeather }       from './hooks/useWeather.js'
import { useNews }          from './hooks/useNews.js'
import { useFeeds }         from './hooks/useFeeds.js'
import { useFieldNotes }    from './hooks/useFieldNotes.js'
import { useNightlyReload } from './hooks/useNightlyReload.js'
// Quotes are author-controlled mock content. Field notes and BambooHR data
// come from live feeds only — never fall back to invented examples, or the
// kitchen TV would show fake people/events.
//
// Videos are paused: import `youtubeFeeds` from mock.js and add it back to
// buildDeck() below to bring the YouTube card back.
import { quotes, movieQuotes } from './data/mock.js'
import { FAKE_HEADLINES } from './data/headlines.js'
import { halloweenCards, spookyQuotes, spookyMovieQuotes, SPOOKY_HEADLINES } from './data/halloween.js'
import { thanksgivingCards, fallQuotes, FALL_HEADLINES } from './data/fall.js'
import { activeTheme, msUntilThemeEnds, loadThemeFonts } from './utils/theme.js'

// Decided once per page load. The TV reloads every morning (and at the end
// of a themed window), which is when a new theme takes effect.
const THEME = activeTheme()

// What each theme swaps in. Halloween replaces the regular content outright;
// fall runs for four weeks, so its content is mixed in with the regular sets
// to keep variety up.
const THEME_CONTENT = {
  normal: {
    quotes, movieQuotes, extras: [], headlines: FAKE_HEADLINES,
    tickerLabel: 'LIVE · KITCHEN FEED', Overlay: null,
  },
  halloween: {
    quotes: spookyQuotes, movieQuotes: spookyMovieQuotes, extras: halloweenCards, headlines: SPOOKY_HEADLINES,
    tickerLabel: 'LIVE · HAUNTED KITCHEN', Overlay: HalloweenOverlay,
  },
  fall: {
    quotes: [...fallQuotes, ...quotes], movieQuotes, extras: thanksgivingCards, headlines: [...FALL_HEADLINES, ...FAKE_HEADLINES],
    tickerLabel: 'LIVE · HARVEST KITCHEN', Overlay: FallOverlay,
  },
}
const CONTENT = THEME_CONTENT[THEME] || THEME_CONTENT.normal

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

  // Drop back to the normal look exactly when the themed window ends.
  useEffect(() => {
    loadThemeFonts(THEME)
    const ms = msUntilThemeEnds(THEME)
    if (ms == null || ms > 2 ** 31 - 1) return
    const id = setTimeout(() => window.location.reload(), Math.max(ms, 0))
    return () => clearTimeout(id)
  }, [])

  const weather     = useWeather()
  const news        = useNews()
  const liveFeeds   = useFeeds()       // refreshes hourly from /api/feeds
  // Field notes are live-only — if the feed fails or is empty, we show
  // nothing rather than invented placeholder posts.
  const { notes: fieldNotes, highlights } = useFieldNotes()  // refreshes every 10 min from /api/field-notes

  const birthdays     = useMemo(() => celebrationsInWindow(liveFeeds.birthdays, 7),                     [liveFeeds.birthdays])
  const anniversaries = useMemo(() => withYears(celebrationsInWindow(liveFeeds.anniversaries, 7)),      [liveFeeds.anniversaries])
  const holidays      = useMemo(() => upcomingHolidays(liveFeeds.holidays, 45),                         [liveFeeds.holidays])
  const whosOut       = useMemo(() => currentlyOrSoonOut(liveFeeds.whosOut, 5),                         [liveFeeds.whosOut])

  // This week's shout-outs as a single card that scrolls through them all.
  // It stays up long enough for roughly one full pass of the list.
  const highlightsCard = useMemo(() => highlights && {
    kind:    'highlights',
    id:      highlights.id,
    date:    highlights.date,
    items:   highlights.items,
    dwellMs: Math.min(120_000, Math.max(45_000, highlights.items.length * 8_000)),
  }, [highlights])

  const deck = useMemo(() => buildDeck({
    birthdays,
    anniversaries,
    holidays,
    whosOut,
    fieldNotes,
    news,
    quotes:      CONTENT.quotes,
    movieQuotes: CONTENT.movieQuotes,
    extras:      [...CONTENT.extras, ...(highlightsCard ? [highlightsCard] : [])],
    weatherCard: weather ? { kind: 'weather', ...weather } : null,
  }), [birthdays, anniversaries, holidays, whosOut, fieldNotes, highlightsCard, news, weather])

  // Ticker is fake-headlines only now. Shuffled once per page load so the
  // sequence varies day-to-day without changing the marquee mid-stream.
  const tickerItems = useMemo(() => shuffle(CONTENT.headlines), [])
  const { Overlay } = CONTENT

  return (
    <div className="flex h-screen w-screen flex-col">
      <Background theme={THEME} />
      <HeaderBar weather={weather} />
      <Stage deck={deck} />
      <Ticker items={tickerItems} label={CONTENT.tickerLabel} />
      {Overlay && <Overlay />}
    </div>
  )
}
