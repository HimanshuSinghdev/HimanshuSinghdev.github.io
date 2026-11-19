import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { CATEGORIES, CATEGORY_COLOR } from '../lib/merge.js'

export default function Controls({ filter, onFilter, query, onQuery, counts }) {
  const root = useRef(null)
  const input = useRef(null)

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('[data-tab]', { opacity: 0, y: 10, duration: 0.9, ease: 'expo.out', stagger: 0.07, delay: 0.75 })
    }, root)
    return () => ctx.revert()
  }, [])

  // "/" focuses search from anywhere (unless already typing somewhere).
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return
      const el = document.activeElement
      const typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
      if (typing) return
      e.preventDefault()
      input.current?.focus()
      input.current?.select()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div ref={root} className="sticky top-0 z-30 border-y border-line bg-bg/90">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-10">
        <div role="tablist" aria-label="Filter by category" className="-mx-1 flex flex-wrap gap-x-6 gap-y-2">
          {CATEGORIES.map((c) => {
            const active = filter === c.id
            return (
              <button
                key={c.id}
                data-tab
                role="tab"
                aria-selected={active}
                onClick={() => onFilter(c.id)}
                style={{ '--c': CATEGORY_COLOR[c.id] }}
                className={`tab font-mono text-[12px] tracking-[0.04em] ${active ? 'is-active text-ink' : 'text-muted hover:text-ink'}`}
              >
                <i className={`tab-dot ${c.id === 'all' ? 'all' : ''}`} aria-hidden="true" />
                {c.label}
                <span className="ml-2 tabular-nums text-muted">{String(counts[c.id] ?? 0).padStart(2, '0')}</span>
              </button>
            )
          })}
        </div>

        <label className="relative flex items-center md:w-[280px]">
          <span className="sr-only">Search builds</span>
          <input
            ref={input}
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                onQuery('')
                e.currentTarget.blur()
              }
            }}
            placeholder="Search builds"
            autoComplete="off"
            spellCheck="false"
            className="search w-full border-b border-line bg-transparent py-2 pr-10 font-mono text-[13px] text-ink placeholder:text-muted focus:border-ink focus:outline-none"
          />
          <kbd className="kbd pointer-events-none absolute right-0 rounded-[3px] border border-line px-1.5 py-0.5 font-mono text-[11px] text-muted">
            /
          </kbd>
        </label>
      </div>
    </div>
  )
}
