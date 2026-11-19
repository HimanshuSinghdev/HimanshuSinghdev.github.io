import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { formatDate } from '../lib/merge.js'

export default function Hero({ total, lastPush }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('.hero-line > span', { yPercent: 115, duration: 1.4, stagger: 0.13, delay: 0.15 })
        .from('.hero-sub > *', { opacity: 0, y: 12, duration: 1, stagger: 0.08 }, '-=0.9')
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} id="top" className="mx-auto max-w-[1600px] px-6 pb-14 pt-20 md:px-10 md:pb-20 md:pt-28">
      <h1 className="font-heading text-[clamp(3.1rem,11.5vw,10.75rem)] font-medium leading-[0.92] tracking-[-0.03em]">
        <span className="hero-line">
          <span>Selected Systems</span>
        </span>
        <span className="hero-line">
          <span>&amp; Web Builds.</span>
        </span>
      </h1>

      <div className="hero-sub mt-10 flex flex-col gap-6 md:mt-14 md:flex-row md:items-end md:justify-between">
        <p className="max-w-[46ch] text-[17px] leading-relaxed text-soft md:text-lg">
          An archive of open-source tools, compilers, and web apps.
        </p>
        <dl className="flex gap-10 font-mono text-[12px] tracking-[0.04em]">
          <div className="flex gap-3">
            <dt className="text-muted">ENTRIES</dt>
            <dd className="tabular-nums text-ink">{String(total).padStart(2, '0')}</dd>
          </div>
          {lastPush && (
            <div className="flex gap-3">
              <dt className="text-muted">LAST PUSH</dt>
              <dd className="uppercase text-ink">{formatDate(lastPush)}</dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  )
}
