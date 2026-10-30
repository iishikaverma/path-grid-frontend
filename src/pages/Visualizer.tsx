import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import BFSStepList from '../components/BFSStepList'
import CampusMap from '../components/CampusMap'
import type { NodeState } from '../components/CampusNode'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import LocationSelector from '../components/LocationSelector'
import MapLegend from '../components/MapLegend'
import QueueVisualizer from '../components/QueueVisualizer'
import { useApp } from '../context/AppContext'
import { useBFSPlayback, type Speed } from '../hooks/useBFSPlayback'

const SPEEDS: Speed[] = ['slow', 'normal', 'fast']

export default function Visualizer() {
  const { graph, graphLoading, graphError, reloadGraph } = useApp()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [params] = useSearchParams()
  const autoRan = useRef(false)

  const pb = useBFSPlayback()

  useEffect(() => {
    if (!graph || autoRan.current) return
    const qf = params.get('from')
    const qt = params.get('to')
    if (qf && qt && graph.locations.includes(qf) && graph.locations.includes(qt)) {
      autoRan.current = true
      setFrom(qf)
      setTo(qt)
      pb.load(qf, qt)
    }
  }, [graph, params, pb])

  if (graphLoading) return <LoadingState label="Loading campus data…" />
  if (graphError) return <ErrorState message={graphError} onRetry={reloadGraph} />
  if (!graph) return null

  const step = pb.current
  const nodeStates: Record<string, NodeState> = {}
  if (step) {
    for (const n of step.visited) nodeStates[n] = 'visited'
    if (step.current) nodeStates[step.current] = 'current'
  }
  if (from) nodeStates[from] = 'start'
  if (to) nodeStates[to] = 'dest'

  const controlBtn =
    'rounded-lg border border-border px-3 py-2 text-sm font-medium text-ink transition hover:bg-surface-2 disabled:opacity-40'

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold text-ink">BFS Visualizer</h1>
      <p className="mt-1 text-muted">Watch BFS explore the campus graph step by step.</p>

      {/* Selectors */}
      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <LocationSelector
          id="viz-from"
          label="From"
          value={from}
          options={graph.locations}
          onChange={setFrom}
        />
        <LocationSelector
          id="viz-to"
          label="To"
          value={to}
          options={graph.locations}
          onChange={setTo}
        />
        <button
          type="button"
          onClick={() => pb.load(from, to)}
          disabled={pb.loading || !from || !to}
          className="h-[42px] rounded-xl bg-accent px-6 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {pb.loading ? 'Loading…' : 'Visualize'}
        </button>
      </div>

      {pb.error && (
        <div className="mt-4">
          <ErrorState message={pb.error} />
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_minmax(0,380px)]">
        {/* Map */}
        <div className="rounded-2xl border border-border bg-surface p-4">
          <div className="mb-3">
            <MapLegend states={['start', 'dest', 'current', 'visited', 'default']} />
          </div>
          <CampusMap graph={graph} nodeStates={nodeStates} />
        </div>

        {/* BFS info */}
        <div className="space-y-4">
          {step ? (
            <>
              {/* Playback controls */}
              <div className="rounded-2xl border border-border bg-surface p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" className={controlBtn} onClick={pb.prev} disabled={pb.index === 0}>
                    ‹ Prev
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                    onClick={pb.togglePlay}
                  >
                    {pb.playing ? 'Pause' : 'Auto Play'}
                  </button>
                  <button
                    type="button"
                    className={controlBtn}
                    onClick={pb.next}
                    disabled={pb.index >= pb.lastIndex}
                  >
                    Next ›
                  </button>
                  <button type="button" className={controlBtn} onClick={pb.reset}>
                    Reset
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Speed
                  </span>
                  {SPEEDS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => pb.setSpeed(s)}
                      aria-pressed={pb.speed === s}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition ${
                        pb.speed === s
                          ? 'bg-accent-soft text-accent'
                          : 'text-muted hover:bg-surface-2'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                  <span className="ml-auto text-xs text-muted">
                    Step {pb.index + 1} / {pb.steps.length}
                  </span>
                </div>
              </div>

              {/* Current node */}
              <div className="rounded-2xl border border-border bg-surface p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Current Node
                </p>
                <p className="mt-1 text-lg font-bold text-node-current">
                  {step.current ?? '—'}
                </p>
                <p className="mt-1 text-sm text-muted">{step.description}</p>
              </div>

              {/* Queue */}
              <div className="rounded-2xl border border-border bg-surface p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                  Queue
                </p>
                <QueueVisualizer queue={step.queue} />
              </div>

              {/* Visited */}
              <div className="rounded-2xl border border-border bg-surface p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                  Visited Nodes ({step.visited.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {step.visited.length === 0 ? (
                    <span className="text-sm text-muted">None yet</span>
                  ) : (
                    step.visited.map((n) => (
                      <span
                        key={n}
                        className="rounded-lg bg-node-visited/25 px-2.5 py-1 text-sm text-ink"
                      >
                        {n}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Step list */}
              <div className="rounded-2xl border border-border bg-surface p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                  BFS Steps
                </p>
                <BFSStepList steps={pb.steps} activeIndex={pb.index} onSelect={pb.goTo} />
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-sm text-muted">
              Choose a start and destination, then press{' '}
              <span className="font-semibold text-ink">Visualize</span> to watch BFS explore
              the graph.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
