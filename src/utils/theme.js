// Seasonal theme switch. Evaluated once per page load; App also schedules a
// reload at the end of the window so the TV moves on to the next look (or
// back to normal) on its own.
//
// Preview any time with ?theme=halloween, ?theme=fall or ?theme=christmas —
// or force the normal look with ?theme=none.

// Thanksgiving: the fourth Thursday of November.
export function thanksgivingOf(year) {
  const nov1 = new Date(year, 10, 1)
  const firstThursday = 1 + ((4 - nov1.getDay() + 7) % 7)
  return new Date(year, 10, firstThursday + 21)
}

// Windows are [start, end) in local time, back to back:
//   halloween  Oct 1 → Nov 1
//   fall       Nov 1 → midnight after Black Friday (Thanksgiving + 2)
//   christmas  then → Jan 2 of the next year (through New Year's Day)
function windowsFor(year) {
  const blackFridayEnd = new Date(year, 10, thanksgivingOf(year).getDate() + 2)
  return {
    halloween: { start: new Date(year, 9, 1),  end: new Date(year, 10, 1) },
    fall:      { start: new Date(year, 10, 1), end: blackFridayEnd },
    christmas: { start: blackFridayEnd,        end: new Date(year + 1, 0, 2) },
  }
}

export const THEMES = ['halloween', 'fall', 'christmas']

// The scheduled theme for a moment, with its window. Checks last year's
// windows too, since Christmas runs into January.
function scheduled(now) {
  for (const year of [now.getFullYear(), now.getFullYear() - 1]) {
    const windows = windowsFor(year)
    const name = THEMES.find(n => now >= windows[n].start && now < windows[n].end)
    if (name) return { name, ...windows[name] }
  }
  return null
}

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
  return scheduled(now)?.name ?? null
}

// ms until the scheduled theme should switch off, or null when there's
// nothing to schedule (no theme, or forced on via the URL).
export function msUntilThemeEnds(theme, now = new Date()) {
  if (!theme || urlOverride() === theme) return null
  const current = scheduled(now)
  return current?.name === theme ? current.end - now : null
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
