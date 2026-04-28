// Context-aware funny weather quips. Pick one based on temp band.
// All SFW — kitchen TV with mixed audience.
// `pickFunny()` returns a string ~35% of the time, otherwise null
// (let the real condition show).

const QUIPS = {
  scorching: [   // 95+
    'Stupid Hot',
    'Surface of the Sun',
    'Egg-on-Sidewalk Hot',
    'Texas Special',
    'Just Stay Inside',
  ],
  hot: [         // 85–94
    'Real Toasty',
    'Patio Weather (lies)',
    "It's a Dry Heat (it isn't)",
    'Sweater? Hard No.',
  ],
  warm: [        // 72–84
    'Too Nice for Work',
    'Field Trip Weather',
    'Gone Fishin’ Weather',
    'Patio Lunch?',
  ],
  mild: [        // 60–71
    'Light Jacket Optional',
    'Goldilocks Says: Just Right',
    'Pretty Decent, Honestly',
  ],
  cool: [        // 45–59
    'Hoodie Season',
    'Coffee Weather',
    'Soup Weather',
    'A Brisk Walk Kind of Day',
  ],
  cold: [        // 32–44
    'Bundle Up',
    'Layers Required',
    'Where Did I Put That Beanie',
  ],
  freezing: [    // < 32
    'Freezing My Backside Off',
    'Polar Vortex Vibes',
    'Don’t Lick the Pole',
    'The Pipes! The Pipes!',
  ],
}

function bandFor(tempF) {
  if (typeof tempF !== 'number') return 'mild'
  if (tempF >= 95) return 'scorching'
  if (tempF >= 85) return 'hot'
  if (tempF >= 72) return 'warm'
  if (tempF >= 60) return 'mild'
  if (tempF >= 45) return 'cool'
  if (tempF >= 32) return 'cold'
  return 'freezing'
}

// Returns a funny string ~35% of the time, otherwise null.
// Pass a stable seed (e.g. card._id) to keep the same pick across re-renders.
export function pickFunny(tempF, seed = Math.random()) {
  // Convert seed → 0..1
  const r = typeof seed === 'string'
    ? [...seed].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7) / 0xffffffff
    : seed
  if (r > 0.35) return null
  const list = QUIPS[bandFor(tempF)]
  // Use a second hash for which quip to pick
  const idx = Math.floor((r * 1e6) % list.length)
  return list[idx]
}
