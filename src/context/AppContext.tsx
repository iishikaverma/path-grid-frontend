import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { getGraph } from '../services/api'
import { ApiError, type GraphData } from '../types/api'
import { useTheme, type Theme } from '../hooks/useTheme'

interface AppContextValue {
  theme: Theme
  toggleTheme: () => void
  graph: GraphData | null
  graphLoading: boolean
  graphError: string | null
  reloadGraph: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const { theme, toggle } = useTheme()

  const [graph, setGraph] = useState<GraphData | null>(null)
  const [graphLoading, setGraphLoading] = useState(true)
  const [graphError, setGraphError] = useState<string | null>(null)

  const load = useCallback(() => {
    setGraphLoading(true)
    setGraphError(null)
    getGraph()
      .then(setGraph)
      .catch((err: unknown) => {
        setGraphError(
          err instanceof ApiError ? err.message : 'Unable to load campus data.',
        )
      })
      .finally(() => setGraphLoading(false))
  }, [])

  useEffect(load, [load])

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme: toggle,
        graph,
        graphLoading,
        graphError,
        reloadGraph: load,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
