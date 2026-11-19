import { useEffect, useRef } from 'react'

const lerp = (a, b, t) => a + (b - a) * t

/**
 * Custom cursor: a 6px dot and a 32px ring that trails it. Over anything with
 * data-cursor="LABEL" both collapse into a pill that carries that label. Over
 * other interactive elements the ring grows. Position is written with
 * translate3d from a requestAnimationFrame lerp loop. Disabled entirely on
 * touch devices ((pointer: coarse)).
 */
export default function Cursor() {
  const layer = useRef(null)
  const dotEl = useRef(null)
  const ringEl = useRef(null)
  const pillEl = useRef(null)
  const labelEl = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine) and (hover: hover)')
    if (!fine.matches) return

    const root = document.documentElement
    root.classList.add('has-cursor')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const m = { x: 0, y: 0 }
    const dot = { x: 0, y: 0 }
    const ring = { x: 0, y: 0 }
    const pill = { x: 0, y: 0 }
    let started = false
    let target = null
    let hot = false
    let mode = 'idle'
    let label = ''
    let raf = 0

    const place = (el, p) => {
      el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`
    }

    const onMove = (e) => {
      m.x = e.clientX
      m.y = e.clientY
      if (!started) {
        started = true
        dot.x = ring.x = pill.x = m.x
        dot.y = ring.y = pill.y = m.y
        layer.current.dataset.visible = 'true'
      }
    }

    const onOver = (e) => {
      const el = e.target instanceof Element ? e.target : null
      target = el ? el.closest('[data-cursor]') : null
      hot = !target && Boolean(el && el.closest('a, button, input, label, [role="switch"]'))
    }

    const onLeave = () => {
      layer.current.dataset.visible = 'false'
    }
    const onEnter = () => {
      if (started) layer.current.dataset.visible = 'true'
    }
    const onDown = () => {
      layer.current.dataset.down = 'true'
    }
    const onUp = () => {
      layer.current.dataset.down = 'false'
    }

    const tick = () => {
      dot.x = lerp(dot.x, m.x, reduce ? 1 : 0.55)
      dot.y = lerp(dot.y, m.y, reduce ? 1 : 0.55)
      ring.x = lerp(ring.x, m.x, reduce ? 1 : 0.16)
      ring.y = lerp(ring.y, m.y, reduce ? 1 : 0.16)
      pill.x = lerp(pill.x, m.x, reduce ? 1 : 0.22)
      pill.y = lerp(pill.y, m.y, reduce ? 1 : 0.22)

      place(dotEl.current, dot)
      place(ringEl.current, ring)
      place(pillEl.current, pill)

      // Row labels change while hovered (DETAILS + / CLOSE −), so read every frame.
      if (target && !target.isConnected) target = null
      const nextLabel = target ? target.dataset.cursor : ''
      if (nextLabel && nextLabel !== label) {
        label = nextLabel
        labelEl.current.textContent = label
      }

      const nextMode = target ? 'pill' : hot ? 'hot' : 'idle'
      if (nextMode !== mode) {
        mode = nextMode
        layer.current.dataset.mode = mode
      }

      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('pointerup', onUp)
    root.addEventListener('mouseleave', onLeave)
    root.addEventListener('mouseenter', onEnter)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerup', onUp)
      root.removeEventListener('mouseleave', onLeave)
      root.removeEventListener('mouseenter', onEnter)
      root.classList.remove('has-cursor')
    }
  }, [])

  return (
    <div ref={layer} className="cursor-layer" data-mode="idle" data-visible="false" data-down="false" aria-hidden="true">
      <div ref={ringEl} className="cursor-ring">
        <i />
      </div>
      <div ref={dotEl} className="cursor-dot">
        <i />
      </div>
      <div ref={pillEl} className="cursor-pill">
        <i ref={labelEl} />
      </div>
    </div>
  )
}
