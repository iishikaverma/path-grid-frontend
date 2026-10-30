import { useApp } from '../context/AppContext'
import { MoonIcon, SunIcon } from './icons'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useApp()
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="grid size-9 place-items-center rounded-lg border border-border bg-surface text-muted transition hover:text-ink hover:bg-surface-2"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
