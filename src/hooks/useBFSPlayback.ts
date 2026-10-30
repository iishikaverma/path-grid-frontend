import { useCallback, useEffect, useRef, useState } from 'react'
import { getBFSSteps } from '../services/api'
import { ApiError, type VisualizerResponse } from '../types/api'

export type Speed = 'slow' | 'normal' | 'fast'

const SPEED_MS: Record<Speed, number> = {
  slow: 1500,
  normal: 900,
  fast: 400,
}

/** Fetches BFS steps from the backend and drives step-through playback. */
export function useBFSPlayback() {
  const [response, setResponse] = useState<VisualizerResponse | null>(null)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<Speed>('normal')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const steps = response?.steps ?? []
  const lastIndex = Math.max(steps.length - 1, 0)
  const current = steps[index] ?? null

  const load = useCallback(async (from: string, to: string) => {
    if (!from || !to) {
      setError('Please choose both a start and a destination.')
      return
    }
    setLoading(true)
    setError(null)
    setPlaying(false)
    try {
      const res = await getBFSSteps(from, to)
      setResponse(res)
      setIndex(0)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.')
      setResponse(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const next = useCallback(() => setIndex((i) => Math.min(i + 1, lastIndex)), [lastIndex])
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), [])
  const goTo = useCallback(
    (i: number) => {
      setPlaying(false)
      setIndex(Math.max(0, Math.min(i, lastIndex)))
    },
    [lastIndex],
  )
  const reset = useCallback(() => {
    setIndex(0)
    setPlaying(false)
  }, [])
  const togglePlay = useCallback(() => {
    setPlaying((p) => (steps.length ? !p : false))
  }, [steps.length])

  // Auto-play loop.
  const playingRef = useRef(playing)
  playingRef.current = playing
  useEffect(() => {
    if (!playing || steps.length === 0) return
    if (index >= lastIndex) {
      setPlaying(false)
      return
    }
    const timer = setTimeout(() => setIndex((i) => Math.min(i + 1, lastIndex)), SPEED_MS[speed])
    return () => clearTimeout(timer)
  }, [playing, index, lastIndex, speed, steps.length])

  return {
    response,
    steps,
    current,
    index,
    lastIndex,
    playing,
    speed,
    loading,
    error,
    setSpeed,
    load,
    next,
    prev,
    goTo,
    reset,
    togglePlay,
  }
}
