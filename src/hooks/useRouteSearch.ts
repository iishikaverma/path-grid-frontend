import { useCallback, useState } from 'react'
import { findRoute } from '../services/api'
import { ApiError, type RouteResponse } from '../types/api'

/** Owns the Find Route form state + the live BFS call. */
export function useRouteSearch(initialFrom = '', initialTo = '') {
  const [from, setFrom] = useState(initialFrom)
  const [to, setTo] = useState(initialTo)
  const [result, setResult] = useState<RouteResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Changing the selection invalidates the previous result, so clear it to
  // avoid showing a stale route card / highlight that contradicts the new
  // start/destination.
  const changeFrom = useCallback((v: string) => {
    setFrom(v)
    setResult(null)
    setError(null)
  }, [])
  const changeTo = useCallback((v: string) => {
    setTo(v)
    setResult(null)
    setError(null)
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
    setFrom('')
    setTo('')
  }, [])

  const swap = useCallback(() => {
    setFrom(to)
    setTo(from)
    setResult(null)
    setError(null)
  }, [from, to])

  const run = useCallback(
    async (f = from, t = to) => {
      if (!f || !t) {
        setError('Please choose both a start and a destination.')
        return
      }
      setLoading(true)
      setError(null)
      try {
        const res = await findRoute(f, t)
        setResult(res) // empty path is a valid "no route" result, handled by RouteCard
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Something went wrong.')
        setResult(null)
      } finally {
        setLoading(false)
      }
    },
    [from, to],
  )

  return {
    from,
    to,
    setFrom: changeFrom,
    setTo: changeTo,
    result,
    loading,
    error,
    reset,
    swap,
    run,
  }
}
