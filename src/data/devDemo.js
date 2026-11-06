// Sample data for every live feed, so the full card rotation can be previewed
// on the local dev server (no /api proxy there): http://localhost:5180/?demo=all
// Combine with ?theme=fall etc. Dev only — never shipped. Names are fictional.
import { demoHighlights } from './highlightsDemo.js'

const pad = n => String(n).padStart(2, '0')
function offsetDate(days) {
  const d = new Date(); d.setDate(d.getDate() + days)
  return d
}
const mmdd = d => `${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const iso  = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const demoFeeds = {
  birthdays:     [{ kind: 'birthday', name: 'Alex Rivera', mmdd: mmdd(offsetDate(2)), initials: 'AR' }],
  anniversaries: [{ kind: 'anniversary', name: 'Riley Chen', mmdd: mmdd(offsetDate(1)), startYear: 2016, initials: 'RC' }],
  holidays:      [{ kind: 'holiday', name: 'Thanksgiving', date: iso(offsetDate(20)), blurb: 'Office closed' }],
  whosOut:       [{ kind: 'whosout', name: 'Jordan Lee', days: 2, startDate: iso(offsetDate(0)), endDate: iso(offsetDate(1)), initials: 'JL' }],
  generatedAt:   null,
}

export const demoNews = [
  { kind: 'news', id: 'demo-news-1', host: 'example.com', title: 'Sample story: contactless payments keep growing',
    description: 'Placeholder description so the news card renders in the local preview.' },
  { kind: 'news', id: 'demo-news-2', host: 'example.com', title: 'Sample story: a new chip for faster checkout',
    description: 'Placeholder description so the news card renders in the local preview.' },
]

export const demoFieldNotes = {
  notes: [
    { kind: 'fieldnote', id: 'demo-fn-1', title: 'Sample field note: new install checklist', author: 'Sam Patel',
      snippet: 'Placeholder text so the field note card renders in the local preview.', timestamp: 'Today' },
    { kind: 'fieldnote', id: 'demo-fn-2', title: 'Sample field note: trade show recap', author: 'Casey Morgan',
      snippet: 'Placeholder text so the field note card renders in the local preview.', timestamp: 'Yesterday' },
  ],
  highlights: demoHighlights,
}
