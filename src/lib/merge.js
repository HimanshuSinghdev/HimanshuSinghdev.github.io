import { CURATED, EXCLUDED_REPOS, GITHUB_USER } from '../data/projects.js'

export const CATEGORIES = [
  { id: 'all', label: 'ALL' },
  { id: 'systems', label: 'SYSTEMS & WASM' },
  { id: 'web', label: 'WEB APPS' },
  { id: 'tools', label: 'TOOLS' },
]

// Fallback accent per category, used for repos without a curated `color`.
export const CATEGORY_COLOR = {
  all: '#F4F4F5',
  systems: '#FF5A3C',
  web: '#3BB6FF',
  tools: '#FFC53D',
}

const SYSTEM_LANGS = new Set(['C', 'C++', 'Rust', 'Go', 'Zig', 'Assembly'])

function inferCategory(r) {
  const topics = (r.topics || []).join(' ').toLowerCase()
  const text = `${r.name} ${r.description || ''}`.toLowerCase()
  if (
    SYSTEM_LANGS.has(r.language) ||
    /wasm|webassembly|compiler|pyodide|emscripten|systems/.test(topics) ||
    /wasm|webassembly|compiler|interpreter|pyodide|emulator|kernel/.test(text)
  )
    return 'systems'
  if (
    /\b(cli|tool|utility|api|bot|extension|workers)\b/.test(topics) ||
    /\b(cli|tool|utility|api|script|shortener|generator|converter|calculator)\b/.test(text)
  )
    return 'tools'
  return 'web'
}

function prettify(name) {
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

const fmtDate = (iso) =>
  iso
    ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso))
    : null

function curatedItem(c, repo) {
  const category = c.category || (repo ? inferCategory(repo) : 'web')
  return {
    id: c.repo || c.title,
    curated: true,
    title: c.title,
    description: c.description || repo?.description || '',
    category,
    color: c.color || CATEGORY_COLOR[category],
    stack: c.stack || [],
    highlights: c.highlights || [],
    features: c.features || [],
    language: repo?.language || null,
    stars: repo?.stars ?? 0,
    pushedAt: repo?.pushedAt || null,
    repoUrl: repo?.url || (c.repo ? `https://github.com/${GITHUB_USER}/${c.repo}` : null),
    liveUrl: c.live !== undefined ? c.live : repo?.homepage || null,
  }
}

function autoItem(r) {
  const pushed = fmtDate(r.pushedAt)
  const category = inferCategory(r)
  return {
    color: CATEGORY_COLOR[category],
    id: r.name,
    curated: false,
    title: prettify(r.name),
    description:
      r.description ||
      `${r.language ? `${r.language} project` : 'Repository'}${pushed ? `, last pushed ${pushed}.` : '.'}`,
    category,
    stack: [r.language, ...r.topics].filter(Boolean).slice(0, 4),
    highlights: [],
    features: [],
    language: r.language,
    stars: r.stars,
    pushedAt: r.pushedAt,
    repoUrl: r.url,
    liveUrl: r.homepage || null,
  }
}

/**
 * Merge live GitHub repos with the curated layer.
 * `repos === null` means no repo data could be loaded at all (offline, first
 * visit): curated entries are shown as-is so the page is never empty.
 */
export function buildLedger(repos) {
  const known = Array.isArray(repos)
  const excluded = new Set(EXCLUDED_REPOS.map((s) => s.toLowerCase()))
  const eligible = known
    ? repos.filter((r) => !r.fork && !r.archived && !excluded.has(r.name.toLowerCase()))
    : []
  const byName = new Map(eligible.map((r) => [r.name.toLowerCase(), r]))
  const used = new Set()

  const featured = []
  for (const c of CURATED) {
    const key = c.repo ? c.repo.toLowerCase() : null
    const repo = key ? byName.get(key) : null
    if (key && known && !repo) continue // repo was deleted, renamed or made private
    if (key) used.add(key)
    featured.push(curatedItem(c, repo))
  }

  const extras = eligible
    .filter((r) => !used.has(r.name.toLowerCase()))
    .sort((a, b) => new Date(b.pushedAt || 0) - new Date(a.pushedAt || 0))
    .map(autoItem)

  let n = 0
  for (const item of [...featured, ...extras]) item.index = String(++n).padStart(2, '0')

  const latest = [...featured, ...extras]
    .map((i) => i.pushedAt)
    .filter(Boolean)
    .sort()
    .pop()

  return { featured, extras, total: n, repoCount: eligible.length, lastPush: latest || null, known }
}

export const formatDate = fmtDate
