// Mock data for the kitchen signage feed.
// Replace each section with live API/RSS pulls as they come online.
// Keep the shape stable — every card type is an object { kind, ...payload, dwellMs }.

const today = new Date()
const yyyy = today.getFullYear()
const mm = String(today.getMonth() + 1).padStart(2, '0')
const dd = String(today.getDate()).padStart(2, '0')

// Birthdays — wire to BambooHR / celebrations.generated.js feed when ready.
export const birthdays = [
  { kind: 'birthday', name: 'Maria Alvarez',    role: 'Operations',         date: `${yyyy}-${mm}-${dd}`, initials: 'MA' },
  { kind: 'birthday', name: 'Devon Thompson',   role: 'Engineering',        date: `${yyyy}-${mm}-${dd}`, initials: 'DT' },
  { kind: 'birthday', name: 'Priya Raman',      role: 'Customer Success',   date: `${yyyy}-${mm}-${dd}`, initials: 'PR' },
]

// Anniversaries
export const anniversaries = [
  { kind: 'anniversary', name: 'Cathy Cranford',  role: 'Marketing',     years: 7,  initials: 'CC' },
  { kind: 'anniversary', name: 'Susie Velasquez', role: 'Accounting',    years: 12, initials: 'SV' },
  { kind: 'anniversary', name: 'James Okoro',     role: 'Field Tech',    years: 3,  initials: 'JO' },
]

// Holidays — replace with iCal pull from staff calendar
export const holidays = [
  { kind: 'holiday', name: 'Memorial Day',      date: `${yyyy}-05-26`, blurb: 'Office closed' },
  { kind: 'holiday', name: 'Independence Day',  date: `${yyyy}-07-04`, blurb: 'Office closed' },
  { kind: 'holiday', name: 'Labor Day',         date: `${yyyy}-09-01`, blurb: 'Office closed' },
  { kind: 'holiday', name: 'Thanksgiving',      date: `${yyyy}-11-27`, blurb: 'Thurs + Fri off' },
]

// Field notes — wire to switchcommerce.team RSS or internal API
export const fieldNotes = [
  {
    kind: 'fieldnote',
    title: 'New ATM deployment in West Texas',
    author: 'Operations',
    snippet: '34 units delivered ahead of schedule. Field tech roundtable Friday at 2 PM in the south conference room.',
    timestamp: 'Today',
  },
  {
    kind: 'fieldnote',
    title: 'Q-pay v3 rollout cleared regression',
    author: 'Engineering',
    snippet: 'All four pilot merchants are live. Watch the dashboard for spike alerts and ping #qpay-rollout.',
    timestamp: '2h ago',
  },
  {
    kind: 'fieldnote',
    title: 'Welcome new hire — Lena Park (Compliance)',
    author: 'People Ops',
    snippet: 'Starts Monday on the 4th floor. Stop by and say hello — she comes from First National.',
    timestamp: 'Yesterday',
  },
]

// Curated YouTube embeds — safe-for-work, embeddable, low-attention-grab.
// Empty by default. Add IDs as you find videos worth showing in the kitchen.
//
// Each card is validated at runtime via /api/youtube-check (server-side
// oEmbed). Videos that aren't currently embeddable — owner-disabled embeds,
// removed, processing, age-restricted — are skipped automatically.
//
// Tip: prefer ambient / timelapse / instrumental music videos from
// channels with a long publishing history (less likely to vanish overnight).
//
// Format: { kind: 'youtube', videoId: 'XXXXXXXXXXX', title: 'Description' }
export const youtubeFeeds = [
  // Example (uncomment and replace ID after verifying it plays in an iframe):
  // { kind: 'youtube', videoId: 'aqz-KE-bpKQ', title: 'Big Buck Bunny (open content)' },
]

// Quotes / pull-out cards keep the rotation interesting between data cards.
export const quotes = [
  { kind: 'quote', text: 'Move fast. Get it right.',         attribution: 'Switch Commerce' },
  { kind: 'quote', text: 'The kitchen is for ideas too.',    attribution: '—' },
  { kind: 'quote', text: 'Take the long view on every call.', attribution: 'Field manual' },
]
