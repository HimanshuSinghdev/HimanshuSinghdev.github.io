import { useCallback, useEffect, useRef, useState } from 'react'
import { coolingDown, fetchLive, fetchSnapshot, isFresh, markFailure, readCache } from '../lib/github.js'

/**
 * Load order (fast first paint, always converges on live data):
 *   1. localStorage cache      (instant, if this browser has visited before)
 *   2. build-time repos.json   (fast static file, if there is no cache)
 *   3. GitHub API              (unless the cache is under 15 min old, or the API recently failed)
 *
 * source: 'live'     fetched from GitHub (or a cache under 15 min old)
 *         'cache'    older localStorage data, API unavailable
 *         'snapshot' build-time file, API unavailable
 *         'none'     nothing could be loaded
 */
export function useRepos() {
  const [state, setState] = useState(() => {
    const c = readCache()
    if (c) return { status: 'ready', repos: c.repos, source: isFresh(c) ? 'live' : 'cache', at: c.at }
    return { status: 'loading', repos: null, source: null, at: null }
  })
  const [syncing, setSyncing] = useState(false)
  const haveData = useRef(state.repos !== null)

  const load = useCallback(async ({ force = false, signal } = {}) => {
    const cached = readCache()
    if (!force && isFresh(cached)) return

    if (!haveData.current) {
      try {
        const snap = await fetchSnapshot(signal)
        if (snap) {
          haveData.current = true
          setState({ status: 'ready', repos: snap.repos, source: 'snapshot', at: snap.at })
        }
      } catch (e) {
        if (e.name === 'AbortError') return
      }
    }

    if (!force && coolingDown()) {
      if (!haveData.current) setState({ status: 'ready', repos: null, source: 'none', at: null })
      return
    }

    try {
      const repos = await fetchLive(signal)
      haveData.current = true
      setState({ status: 'ready', repos, source: 'live', at: Date.now() })
    } catch (e) {
      if (e.name === 'AbortError') return
      markFailure()
      if (!haveData.current) setState({ status: 'ready', repos: null, source: 'none', at: null })
    }
  }, [])

  useEffect(() => {
    const ac = new AbortController()
    load({ signal: ac.signal })
    return () => ac.abort()
  }, [load])

  const refresh = useCallback(async () => {
    setSyncing(true)
    await load({ force: true })
    setSyncing(false)
  }, [load])

  return { ...state, syncing, refresh }
}
