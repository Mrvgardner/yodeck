// Per-card preload helpers. Returns a Promise that resolves true when the
// card is renderable, or false when content can't be loaded (in which case
// the scheduler should skip the card and try another).

const TIMEOUT_MS = 5000

function withTimeout(promise, ms = TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise(resolve => setTimeout(() => resolve(false), ms)),
  ])
}

// YouTube — server-side oEmbed check via /api/youtube-check.
// oEmbed authoritatively reports whether a video is currently embeddable;
// the thumbnail probe we used previously gave false positives (a thumbnail
// can return 200 while the embed shows "We're processing this video…").
//
// In local dev (no Netlify functions), the proxy 404s — we treat that as a
// soft skip rather than a hard failure so the card just doesn't appear.
function preloadYouTube(card) {
  const id = card.videoId
  if (!id) return Promise.resolve(false)
  return withTimeout(
    fetch(`/api/youtube-check?id=${encodeURIComponent(id)}`, { cache: 'force-cache' })
      .then(res => {
        if (!res.ok) return false
        return res.json().then(j => Boolean(j && j.ok)).catch(() => false)
      })
      .catch(() => false)
  )
}

// Weather — must have populated data
function preloadWeather(card) {
  return Promise.resolve(typeof card.tempF === 'number')
}

// All other card kinds have no external dependencies.
const PRELOADERS = {
  birthday:    () => Promise.resolve(true),
  anniversary: () => Promise.resolve(true),
  holiday:     () => Promise.resolve(true),
  whosout:     () => Promise.resolve(true),
  fieldnote:   () => Promise.resolve(true),
  news:        () => Promise.resolve(true),
  quote:       () => Promise.resolve(true),
  weather:     preloadWeather,
  youtube:     preloadYouTube,
}

export function preloadCard(card) {
  const fn = PRELOADERS[card.kind]
  return fn ? fn(card) : Promise.resolve(true)
}
