// Netlify Function — runtime proxy for BambooHR iCal feeds.
// Returns parsed JSON so the browser can refresh data without a rebuild.
// Cached at the edge for 30 minutes so we don't hammer BambooHR.

import ical from 'node-ical'

const FEEDS = {
  birthdays:     'https://switch.bamboohr.com/feeds/feed.php?id=6ec1a93186a6e5b6b414228f65d1c687',
  anniversaries: 'https://switch.bamboohr.com/feeds/feed.php?id=b99008846115d7cf731e2c60c390b606',
  holidays:      'https://switch.bamboohr.com/feeds/feed.php?id=07952a7947615d889da23ee45666c762',
  whosOut:       'https://switch.bamboohr.com/feeds/feed.php?id=96c8668a98a9da7a47652ba5a3e907e3',
}

const pad         = n => String(n).padStart(2, '0')
const toMMDD      = d => `${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const toISODate   = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const initialsOf  = name => {
  const parts = name.trim().split(/\s+/).filter(p => !/^[IVX]+$/i.test(p))
  if (parts.length === 0) return '··'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

async function fetchFeed(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'YodeckKitchen/runtime' } })
  if (!res.ok) throw new Error(`Feed ${url} returned ${res.status}`)
  return res.text()
}

function extractEvents(icalText) {
  const data = ical.parseICS(icalText)
  const out = []
  for (const k of Object.keys(data)) {
    const e = data[k]
    if (e.type !== 'VEVENT' || !e.start || !e.summary) continue
    out.push({ summary: String(e.summary), start: new Date(e.start), end: e.end ? new Date(e.end) : null })
  }
  return out
}

function parseBirthday(s) {
  const name = s
    .replace(/\s*[-–—:]\s*Birthday\s*$/i, '')
    .replace(/['’]s\s+Birthday\s*$/i, '')
    .replace(/\s+Birthday\s*$/i, '')
    .trim()
  return { name }
}

function parseAnniversary(s) {
  const yr = s.match(/(\d+)\s*(?:years?|yrs?)/i)
  const years = yr ? parseInt(yr[1], 10) : null
  const name = s
    .replace(/\s*\(\s*\d+\s*(?:years?|yrs?)\s*\)\s*$/i, '')
    .replace(/\s*[-–—:]\s*\d+\s*(?:years?|yrs?|st|nd|rd|th)[\w\s]*anniversary\s*$/i, '')
    .replace(/['’]s\s+\d+\s*(?:years?|yrs?|st|nd|rd|th)[\w\s]*anniversary\s*$/i, '')
    .replace(/\s+anniversary\s*$/i, '')
    .trim()
  return { name, years }
}

function parseHoliday(s) {
  const name = s
    .replace(/^Company Holiday\s*[-–—:]\s*/i, '')
    .replace(/\s*\(US\)\s*$/i, '')
    .trim()
  return { name }
}

function parseWhosOut(s) {
  const m = s.match(/^(.*?)\s*\(\s*Time off\s*[-–—:]\s*(\d+)\s*days?\s*\)\s*$/i)
  if (m) return { name: m[1].trim(), days: parseInt(m[2], 10) }
  const name = s.replace(/\s*\([^)]*\)\s*$/, '').trim()
  return { name, days: null }
}

export default async function handler() {
  try {
    const [bdT, anT, holT, woT] = await Promise.all([
      fetchFeed(FEEDS.birthdays),
      fetchFeed(FEEDS.anniversaries),
      fetchFeed(FEEDS.holidays),
      fetchFeed(FEEDS.whosOut),
    ])

    // birthdays
    const bdMap = new Map()
    for (const e of extractEvents(bdT)) {
      const { name } = parseBirthday(e.summary)
      if (!name || bdMap.has(name)) continue
      bdMap.set(name, { kind: 'birthday', name, mmdd: toMMDD(e.start), initials: initialsOf(name) })
    }
    const birthdays = [...bdMap.values()].sort((a, b) => a.mmdd.localeCompare(b.mmdd))

    // anniversaries
    const anMap = new Map()
    for (const e of extractEvents(anT)) {
      const { name, years } = parseAnniversary(e.summary)
      if (!name) continue
      const startYear = years ? e.start.getFullYear() - years : null
      const existing  = anMap.get(name)
      if (!existing || (startYear && startYear < existing.startYear)) {
        anMap.set(name, {
          kind:      'anniversary',
          name,
          mmdd:      toMMDD(e.start),
          startYear: startYear ?? new Date().getFullYear() - (years ?? 0),
          initials:  initialsOf(name),
        })
      }
    }
    const anniversaries = [...anMap.values()].sort((a, b) => a.mmdd.localeCompare(b.mmdd))

    // holidays
    const holMap = new Map()
    for (const e of extractEvents(holT)) {
      const { name } = parseHoliday(e.summary)
      if (!name) continue
      const iso = toISODate(e.start)
      const k   = iso + '|' + name
      if (!holMap.has(k)) holMap.set(k, { kind: 'holiday', name, date: iso, blurb: 'Office closed' })
    }
    const holidays = [...holMap.values()].sort((a, b) => a.date.localeCompare(b.date))

    // who's out
    const whosOut = []
    for (const e of extractEvents(woT)) {
      const { name, days } = parseWhosOut(e.summary)
      if (!name) continue
      whosOut.push({
        kind:      'whosout',
        name,
        days,
        startDate: toISODate(e.start),
        endDate:   e.end ? toISODate(new Date(e.end.getTime() - 24 * 60 * 60 * 1000)) : toISODate(e.start),
        initials:  initialsOf(name),
      })
    }
    whosOut.sort((a, b) => a.startDate.localeCompare(b.startDate))

    const body = JSON.stringify({
      birthdays,
      anniversaries,
      holidays,
      whosOut,
      generatedAt: new Date().toISOString(),
    })

    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type':              'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        // Cache 30 min at the CDN edge so repeated reloads don't slam BambooHR.
        'Cache-Control':             'public, max-age=60',
        'Netlify-CDN-Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({
        birthdays: [], anniversaries: [], holidays: [], whosOut: [],
        error: err.message,
        generatedAt: new Date().toISOString(),
      }),
      {
        status: 200,  // never block the kitchen TV
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
      }
    )
  }
}

export const config = { path: '/api/feeds' }
