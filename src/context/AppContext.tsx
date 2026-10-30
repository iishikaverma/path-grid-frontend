import { createContext, useContext, type ReactNode } from 'react'
import { useTheme, type Theme } from '../hooks/useTheme'

interface AppContextValue {
  theme: Theme
  toggleTheme: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const { theme, toggle } = useTheme()
  return (
    <AppContext.Provider value={{ theme, toggleTheme: toggle }}>
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
