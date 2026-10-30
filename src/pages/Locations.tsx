import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import { SearchIcon } from '../components/icons'
import { metaFor } from '../data/locationMeta'
import { useApp } from '../context/AppContext'

export default function Locations() {
  const { graph, graphLoading, graphError, reloadGraph } = useApp()
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')

  // Keep the field in sync when arriving via the navbar search.
  useEffect(() => {
    setQuery(params.get('q') ?? '')
  }, [params])

  if (graphLoading) return <LoadingState label="Loading locations…" />
  if (graphError) return <ErrorState message={graphError} onRetry={reloadGraph} />
  if (!graph) return null

  const q = query.trim().toLowerCase()
  const filtered = graph.locations.filter((name) => {
    if (!q) return true
    const meta = metaFor(name)
    return (
      name.toLowerCase().includes(q) || meta.category.toLowerCase().includes(q)
    )
  })

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold text-ink">All Locations</h1>
      <p className="mt-1 text-muted">Every campus location and its connections.</p>

      <div className="relative mt-4 max-w-sm">
        <SearchIcon
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          width={16}
          height={16}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter locations…"
          aria-label="Filter campus locations"
          className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No locations match" description={`Nothing found for “${query}”.`} />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((name) => {
            const meta = metaFor(name)
            const neighbours = graph.neighbours[name] ?? []
            return (
              <div key={name} className="flex flex-col rounded-2xl border border-border bg-surface p-4">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-lg"
                  >
                    {meta.glyph}
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{name}</p>
                    <p className="text-xs text-muted">{meta.category}</p>
                  </div>
                </div>

                <p className="mt-3 text-sm text-muted">{meta.description}</p>

                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Connected to
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {neighbours.length === 0 ? (
                      <span className="text-sm text-muted">—</span>
                    ) : (
                      neighbours.map((n) => (
                        <span
                          key={n}
                          className="rounded-lg bg-surface-2 px-2 py-0.5 text-xs text-ink"
                        >
                          {n}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <Link
                  to={`/find-route?to=${encodeURIComponent(name)}`}
                  className="mt-4 self-start text-sm font-medium text-accent hover:underline"
                >
                  Route here →
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
