// Author-controlled content for the kitchen signage feed.
//
// IMPORTANT: nothing in this file should fabricate people, events, or
// announcements. Birthdays / anniversaries / holidays / who's-out come from
// BambooHR (live), and field notes come from switchcommerce.team (live).
// If a feed fails, the kitchen TV simply shows fewer cards — never made-up
// placeholders.
//
// What lives here:
//   - youtubeFeeds: a curated list of SFW video IDs (verified at runtime)
//   - quotes:       brand-approved one-liners that aren't tied to specific
//                   people or events

// Curated YouTube embeds — safe-for-work, embeddable, low-attention-grab.
// Each card is validated at runtime via /api/youtube-check (server-side
// oEmbed). Videos that aren't currently embeddable — owner-disabled embeds,
// removed, processing, age-restricted — are skipped automatically.
//
// Format: { kind: 'youtube', videoId: 'XXXXXXXXXXX', title: 'Description' }
export const youtubeFeeds = [
  { kind: 'youtube', videoId: 'SUXPnIEpbn4', title: 'Panda Cam · Chengdu Panda Base' },
  { kind: 'youtube', videoId: 'B4-L2nfGcuE', title: 'Big Bear Bald Eagle Nest · Live' },
  { kind: 'youtube', videoId: 'Zl_gKWFrgpA', title: 'Live Webcams Around the World' },
  { kind: 'youtube', videoId: '92IaqdAkYO0', title: 'Zelda: Breath of the Wild · Chill Stream' },
]

// Pull-out quote cards — empty by default to avoid putting words in
// anyone's mouth. Populate with real Switch Commerce quotes, mantras,
// or values that you've explicitly approved for kitchen display.
//
// Format: { kind: 'quote', text: '...', attribution: '...' }
export const quotes = [
  // { kind: 'quote', text: 'Real quote here.', attribution: 'Real source' },
]
