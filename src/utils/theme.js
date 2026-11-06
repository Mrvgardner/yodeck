// Seasonal theme switch. Evaluated once per page load; App also schedules a
// reload at the end of the window so the TV moves on to the next look (or
// back to normal) on its own.
//
// Preview any time with ?theme=halloween or ?theme=fall — or force the normal
// look with ?theme=none.

// Thanksgiving: the fourth Thursday of November.
export function thanksgivingOf(year) {
  const nov1 = new Date(year, 10, 1)
  const firstThursday = 1 + ((4 - nov1.getDay() + 7) % 7)
  return new Date(year, 10, firstThursday + 21)
}

// Windows are [start, end) in local time. Fall picks up the moment Halloween
// ends and runs through Black Friday (midnight after Thanksgiving + 1).
function windowsFor(year) {
  const thanksgiving = thanksgivingOf(year)
  return {
    halloween: { start: new Date(year, 9, 1),  end: new Date(year, 10, 1) },
    fall:      { start: new Date(year, 10, 1), end: new Date(year, 10, thanksgiving.getDate() + 2) },
  }
}

export const THEMES = ['halloween', 'fall']

function urlOverride() {
  try {
    return new URLSearchParams(window.location.search).get('theme')
  } catch {
    return null
  }
}

// Returns a theme name from THEMES, or null for the normal look.
export function activeTheme(now = new Date()) {
  const override = urlOverride()
  if (THEMES.includes(override)) return override
  if (override === 'none')       return null
  const windows = windowsFor(now.getFullYear())
  return THEMES.find(name => now >= windows[name].start && now < windows[name].end) ?? null
}

// ms until the scheduled theme should switch off, or null when there's
// nothing to schedule (no theme, or forced on via the URL).
export function msUntilThemeEnds(theme, now = new Date()) {
  if (!theme || urlOverride() === theme) return null
  return windowsFor(now.getFullYear())[theme].end - now
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
