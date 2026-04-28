// Netlify Function — server-side YouTube embed validator.
// Probes YouTube's oEmbed endpoint, which authoritatively answers
// "is this video embeddable right now?":
//   200  → embeddable (returns video metadata)
//   401  → embed disabled by owner
//   404  → video not found / removed / private
// We proxy server-side because YouTube's oEmbed doesn't allow CORS from browsers.

const TIMEOUT_MS = 4000

function withTimeout(promise, ms = TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ])
}

export default async function handler(req) {
  const url = new URL(req.url)
  const id  = url.searchParams.get('id')
  if (!id || !/^[A-Za-z0-9_-]{6,15}$/.test(id)) {
    return new Response(JSON.stringify({ ok: false, reason: 'invalid_id' }), {
      status: 200,
      headers: jsonCors(),
    })
  }

  try {
    const oembed = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`
    const res = await withTimeout(fetch(oembed, { headers: { 'User-Agent': 'YodeckKitchen/embed-check' } }))
    if (!res.ok) {
      return new Response(JSON.stringify({ ok: false, reason: `oembed_${res.status}` }), {
        status: 200,
        headers: jsonCors(),
      })
    }
    const data = await res.json().catch(() => null)
    if (!data || !data.title) {
      return new Response(JSON.stringify({ ok: false, reason: 'no_title' }), {
        status: 200,
        headers: jsonCors(),
      })
    }
    return new Response(JSON.stringify({ ok: true, title: data.title, author: data.author_name }), {
      status: 200,
      headers: jsonCors(),
    })
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, reason: err.message || 'error' }), {
      status: 200,
      headers: jsonCors(),
    })
  }
}

function jsonCors() {
  return {
    'Content-Type':              'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    // Cache embed-check responses for an hour at the edge — cheap & reduces YouTube hits.
    'Cache-Control':             'public, max-age=300',
    'Netlify-CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
  }
}

export const config = { path: '/api/youtube-check' }
