import { Link } from 'react-router-dom'
import type { PriorityItem } from '../types/api'
import { metaFor } from '../data/locationMeta'

export default function PriorityLocationList({ items }: { items: PriorityItem[] }) {
  const maxPriority = Math.max(1, ...items.map((i) => i.priority))

  return (
    <ol className="space-y-3">
      {items.map((item, i) => (
        <li
          key={item.name}
          className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-sm font-bold text-accent">
            {i + 1}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span aria-hidden>{metaFor(item.name).glyph}</span>
              <p className="truncate font-semibold text-ink">{item.name}</p>
            </div>
            {/* Priority bar for a quick visual comparison. */}
            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-1.5 w-full max-w-[160px] overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${(item.priority / maxPriority) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted">Priority {item.priority}</span>
            </div>
          </div>

          <Link
            to={`/find-route?to=${encodeURIComponent(item.name)}`}
            className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-surface-2"
          >
            Navigate
          </Link>
        </li>
      ))}
    </ol>
  )
}
