# Himanshu Singh // Index

Personal project index for https://himanshusinghdev.github.io. Vite, React and Tailwind, deployed to GitHub Pages by GitHub Actions. No backend, no paid APIs.

```bash
npm install
npm run dev      # local dev server
npm run build    # snapshot repos, then build to dist/
```

## How repos stay in sync

The ledger is built from your public GitHub repos, so adding or deleting a repo needs no code change.

- **In the browser:** on each visit the page calls `api.github.com/users/HimanshuSinghdev/repos`. The result is cached in `localStorage` for 15 minutes, and after an API failure it backs off for 10 minutes, so the rate limit is never an issue.
- **At build time:** `scripts/fetch-repos.mjs` writes `public/repos.json`. It is used for first paint and as a fallback when the API is unreachable. The deploy workflow also runs every 6 hours, so the snapshot never goes stale.

Forks, archived repos and the two site repos are skipped.

## Curating

`src/data/projects.js` only enriches repos you want featured (title, description, tech pills, drawer copy). If a curated repo is deleted, renamed or made private, its entry disappears on its own. To hide any repo, add its name to `EXCLUDED_REPOS`. To pin something that is not on GitHub, add an entry with `repo: null`.

## One-time setup

In the repo go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**. After that, every push to `main` deploys.
