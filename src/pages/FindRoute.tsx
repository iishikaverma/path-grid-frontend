import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CampusMap from '../components/CampusMap'
import type { NodeState } from '../components/CampusNode'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import LocationSelector from '../components/LocationSelector'
import MapLegend from '../components/MapLegend'
import RouteCard from '../components/RouteCard'
import RouteStats from '../components/RouteStats'
import { SwapIcon } from '../components/icons'
import { useApp } from '../context/AppContext'
import { useRouteReveal } from '../hooks/useRouteReveal'
import { useRouteSearch } from '../hooks/useRouteSearch'

export default function FindRoute() {
  const { graph, graphLoading, graphError, reloadGraph } = useApp()
  const { from, to, setFrom, setTo, result, loading, error, reset, swap, run } =
    useRouteSearch()
  const [params] = useSearchParams()
  const autoRan = useRef(false)

  // Prefill + auto-run once if arriving with ?from=&to= (e.g. from Home).
  useEffect(() => {
    if (!graph || autoRan.current) return
    const qf = params.get('from')
    const qt = params.get('to')
    if (qf && qt && graph.locations.includes(qf) && graph.locations.includes(qt)) {
      autoRan.current = true
      setFrom(qf)
      setTo(qt)
      run(qf, qt)
    }
  }, [graph, params, run, setFrom, setTo])

  const revealed = useRouteReveal(result?.path ?? [])

  const nodeStates: Record<string, NodeState> = {}
  if (from) nodeStates[from] = 'start'
  if (to) nodeStates[to] = 'dest'
  if (result) {
    for (const n of revealed) {
      if (n !== result.from && n !== result.to) nodeStates[n] = 'route'
    }
  }

  if (graphLoading) return <LoadingState label="Loading campus data…" />
  if (graphError) return <ErrorState message={graphError} onRetry={reloadGraph} />
  if (!graph) return null

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold text-ink">Find Route</h1>
      <p className="mt-1 text-muted">Select a start and destination to run BFS.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
        {/* Controls + result */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="space-y-3">
              <LocationSelector
                id="from"
                label="From"
                value={from}
                options={graph.locations}
                onChange={setFrom}
              />
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={swap}
                  aria-label="Swap start and destination"
                  className="grid size-9 place-items-center rounded-lg border border-border text-muted transition hover:text-ink hover:bg-surface-2"
                >
                  <SwapIcon className="rotate-90" />
                </button>
              </div>
              <LocationSelector
                id="to"
                label="To"
                value={to}
                options={graph.locations}
                onChange={setTo}
              />
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => run()}
                disabled={loading}
                className="flex-1 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {loading ? 'Finding Route…' : 'Find Route'}
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted transition hover:text-ink hover:bg-surface-2"
              >
                Reset
              </button>
            </div>
          </div>

          {error && <ErrorState message={error} />}

          {result && !error && (
            <div className="space-y-4">
              <RouteStats result={result} />
              <RouteCard result={result} />
              {result.path.length > 0 && (
                <Link
                  to={`/visualizer?from=${encodeURIComponent(result.from)}&to=${encodeURIComponent(result.to)}`}
                  className="block rounded-xl border border-accent/40 bg-accent-soft px-4 py-2.5 text-center text-sm font-semibold text-accent transition hover:opacity-90"
                >
                  Show in Visualizer →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Map */}
        <div className="rounded-2xl border border-border bg-surface p-4">
          <div className="mb-3">
            <MapLegend states={['start', 'dest', 'route', 'default']} />
          </div>
          <CampusMap
            graph={graph}
            nodeStates={nodeStates}
            routePath={revealed}
            onSetStart={setFrom}
            onSetDestination={setTo}
          />
        </div>
      </div>
    </div>
  )
}
