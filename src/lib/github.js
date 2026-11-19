import { GITHUB_USER } from '../data/projects.js'
import { normalizeRepo } from './normalize.js'

const CACHE_KEY = 'hs-index:repos:v1'
const FAIL_KEY = 'hs-index:fail:v1'
const TTL = 15 * 60 * 1000 // serve cached data without hitting the API for 15 min
const COOLDOWN = 10 * 60 * 1000 // after an API failure (e.g. rate limit), wait before retrying

const safe = (fn) => {
  try {
    return fn()
  } catch {
    return null
  }
}

export function readCache() {
  return safe(() => {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const c = JSON.parse(raw)
    return c && Array.isArray(c.repos) ? c : null
  })
}

const writeCache = (repos) => safe(() => localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), repos })))
const markFailure = () => safe(() => localStorage.setItem(FAIL_KEY, String(Date.now())))
const clearFailure = () => safe(() => localStorage.removeItem(FAIL_KEY))

export const isFresh = (cache) => Boolean(cache) && Date.now() - cache.at < TTL

export function coolingDown() {
  const t = safe(() => Number(localStorage.getItem(FAIL_KEY)))
  return Boolean(t) && Date.now() - t < COOLDOWN
}

/** Live list from the GitHub REST API (public repos only, no token). */
export async function fetchLive(signal) {
  const out = []
  for (let page = 1; page <= 3; page++) {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100&page=${page}`,
      { signal, headers: { Accept: 'application/vnd.github+json' } },
    )
    if (!res.ok) throw new Error(`GitHub API ${res.status}`)
    const batch = await res.json()
    out.push(...batch)
    if (batch.length < 100) break
  }
  const repos = out.map(normalizeRepo)
  writeCache(repos)
  clearFailure()
  return repos
}

/** Static copy written at build time by scripts/fetch-repos.mjs (rebuilt every 6 hours). */
export async function fetchSnapshot(signal) {
  const res = await fetch(`${import.meta.env.BASE_URL}repos.json`, { signal, cache: 'no-cache' })
  if (!res.ok) throw new Error(`snapshot ${res.status}`)
  const data = await res.json()
  if (!data.generatedAt || !Array.isArray(data.repos) || data.repos.length === 0) return null
  return { repos: data.repos, at: Date.parse(data.generatedAt) }
}

export { markFailure }
