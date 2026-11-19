// The water takes on the colour of whichever project row is hovered.
// Rows call setTint(hex) on enter and setTint(null) on leave; Water.jsx eases toward it.
export const tint = { rgb: [255, 255, 255], to: [255, 255, 255], mix: 0, target: 0 }

export function setTint(hex) {
  if (!hex) {
    tint.target = 0
    return
  }
  const n = parseInt(hex.slice(1), 16)
  tint.to = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  tint.target = 1
}
