import { Link } from 'react-router-dom'
import CampusMap from '../components/CampusMap'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
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

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <section>
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">
          Find Your Way Around Campus
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Explore campus locations and discover routes using BFS.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/find-route"
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Find a Route
          </Link>
          <Link
            to="/visualizer"
            className="rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-surface-2"
          >
            Watch BFS
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
