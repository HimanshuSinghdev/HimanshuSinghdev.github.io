// Build-time snapshot of the public repo list -> public/repos.json.
//
// Runs before every `vite build` (see the "build" script) and therefore on every
// deploy, including the scheduled one in .github/workflows/deploy.yml. The site
// uses this as a fast first paint and as a fallback when the browser cannot
// reach the GitHub API. It never fails the build: on any error the previous
// file is kept.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { normalizeRepo } from '../src/lib/normalize.js'

const USER = 'HimanshuSinghdev'
const OUT = new URL('../public/repos.json', import.meta.url)

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'himanshusinghdev-index-build',
}
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

async function fetchAll() {
  const repos = []
  for (let page = 1; page <= 5; page++) {
    const res = await fetch(`https://api.github.com/users/${USER}/repos?sort=updated&per_page=100&page=${page}`, {
      headers,
    })
    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`)
    const batch = await res.json()
    repos.push(...batch)
    if (batch.length < 100) break
  }
  return repos.map(normalizeRepo)
}

try {
  const repos = await fetchAll()
  await mkdir(new URL('../public/', import.meta.url), { recursive: true })
  await writeFile(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), repos }, null, 2) + '\n')
  console.log(`[sync] wrote ${repos.length} repos to public/repos.json`)
} catch (err) {
  let kept = 'no previous snapshot'
  try {
    const prev = JSON.parse(await readFile(OUT, 'utf8'))
    kept = `kept previous snapshot (${prev.repos?.length ?? 0} repos)`
  } catch {}
  console.warn(`[sync] could not refresh repos: ${err.message}; ${kept}`)
}
