// Size-aware sizing helpers for cards.
//
// Every card receives a `size` prop = { w, h } from the scheduler. Cells:
//   1×1 = 1 cell  → "small"   (most compact)
//   2×1 = 2 cells → "medium"  (wider)
//   1×2 = 2 cells → "medium"  (taller)
//   2×2 = 4 cells → "large"   (feature)
//
// scaleOf returns 0/1/2 so cards can index size-tier tables and pick a font
// (and ornament) that fills the cell properly without overflowing 1×1.

export function scaleOf(size) {
  const w = size?.w || 1
  const h = size?.h || 1
  const cells = w * h
  if (cells >= 4) return 2  // 2×2 — feature
  if (cells >= 2) return 1  // 2×1 / 1×2 — wide or tall
  return 0                  // 1×1 — small
}

// Pick a class from a 3-tier table by length band + scale.
// `tiers` shape: [ [smallA, mediumA, largeA], [smallB, mediumB, largeB], ... ]
// where each row corresponds to a length band, in ascending order.
// `bands` is the list of max-lengths matching each row in `tiers`.
export function pickByLen(text, scale, bands, tiers) {
  const len = text?.length || 0
  let row = bands.length  // beyond all bands = last row
  for (let i = 0; i < bands.length; i++) {
    if (len <= bands[i]) { row = i; break }
  }
  const safeRow = Math.min(row, tiers.length - 1)
  return tiers[safeRow][scale] || tiers[safeRow][0]
}
