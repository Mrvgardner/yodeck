// Netlify Function — proxy that fetches Field Notes from SCCCMarketingDatabase
// using a shared secret. Browser hits /api/field-notes; secret stays server-side.
//
// Required Netlify env vars:
//   SCC_FIELD_NOTES_URL  e.g. https://sccmarketingdatabase.netlify.app/.netlify/functions/field-notes
//   KITCHEN_READ_TOKEN   same value set on the SCC site

const TIMEOUT_MS = 8000

function withTimeout(promise, ms = TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ])
}

function jsonCors(extra = {}) {
  return {
    'Content-Type':                'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    // Edge-cache 5 min so repeated reloads don't hammer the SCC function.
    'Cache-Control':               'public, max-age=60',
    'Netlify-CDN-Cache-Control':   'public, s-maxage=300, stale-while-revalidate=900',
    ...extra,
  }
}

export default async function handler() {
  const url   = process.env.SCC_FIELD_NOTES_URL
  const token = process.env.KITCHEN_READ_TOKEN

  if (!url || !token) {
    return new Response(JSON.stringify({
      notes: [],
      error: 'missing_env',
      detail: 'SCC_FIELD_NOTES_URL and KITCHEN_READ_TOKEN must be set in Netlify env',
    }), { status: 200, headers: jsonCors() })
  }

  try {
    // Send token as both query param + header so it works regardless of how
    // the SCC function reads it.
    const sep = url.includes('?') ? '&' : '?'
    const target = `${url}${sep}token=${encodeURIComponent(token)}`
    const res = await withTimeout(fetch(target, {
      headers: {
        'X-Read-Token': token,
        'User-Agent':   'YodeckKitchen/field-notes',
      },
    }))
    if (!res.ok) {
      return new Response(JSON.stringify({ notes: [], error: `scc_${res.status}` }), {
        status: 200, headers: jsonCors(),
      })
    }
    const raw = await res.json()
    // Normalize to the shape Yodeck's FieldNoteCard expects.
    // Pull out a few of the most recent (newest first — SCC already sorts that way).
    const notes = (Array.isArray(raw) ? raw : []).slice(0, 12).map(n => ({
      kind:      'fieldnote',
      id:        n.id,
      title:     n.title,
      author:    n.author || 'Team',
      snippet:   n.excerpt || (n.content || '').replace(/\s+/g, ' ').slice(0, 240),
      timestamp: relativeTimestamp(n.date),
      date:      n.date,
    }))
    return new Response(JSON.stringify({ notes, fetchedAt: new Date().toISOString() }), {
      status: 200, headers: jsonCors(),
    })
  } catch (err) {
    return new Response(JSON.stringify({ notes: [], error: err.message || 'error' }), {
      status: 200, headers: jsonCors(),
    })
  }
}

function relativeTimestamp(isoDate) {
  if (!isoDate) return ''
  const d = new Date(isoDate + 'T12:00:00')
  if (Number.isNaN(d.getTime())) return ''
  const today = new Date(); today.setHours(0,0,0,0)
  const that  = new Date(d); that.setHours(0,0,0,0)
  const days  = Math.round((today - that) / (1000 * 60 * 60 * 24))
  if (days === 0)  return 'Today'
  if (days === 1)  return 'Yesterday'
  if (days <  7)   return `${days} days ago`
  if (days < 14)   return 'Last week'
  if (days < 30)   return `${Math.floor(days / 7)} weeks ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const config = { path: '/api/field-notes' }
