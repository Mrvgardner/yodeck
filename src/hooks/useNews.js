import { useEffect, useState } from 'react'

// Pulls tech news (title + description + source) from /api/news.
// Default upstream is TechCrunch; the function applies a SFW keyword filter.
// Refreshes every 30 minutes; the function is edge-cached for 30 min anyway.
export function useNews(refreshMs = 30 * 60 * 1000) {
  const [stories, setStories] = useState([])

  useEffect(() => {
    let cancelled = false
    // Local preview only (?demo=all) — see data/devDemo.js. Stripped from production builds.
    if (import.meta.env.DEV && new URLSearchParams(window.location.search).get('demo') === 'all') {
      import('../data/devDemo.js').then(m => { if (!cancelled) setStories(m.demoNews) })
      return () => { cancelled = true }
    }
    async function load() {
      try {
        const res = await fetch('/api/news', { cache: 'no-cache' })
        if (!res.ok) return
        const json = await res.json()
        if (cancelled) return
        setStories(Array.isArray(json.stories) ? json.stories : [])
      } catch {
        // keep previous stories on transient failure
      }
    }
    load()
    const id = setInterval(load, refreshMs)
    return () => { cancelled = true; clearInterval(id) }
  }, [refreshMs])

  return stories
}
