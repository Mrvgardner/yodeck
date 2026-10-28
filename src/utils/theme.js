// Seasonal theme switch. Evaluated once per page load; App also schedules a
// reload at the end of the window so the TV drops back to normal on its own.
//
// Preview any time with ?theme=halloween — or force it off with ?theme=none.

export const HALLOWEEN_WINDOW = {
  start: new Date(2026, 9, 1),    // Oct 1, 2026 00:00 local
  end:   new Date(2026, 10, 1),   // Nov 1, 2026 00:00 local (midnight)
}

function urlOverride() {
  try {
    return new URLSearchParams(window.location.search).get('theme')
  } catch {
    return null
  }
}

// Returns 'halloween' or null.
export function activeTheme(now = new Date()) {
  const override = urlOverride()
  if (override === 'halloween') return 'halloween'
  if (override === 'none')      return null
  const { start, end } = HALLOWEEN_WINDOW
  return now >= start && now < end ? 'halloween' : null
}

// ms until the scheduled theme should switch off, or null when there's
// nothing to schedule (no theme, or forced on via the URL).
export function msUntilThemeEnds(theme, now = new Date()) {
  if (theme !== 'halloween' || urlOverride() === 'halloween') return null
  return HALLOWEEN_WINDOW.end - now
}

// Creepster is only needed while the Halloween theme runs, so load it on
// demand instead of shipping it to every page load.
export function loadThemeFonts(theme) {
  if (theme !== 'halloween' || document.getElementById('font-creepster')) return
  const link = document.createElement('link')
  link.id   = 'font-creepster'
  link.rel  = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Creepster&display=swap'
  document.head.appendChild(link)
}
