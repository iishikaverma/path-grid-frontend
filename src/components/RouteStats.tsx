import type { RouteResponse } from '../types/api'

/** Stats come straight from the backend — no invented distance/time. */
export default function RouteStats({ result }: { result: RouteResponse }) {
  const stats = [
    { value: result.pathLength, label: 'Steps' },
    { value: result.path.length, label: 'Locations' },
    { value: result.nodesVisited, label: 'Nodes Visited' },
    { value: result.algorithm, label: 'Algorithm' },
  ]

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-center"
          >
            <p className="text-xl font-bold text-ink">{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">
        BFS finds the route with the fewest edges in an unweighted graph — not the
        shortest physical walking distance.
      </p>
    </div>
  )
}
