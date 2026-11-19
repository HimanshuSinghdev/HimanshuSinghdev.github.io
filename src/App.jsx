import { useEffect, useMemo, useState } from 'react'
import Lenis from 'lenis'
import Cursor from './components/Cursor.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Controls from './components/Controls.jsx'
import Ledger from './components/Ledger.jsx'
import Footer from './components/Footer.jsx'
import { useRepos } from './hooks/useRepos.js'
import { usePersisted } from './hooks/usePersisted.js'
import { buildLedger } from './lib/merge.js'
import { setLenis } from './lib/lenis.js'

const haystack = (i) =>
  [i.title, i.description, i.language, i.repoUrl, ...i.stack, ...i.highlights, ...i.features].join(' ').toLowerCase()

export default function App() {
  const { status, repos, source, at, syncing, refresh } = useRepos()
  const ledger = useMemo(() => buildLedger(repos), [repos])

  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [showExtras, setShowExtras] = usePersisted('hs-index:show-extras', true)
  const [openId, setOpenId] = useState(null)

  // Momentum scrolling. Skipped when the visitor asks for reduced motion.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true })
    setLenis(lenis)
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    })
    return () => {
      cancelAnimationFrame(raf)
      setLenis(null)
      lenis.destroy()
    }
  }, [])

  const q = query.trim().toLowerCase()
  const matches = (i) => (filter === 'all' || i.category === filter) && (!q || haystack(i).includes(q))

  const featured = ledger.featured.filter(matches)
  const extras = showExtras ? ledger.extras.filter(matches) : []

  const counts = useMemo(() => {
    const pool = showExtras ? [...ledger.featured, ...ledger.extras] : ledger.featured
    const c = { all: pool.length, systems: 0, web: 0, tools: 0 }
    pool.forEach((i) => (c[i.category] += 1))
    return c
  }, [ledger, showExtras])

  const empty = status === 'ready' && featured.length + extras.length === 0
  const live = source === 'live'

  return (
    <>
      <Cursor />
      <div className="relative z-10">
        <Header repoCount={ledger.repoCount} live={live} />
        <main>
          <Hero total={ledger.total} lastPush={ledger.lastPush} />
          <Controls filter={filter} onFilter={setFilter} query={query} onQuery={setQuery} counts={counts} />

          {status === 'loading' ? (
            <p className="mx-auto max-w-[1600px] px-6 py-16 font-mono text-[12px] tracking-[0.04em] text-muted md:px-10">
              SYNCING WITH GITHUB…
            </p>
          ) : (
            <Ledger
              featured={featured}
              extras={extras}
              hasExtras={ledger.extras.length > 0}
              showExtras={showExtras}
              onShowExtras={setShowExtras}
              openId={openId}
              onOpen={setOpenId}
              filterKey={filter}
              empty={empty}
              onClear={() => {
                setQuery('')
                setFilter('all')
              }}
            />
          )}
        </main>
        <Footer source={source} at={at} syncing={syncing} onRefresh={refresh} />
      </div>
    </>
  )
}
