import { useEffect, useState } from 'react'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import PriorityLocationList from '../components/PriorityLocationList'
import { getPrioritizedLocations } from '../services/api'
import { ApiError, type PriorityItem } from '../types/api'

export default function NearbyPlaces() {
  const [items, setItems] = useState<PriorityItem[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    setError(null)
    getPrioritizedLocations()
      .then(setItems)
      .catch((err: unknown) =>
        setError(err instanceof ApiError ? err.message : 'Unable to load prioritized locations.'),
      )
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-ink">Nearby Places</h1>
      <p className="mt-2 text-muted">
        Priority Queue is used to organize locations according to their assigned priority.
        Here, priority is each location's number of connections — not geographic distance.
      </p>

      <div className="mt-6">
        {loading && <LoadingState label="Loading prioritized locations…" />}
        {error && <ErrorState message={error} onRetry={load} />}
        {items && !loading && !error && <PriorityLocationList items={items} />}
      </div>
    </div>
  )
}
