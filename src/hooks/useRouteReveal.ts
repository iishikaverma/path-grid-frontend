import { useEffect, useState } from 'react'

const STEP_MS = 350

/**
 * Progressively reveals a route path for a short staged highlight animation.
 * Returns the revealed prefix of the path. Respects prefers-reduced-motion
 * by revealing everything immediately.
 */
export function useRouteReveal(path: string[]): string[] {
  const [count, setCount] = useState(path.length)

  useEffect(() => {
    if (path.length === 0) {
      setCount(0)
      return
    }

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setCount(path.length)
      return
    }

    setCount(1)
    const timer = setInterval(() => {
      setCount((c) => {
        if (c >= path.length) {
          clearInterval(timer)
          return c
        }
        return c + 1
      })
    }, STEP_MS)

    return () => clearInterval(timer)
    // Re-run whenever the path identity changes.
  }, [path])

  return path.slice(0, count)
}
