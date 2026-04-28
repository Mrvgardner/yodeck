import { useEffect, useState } from 'react'

// Pulls the latest field notes from /api/field-notes (proxied to SCC).
// Refreshes every 10 minutes — frequent enough to catch new posts without
// hammering anything (the function itself is edge-cached for 5 min).
export function useFieldNotes(refreshMs = 10 * 60 * 1000) {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/api/field-notes', { cache: 'no-cache' })
        if (!res.ok) return
        const json = await res.json()
        if (cancelled) return
        setNotes(Array.isArray(json.notes) ? json.notes : [])
      } catch {
        // keep previous notes on transient failure
      }
    }
    load()
    const id = setInterval(load, refreshMs)
    return () => { cancelled = true; clearInterval(id) }
  }, [refreshMs])

  return notes
}
