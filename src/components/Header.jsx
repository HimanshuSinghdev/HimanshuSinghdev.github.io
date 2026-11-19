import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useClock } from '../hooks/useClock.js'
import { GITHUB_USER } from '../data/projects.js'

export default function Header({ repoCount, live }) {
  const ref = useRef(null)
  const time = useClock()

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('[data-intro]', { opacity: 0, y: -8, duration: 0.9, ease: 'expo.out', stagger: 0.06, delay: 0.1 })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <header ref={ref} className="border-b border-line">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-6 px-6 md:px-10">
        <a
          href="#top"
          data-intro
          className="font-mono text-[12px] font-medium tracking-[0.06em] text-ink"
          aria-label="Himanshu Singh, index"
        >
          HIMANSHU SINGH // INDEX
        </a>

        <div className="flex items-center gap-5 font-mono text-[12px] tracking-[0.04em] md:gap-7">
          <span data-intro className="flex items-center gap-2 text-muted" title={live ? 'Repos loaded from GitHub' : 'Showing saved data'}>
            <span className="relative flex h-1.5 w-1.5">
              {live && <span className="absolute inset-0 animate-live-pulse rounded-full bg-live" />}
              <span className={`relative h-1.5 w-1.5 rounded-full ${live ? 'bg-live' : 'bg-muted'}`} />
            </span>
            <span className={live ? 'text-ink' : ''}>{live ? 'LIVE' : 'SAVED'}</span>
          </span>

          <span data-intro className="hidden text-muted sm:inline">
            {String(repoCount).padStart(2, '0')} REPOS
          </span>

          <span data-intro className="hidden tabular-nums text-muted md:inline">
            {time} IST
          </span>

          <a
            data-intro
            data-cursor="OPEN PROFILE ↗"
            href={`https://github.com/${GITHUB_USER}`}
            target="_blank"
            rel="noreferrer"
            className="text-ink underline decoration-line underline-offset-[6px] transition-colors hover:decoration-ink"
          >
            GITHUB ↗
          </a>
        </div>
      </div>
    </header>
  )
}
