import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CampusMap from '../components/CampusMap'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import LocationSelector from '../components/LocationSelector'
import MapLegend from '../components/MapLegend'
import { useApp } from '../context/AppContext'

const DSA_CARDS = [
  { title: 'Graph', body: 'Campus locations are vertices; walkable connections are edges.' },
  { title: 'BFS', body: 'Explores the graph level by level to find a route.' },
  { title: 'Queue', body: 'BFS uses a FIFO queue to decide what to explore next.' },
  { title: 'Priority Queue', body: 'Ranks locations by assigned priority (see Nearby Places).' },
]

export default function Home() {
  const { graph, graphLoading, graphError, reloadGraph } = useApp()
  const navigate = useNavigate()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  function findRoute() {
    if (from && to) {
      navigate(`/find-route?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <section>
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">
          Find Your Way Around Campus
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Explore campus locations and discover routes using BFS.
        </p>
      </section>

      {/* Quick route finder */}
      <section className="rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-ink">Route Finder</h2>
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <LocationSelector
            id="home-from"
            label="From"
            value={from}
            options={graph?.locations ?? []}
            onChange={setFrom}
          />
          <LocationSelector
            id="home-to"
            label="To"
            value={to}
            options={graph?.locations ?? []}
            onChange={setTo}
          />
          <button
            type="button"
            onClick={findRoute}
            disabled={!from || !to}
            className="h-[42px] rounded-xl bg-accent px-6 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            Find Route
          </button>
        </div>
        <div className="mt-3">
          <Link to="/visualizer" className="text-sm font-medium text-accent hover:underline">
            or watch BFS explore the graph →
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">Campus Map</h2>
          <MapLegend states={['default']} />
        </div>
        {graphLoading && <LoadingState label="Loading campus map…" />}
        {graphError && <ErrorState message={graphError} onRetry={reloadGraph} />}
        {graph && !graphLoading && !graphError && <CampusMap graph={graph} />}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-ink">Powered by DSA</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DSA_CARDS.map((c) => (
            <div key={c.title} className="rounded-2xl border border-border bg-surface p-4">
              <p className="font-semibold text-accent">{c.title}</p>
              <p className="mt-1 text-sm text-muted">{c.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
