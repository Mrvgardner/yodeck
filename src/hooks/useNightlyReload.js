import { useEffect } from 'react'

// Reloads the page at the next occurrence of the given local-time hour:minute.
// Defaults to 02:00 — quiet hours for the kitchen TV.
// Reasons we reload (even though /api/feeds keeps data fresh):
//  - clears any leaked memory from a long-running React tree
//  - resets stuck YouTube iframes
//  - picks up new deploys without manual intervention
export function useNightlyReload({ hour = 2, minute = 0 } = {}) {
  useEffect(() => {
    const now = new Date()
    const target = new Date(
      now.getFullYear(), now.getMonth(), now.getDate(),
      hour, minute, 0, 0
    )
    if (target <= now) target.setDate(target.getDate() + 1)
    const ms = target.getTime() - now.getTime()
    const id = setTimeout(() => {
      // bypass disk cache so we get a fresh bundle if a deploy ran overnight
      window.location.reload()
    }, ms)
    return () => clearTimeout(id)
  }, [hour, minute])
}
