import ProjectRow from './ProjectRow.jsx'

function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      data-cursor={checked ? 'HIDE' : 'SHOW'}
      className="flex items-center gap-3 font-mono text-[12px] tracking-[0.04em] text-ink"
    >
      <span>{label}</span>
      <span
        className={`relative h-[18px] w-[34px] rounded-full border transition-colors duration-300 ${
          checked ? 'border-ink bg-ink' : 'border-line bg-transparent'
        }`}
      >
        <span
          className={`absolute top-1/2 h-[10px] w-[10px] -translate-y-1/2 rounded-full transition-all duration-300 ${
            checked ? 'left-[19px] bg-bg' : 'left-[3px] bg-muted'
          }`}
        />
      </span>
    </button>
  )
}

export default function Ledger({
  featured,
  extras,
  hasExtras,
  showExtras,
  onShowExtras,
  openId,
  onOpen,
  filterKey,
  empty,
  onClear,
}) {
  let order = 0

  return (
    <section aria-label="Projects" className="relative border-b border-line">
      {featured.map((item) => (
        <ProjectRow
          key={`${filterKey}:${item.id}`}
          item={item}
          order={order++}
          open={openId === item.id}
          onToggle={() => onOpen(openId === item.id ? null : item.id)}
        />
      ))}

      {hasExtras && (
        <div className="border-t border-line">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10">
            <p className="font-mono text-[12px] tracking-[0.04em] text-muted">
              ALSO ON GITHUB <span className="ml-2 tabular-nums text-ink">{String(extras.length).padStart(2, '0')}</span>
              <span className="ml-3 hidden text-muted md:inline">Added and removed repos update here automatically.</span>
            </p>
            <Switch checked={showExtras} onChange={onShowExtras} label="SHOW ALL REPOS" />
          </div>
        </div>
      )}

      {showExtras &&
        extras.map((item) => (
          <ProjectRow
            key={`${filterKey}:${item.id}`}
            item={item}
            order={order++}
            open={openId === item.id}
            onToggle={() => onOpen(openId === item.id ? null : item.id)}
          />
        ))}

      {empty && (
        <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-10">
          <p className="text-lg text-soft">Nothing matches that search.</p>
          <button
            type="button"
            onClick={onClear}
            className="mt-4 font-mono text-[12px] tracking-[0.04em] text-ink underline decoration-line underline-offset-[6px] hover:decoration-ink"
          >
            CLEAR SEARCH AND FILTER
          </button>
        </div>
      )}
    </section>
  )
}
