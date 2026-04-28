import { useEffect, useState } from 'react'

// Hacker News public Firebase API — no auth needed.
// Pulls top story IDs, then fetches details for the first `count`.
export function useHackerNews(count = 12, refreshMs = 30 * 60 * 1000) {
  const [stories, setStories] = useState([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const idsRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
        const ids    = await idsRes.json()
        const top    = ids.slice(0, count)
        const items  = await Promise.all(
          top.map(id => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json()))
        )
        if (cancelled) return
        setStories(items.filter(Boolean).map(it => ({
          kind:  'news',
          id:    it.id,
          title: it.title,
          by:    it.by,
          score: it.score,
          host:  (() => { try { return new URL(it.url).hostname.replace(/^www\./, '') } catch { return 'news.ycombinator.com' } })(),
        })))
      } catch {
        // leave previous stories in place on transient failure
      }
    }
    load()
    const id = setInterval(load, refreshMs)
    return () => { cancelled = true; clearInterval(id) }
  }, [count, refreshMs])

  return stories
}
