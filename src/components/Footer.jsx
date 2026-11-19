import { scrollToTop } from '../lib/lenis.js'

const SOURCE_TEXT = {
  live: 'Synced from GitHub',
  cache: 'Saved copy, GitHub unreachable',
  snapshot: 'Build snapshot, GitHub unreachable',
  none: 'Showing curated entries only',
}

function ago(ms) {
  if (!ms) return ''
  const s = Math.max(0, Math.round((Date.now() - ms) / 1000))
  if (s < 90) return 'just now'
  const m = Math.round(s / 60)
  if (m < 90) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 36) return `${h} h ago`
  return `${Math.round(h / 24)} d ago`
}

export default function Footer({ source, at, syncing, onRefresh }) {
  return (
    <footer className="mx-auto flex max-w-[1600px] flex-col gap-4 px-6 py-10 font-mono text-[12px] tracking-[0.04em] text-muted md:flex-row md:items-center md:justify-between md:px-10">
      <p>
        {SOURCE_TEXT[source] || SOURCE_TEXT.none}
        {at ? <span className="ml-2 text-muted">{ago(at)}</span> : null}
        <button
          type="button"
          onClick={onRefresh}
          disabled={syncing}
          className="ml-4 text-ink underline decoration-line underline-offset-[6px] hover:decoration-ink disabled:opacity-50"
        >
          {syncing ? 'SYNCING' : 'SYNC NOW'}
        </button>
      </p>
      <div className="flex items-center gap-6">
        <span>© {new Date().getFullYear()} Himanshu Singh</span>
        <button
          type="button"
          onClick={scrollToTop}
          className="text-ink underline decoration-line underline-offset-[6px] hover:decoration-ink"
        >
          BACK TO TOP ↑
        </button>
      </div>
    </footer>
  )
}
