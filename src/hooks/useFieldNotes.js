import { useEffect, useState } from 'react'

// Pulls the latest field notes from /api/field-notes (proxied to SCC), plus
// the latest week's recognition highlights (or null) for the shout-outs card.
// Refreshes every 10 minutes — frequent enough to catch new posts without
// hammering anything (the function itself is edge-cached for 5 min).
const EMPTY = { notes: [], highlights: null }

export function useFieldNotes(refreshMs = 10 * 60 * 1000) {
  const [feed, setFeed] = useState(EMPTY)

  useEffect(() => {
    let cancelled = false
    // Local preview only: the dev server has no /api proxy, so ?demo=highlights
    // loads sample shout-outs and ?demo=all sample notes too. Stripped from
    // production builds.
    const demo = import.meta.env.DEV && new URLSearchParams(window.location.search).get('demo')
    if (demo === 'highlights') {
      import('../data/highlightsDemo.js').then(m => { if (!cancelled) setFeed({ notes: [], highlights: m.demoHighlights }) })
      return () => { cancelled = true }
    }
    if (demo === 'all') {
      import('../data/devDemo.js').then(m => { if (!cancelled) setFeed(m.demoFieldNotes) })
      return () => { cancelled = true }
    }
    async function load() {
      try {
        const res = await fetch('/api/field-notes', { cache: 'no-cache' })
        if (!res.ok) return
        const json = await res.json()
        if (cancelled) return
        setFeed({
          notes:      Array.isArray(json.notes) ? json.notes : [],
          highlights: json.highlights && Array.isArray(json.highlights.items) ? json.highlights : null,
        })
      } catch {
        // keep previous notes on transient failure
      }
    }
    load()
    const id = setInterval(load, refreshMs)
    return () => { cancelled = true; clearInterval(id) }
  }, [refreshMs])

  return feed
}
