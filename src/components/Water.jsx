import { useEffect, useRef } from 'react'
import { tint } from '../lib/tint.js'

/**
 * A live water surface behind the page.
 *
 * A 2D height-field wave simulation: every cell pushes on its neighbours, so a
 * disturbance spreads outward as real ripples, reflects off the edges and fades.
 * The pointer drags a wake through it, a click drops a splash, and a few slow
 * drops keep it alive when nobody is touching anything. Slope is lit like a
 * water surface (crests catch light) and tinted from a colour ring, or from the
 * hovered project's colour. The system cursor is untouched.
 */

const PALETTE = [
  [255, 90, 60],
  [255, 197, 61],
  [182, 240, 60],
  [59, 182, 255],
  [183, 124, 255],
  [255, 77, 141],
]
const CELL = 5 // px per simulation cell
const DAMP = 0.986 // energy kept per frame
const LUT = 128

const smooth = (t) => t * t * (3 - 2 * t)

function ring(p, out) {
  const n = PALETTE.length
  const f = (((p % 1) + 1) % 1) * n
  const i = Math.floor(f)
  const a = PALETTE[i % n]
  const b = PALETTE[(i + 1) % n]
  const t = smooth(f - i)
  out[0] = a[0] + (b[0] - a[0]) * t
  out[1] = a[1] + (b[1] - a[1]) * t
  out[2] = a[2] + (b[2] - a[2]) * t
}

export default function Water() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let cur = new Float32Array(0)
    let prev = new Float32Array(0)
    let img = null
    let raf = 0
    const lut = new Float32Array(LUT * 3)
    const tmp = [0, 0, 0]

    function resize() {
      w = Math.max(8, Math.ceil(window.innerWidth / CELL))
      h = Math.max(8, Math.ceil(window.innerHeight / CELL))
      canvas.width = w
      canvas.height = h
      cur = new Float32Array(w * h)
      prev = new Float32Array(w * h)
      img = ctx.createImageData(w, h)
    }

    // Press a smooth dent into the surface; the simulation turns it into rings.
    function disturb(px, py, strength, radius) {
      const cx = px / CELL
      const cy = py / CELL
      const r = Math.ceil(radius)
      for (let y = Math.max(1, Math.floor(cy - r)); y <= Math.min(h - 2, Math.ceil(cy + r)); y++) {
        for (let x = Math.max(1, Math.floor(cx - r)); x <= Math.min(w - 2, Math.ceil(cx + r)); x++) {
          const d = Math.hypot(x - cx, y - cy)
          if (d <= radius) cur[y * w + x] -= strength * 0.5 * (1 + Math.cos((Math.PI * d) / radius))
        }
      }
    }

    function step() {
      for (let y = 1; y < h - 1; y++) {
        let i = y * w + 1
        for (let x = 1; x < w - 1; x++, i++) {
          prev[i] = ((cur[i - 1] + cur[i + 1] + cur[i - w] + cur[i + w]) * 0.5 - prev[i]) * DAMP
        }
      }
      const t = cur
      cur = prev
      prev = t
    }

    function draw(time) {
      // colour ring lookup, drifting slowly
      const drift = time * 0.000035
      for (let k = 0; k < LUT; k++) {
        ring(k / LUT + drift, tmp)
        lut[k * 3] = tmp[0]
        lut[k * 3 + 1] = tmp[1]
        lut[k * 3 + 2] = tmp[2]
      }

      // ease toward the hovered project's colour (or back to the ring)
      tint.mix += (tint.target - tint.mix) * 0.08
      for (let k = 0; k < 3; k++) tint.rgb[k] += (tint.to[k] - tint.rgb[k]) * 0.12
      const m = tint.mix
      const tr = tint.rgb[0]
      const tg = tint.rgb[1]
      const tb = tint.rgb[2]

      const d = img.data
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = y * w + x
          const o = i * 4
          if (x === 0 || y === 0 || x === w - 1 || y === h - 1) {
            d[o + 3] = 0
            continue
          }
          const height = cur[i]
          const dx = cur[i - 1] - cur[i + 1]
          const dy = cur[i - w] - cur[i + w]
          const shade = dx * 0.7 + dy * 0.9 // light from the top left
          const amp = Math.abs(height) * 0.16 + Math.abs(shade) * 0.4
          if (amp < 0.012) {
            d[o + 3] = 0
            continue
          }
          const a = amp > 1 ? 1 : amp

          const li = (((x / w) * 0.75 + (y / h) * 0.35) * LUT) | 0
          const k = (li % LUT) * 3
          let r = lut[k] + (tr - lut[k]) * m
          let g = lut[k + 1] + (tg - lut[k + 1]) * m
          let b = lut[k + 2] + (tb - lut[k + 2]) * m

          // crests that face the light catch a white highlight
          const spec = shade > 0 ? Math.min(1, shade * 0.5) : 0
          r += (255 - r) * spec
          g += (255 - g) * spec
          b += (255 - b) * spec

          d[o] = r
          d[o + 1] = g
          d[o + 2] = b
          d[o + 3] = a * 150
        }
      }
      ctx.putImageData(img, 0, 0)
    }

    function frame(time) {
      step()
      draw(time)
      raf = requestAnimationFrame(frame)
    }

    // ---- input ----
    let lx = null
    let ly = null
    const onMove = (e) => {
      const x = e.clientX
      const y = e.clientY
      if (lx !== null) {
        const dist = Math.hypot(x - lx, y - ly)
        if (dist >= 2) {
          const steps = Math.max(1, Math.ceil(dist / (CELL * 1.5)))
          const strength = Math.min(2.6, 0.55 + dist * 0.045)
          for (let s = 1; s <= steps; s++) {
            disturb(lx + ((x - lx) * s) / steps, ly + ((y - ly) * s) / steps, strength, 2.4)
          }
        } else return
      }
      lx = x
      ly = y
    }
    const onDown = (e) => {
      disturb(e.clientX, e.clientY, 6, 5.5)
      lx = e.clientX
      ly = e.clientY
    }
    const onLeave = () => {
      lx = ly = null
    }

    // slow ambient drops, so the surface is alive without any input
    const drop = () => {
      if (document.hidden) return
      disturb(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 3.2, 3.6)
    }
    const idle = setInterval(drop, 2800)
    const intro = [
      setTimeout(() => disturb(window.innerWidth * 0.26, window.innerHeight * 0.38, 4.5, 4.5), 500),
      setTimeout(() => disturb(window.innerWidth * 0.72, window.innerHeight * 0.3, 4.5, 4.5), 1100),
      setTimeout(() => disturb(window.innerWidth * 0.5, window.innerHeight * 0.62, 4.5, 4.5), 1700),
    ]

    let resizeTimer = 0
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(resize, 150)
    }

    resize()
    raf = requestAnimationFrame(frame)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(idle)
      intro.forEach(clearTimeout)
      clearTimeout(resizeTimer)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="water" aria-hidden="true" />
}
