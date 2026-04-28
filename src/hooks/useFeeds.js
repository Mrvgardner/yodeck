import { useEffect, useState } from 'react'

// Hits the /api/feeds Netlify Function for fresh BambooHR data.
// Refreshes hourly so a kitchen TV that stays on all day stays current
// without a redeploy. The function itself is edge-cached for 30 min.
export function useFeeds(refreshMs = 60 * 60 * 1000) {
  const [feeds, setFeeds] = useState({
    birthdays:     [],
    anniversaries: [],
    holidays:      [],
    whosOut:       [],
    generatedAt:   null,
  })

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/api/feeds', { cache: 'no-cache' })
        if (!res.ok) return
        const json = await res.json()
        if (cancelled) return
        setFeeds({
          birthdays:     json.birthdays     || [],
          anniversaries: json.anniversaries || [],
          holidays:      json.holidays      || [],
          whosOut:       json.whosOut       || [],
          generatedAt:   json.generatedAt   || null,
        })
      } catch {
        // keep previous feeds on transient failure
      }
    }
    load()
    const id = setInterval(load, refreshMs)
    return () => { cancelled = true; clearInterval(id) }
  }, [refreshMs])

  return feeds
}
