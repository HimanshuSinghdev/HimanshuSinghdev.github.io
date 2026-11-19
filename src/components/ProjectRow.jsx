import { useEffect, useRef, useState } from 'react'
import { formatDate } from '../lib/merge.js'

const GithubIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
  </svg>
)

const ArrowIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
  </svg>
)

function IconLink({ href, label, cursor, live, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      data-cursor={cursor}
      className="icon-link pointer-events-auto relative flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-bg"
    >
      {children}
      {live && (
        <span className="absolute -right-0.5 -top-0.5 flex h-1.5 w-1.5" aria-hidden="true">
          <span className="absolute inset-0 animate-live-pulse rounded-full bg-live" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-live" />
        </span>
      )}
    </a>
  )
}

export default function ProjectRow({ item, open, onToggle, order }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)

  // Draw the row's top rule + reveal its content the first time it scrolls into view.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.01 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const drawerId = `drawer-${item.id}`
  const delay = order < 7 ? order * 70 : 0
  const pushed = formatDate(item.pushedAt)

  return (
    <article
      ref={ref}
      className={`row ${seen ? 'is-in' : ''} ${open ? 'is-open' : ''}`}
      style={{ '--d': `${delay}ms` }}
    >
      <span className="row-line" aria-hidden="true" />

      <div className="row-main relative">
        {/* The whole row is one big button; real links sit above it. */}
        <button
          type="button"
          className="row-hit absolute inset-0 z-0 h-full w-full"
          aria-expanded={open}
          aria-controls={drawerId}
          aria-label={`${item.title}: ${open ? 'hide' : 'show'} details`}
          data-cursor={open ? 'CLOSE −' : 'DETAILS +'}
          onClick={onToggle}
        />

        <div className="row-content pointer-events-none relative z-10 mx-auto grid max-w-[1600px] gap-x-6 gap-y-4 px-6 py-7 md:px-10 lg:grid-cols-[72px_minmax(0,1.5fr)_minmax(0,1fr)_132px] lg:items-center lg:py-9">
          <span className="font-mono text-[12px] tabular-nums tracking-[0.04em] text-muted">{item.index}</span>

          <div className="min-w-0">
            <h2 className="row-title font-heading text-[clamp(1.75rem,3.2vw,3.25rem)] font-medium leading-[1.04] tracking-[-0.03em]">
              {item.title}
            </h2>
            <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-soft">{item.description}</p>
          </div>

          <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
            {item.stack.map((s) => (
              <li
                key={s}
                className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] text-soft"
              >
                {s}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 lg:justify-end">
            {item.repoUrl && (
              <IconLink href={item.repoUrl} label={`${item.title} on GitHub`} cursor="SOURCE ↗">
                <GithubIcon />
              </IconLink>
            )}
            {item.liveUrl && (
              <IconLink href={item.liveUrl} label={`Open live demo of ${item.title}`} cursor="VIEW BUILD ↗" live>
                <ArrowIcon />
              </IconLink>
            )}
            <span className="row-plus ml-1 hidden h-9 w-9 items-center justify-center lg:flex" aria-hidden="true">
              <span className="relative block h-3 w-3">
                <span className="absolute left-0 top-1/2 block h-px w-full -translate-y-1/2 bg-muted" />
                <span className="plus-v absolute left-1/2 top-0 block h-full w-px -translate-x-1/2 bg-muted" />
              </span>
            </span>
          </div>
        </div>
      </div>

      <div id={drawerId} className="drawer" aria-hidden={!open} inert={open ? undefined : ''}>
        <div className="drawer-inner">
          <div className="mx-auto grid max-w-[1600px] gap-x-6 gap-y-8 px-6 pb-10 pt-1 md:px-10 lg:grid-cols-[72px_minmax(0,1.5fr)_minmax(0,1fr)_132px]">
            <div className="hidden lg:block" />

            <div className="min-w-0">
              <h3 className="font-mono text-[11px] tracking-[0.06em] text-muted">ARCHITECTURE</h3>
              {item.highlights.length > 0 ? (
                <ul className="mt-3 border-t border-line">
                  {item.highlights.map((h) => (
                    <li key={h} className="border-b border-line py-3 text-[15px] leading-relaxed text-ink">
                      {h}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 max-w-[56ch] border-t border-line pt-3 text-[15px] leading-relaxed text-soft">
                  {item.description} Synced automatically from GitHub.
                </p>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="font-mono text-[11px] tracking-[0.06em] text-muted">KEY FEATURES</h3>
              {item.features.length > 0 ? (
                <ul className="mt-3 border-t border-line">
                  {item.features.map((f) => (
                    <li key={f} className="border-b border-line py-3 text-[15px] leading-relaxed text-ink">
                      {f}
                    </li>
                  ))}
                </ul>
              ) : (
                <dl className="mt-3 border-t border-line font-mono text-[12px] tracking-[0.02em]">
                  {item.language && (
                    <div className="flex justify-between border-b border-line py-3">
                      <dt className="text-muted">LANGUAGE</dt>
                      <dd className="text-ink">{item.language}</dd>
                    </div>
                  )}
                  {pushed && (
                    <div className="flex justify-between border-b border-line py-3">
                      <dt className="text-muted">LAST PUSH</dt>
                      <dd className="uppercase text-ink">{pushed}</dd>
                    </div>
                  )}
                </dl>
              )}
            </div>

            <div className="flex flex-col gap-3 font-mono text-[12px] tracking-[0.04em] lg:items-end lg:pt-6">
              {item.liveUrl && (
                <a
                  href={item.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="VIEW BUILD ↗"
                  className="text-ink underline decoration-line underline-offset-[6px] transition-colors hover:decoration-ink"
                >
                  VIEW BUILD ↗
                </a>
              )}
              {item.repoUrl && (
                <a
                  href={item.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="SOURCE ↗"
                  className="text-ink underline decoration-line underline-offset-[6px] transition-colors hover:decoration-ink"
                >
                  SOURCE ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
