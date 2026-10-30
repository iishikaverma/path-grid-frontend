import SearchBox from './SearchBox'
import ThemeToggle from './ThemeToggle'
import { MenuIcon } from './icons'

export default function Navbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-surface/80 px-4 py-3 backdrop-blur">
      <button
        type="button"
        onClick={onMenu}
        aria-label="Open navigation menu"
        className="grid size-9 place-items-center rounded-lg border border-border text-muted hover:text-ink lg:hidden"
      >
        <MenuIcon />
      </button>

      {/* Brand shown on mobile where the sidebar is hidden. */}
      <span className="font-bold text-ink lg:hidden">PathGrid</span>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden sm:block">
          <SearchBox />
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
