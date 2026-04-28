// Netlify Function — proxies a tech news RSS feed and parses it to JSON
// with title + description + source. Lets the kitchen TV show readable
// headlines instead of inside-baseball one-liners.
//
// Default feed: TechCrunch (RSS includes descriptions; consistent format).
// Override via NEWS_FEED_URL env var.
//
// Headlines pass through a SFW keyword filter — anything containing one of
// these words is dropped (defensive for a workplace kitchen display).

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
    'Cache-Control':               'public, max-age=120',
    'Netlify-CDN-Cache-Control':   'public, s-maxage=1800, stale-while-revalidate=3600',
    ...extra,
  }
}

function extract(block, tag) {
  const cdataRe = new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, 'i')
  const plainRe = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i')
  const m = block.match(cdataRe) || block.match(plainRe)
  return m ? m[1].trim() : ''
}

function stripHtml(s) {
  return s.replace(/<[^>]+>/g, ' ')
          // numeric entities (decimal + hex)
          .replace(/&#(\d+);/g,        (_, n) => String.fromCharCode(parseInt(n, 10)))
          .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
          // named entities
          .replace(/&nbsp;/gi, ' ')
          .replace(/&amp;/gi,  '&')
          .replace(/&quot;/gi, '"')
          .replace(/&apos;/gi, "'")
          .replace(/&lt;/gi,   '<')
          .replace(/&gt;/gi,   '>')
          .replace(/\s+/g, ' ')
          .trim()
}

function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return '' }
}

// Drop any story whose title OR description contains these (case-insensitive,
// whole-word). Tuned for a workplace kitchen — favors false-positive skips
// over showing something off-tone. Edit as needed.
const SFW_BLOCKLIST = [
  // adult / dating
  'sex', 'porn', 'nude', 'nudes', 'onlyfans', 'dating app', 'cruising', 'hookup', 'escort', 'fetish', 'kink',
  // violence / death / crime
  'murder', 'killed', 'shooter', 'shooting', 'massacre', 'rape', 'assault',
  'suicide', 'overdose', 'die', 'died', 'death', 'corpse', 'gore', 'graphic',
  // politics / heated topics
  'trump', 'biden', 'maga', 'gop', 'democrat', 'republican', 'congress', 'senator',
  'abortion', 'roe', 'gun control', 'gunman',
  // workplace-sensitive
  'layoff', 'layoffs', 'fired', 'lawsuit', 'sued', 'fraud', 'bankruptcy', 'scandal', 'harassment',
  // gambling / drugs / alcohol-heavy
  'cannabis', 'marijuana', 'cocaine', 'heroin', 'fentanyl',
]

function isSafe(title, description) {
  const hay = (title + ' ' + description).toLowerCase()
  for (const word of SFW_BLOCKLIST) {
    // word boundary so "die" doesn't trip on "diet" but does trip on "died"
    const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
    if (re.test(hay)) return false
  }
  return true
}

function parseFeed(xml) {
  const items = []
  const itemRe = /<item\b[^>]*>([\s\S]*?)<\/item>/gi
  let m
  while ((m = itemRe.exec(xml)) && items.length < 20) {
    const block = m[1]
    const title       = stripHtml(extract(block, 'title'))
    const description = stripHtml(extract(block, 'description'))
    const link        = stripHtml(extract(block, 'link'))
    const pubDate     = stripHtml(extract(block, 'pubDate'))
    if (!title) continue
    if (!isSafe(title, description)) continue
    items.push({
      kind:        'news',
      id:          link || title,
      title,
      description: description.length > 240 ? description.slice(0, 240).replace(/\s+\S*$/, '') + '…' : description,
      host:        hostOf(link),
      pubDate,
    })
  }
  return items
}

export default async function handler() {
  const url = process.env.NEWS_FEED_URL || 'https://techcrunch.com/feed/'
  try {
    const res = await withTimeout(fetch(url, {
      headers: { 'User-Agent': 'YodeckKitchen/news', 'Accept': 'application/rss+xml, application/xml, text/xml' },
    }))
    if (!res.ok) {
      return new Response(JSON.stringify({ stories: [], error: `feed_${res.status}` }), {
        status: 200, headers: jsonCors(),
      })
    }
    const xml = await res.text()
    const stories = parseFeed(xml).slice(0, 12)
    return new Response(JSON.stringify({ stories, fetchedAt: new Date().toISOString() }), {
      status: 200, headers: jsonCors(),
    })
  } catch (err) {
    return new Response(JSON.stringify({ stories: [], error: err.message || 'error' }), {
      status: 200, headers: jsonCors(),
    })
  }
}

export const config = { path: '/api/news' }
