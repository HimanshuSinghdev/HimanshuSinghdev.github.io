// Shared by the browser (live fetch) and scripts/fetch-repos.mjs (build snapshot),
// so both produce exactly the same repo shape.
export function normalizeRepo(r) {
  let homepage = r.homepage ? String(r.homepage).trim() : ''
  if (homepage && !/^https?:\/\//i.test(homepage)) homepage = `https://${homepage}`

  return {
    name: r.name,
    description: r.description || null,
    homepage: homepage || null,
    language: r.language || null,
    topics: Array.isArray(r.topics) ? r.topics : [],
    stars: r.stargazers_count ?? 0,
    pushedAt: r.pushed_at || null,
    url: r.html_url,
    fork: Boolean(r.fork),
    archived: Boolean(r.archived),
  }
}
