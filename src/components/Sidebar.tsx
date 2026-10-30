import { NavLink } from 'react-router-dom'
import SearchBox from './SearchBox'
import { NAV_ITEMS } from './nav'

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Primary">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          onClick={onNavigate}
          className={({ isActive }) =>
            [
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
              isActive
                ? 'bg-accent-soft text-accent'
                : 'text-muted hover:bg-surface-2 hover:text-ink',
            ].join(' ')
          }
        >
          <Icon />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-2">
      <span className="grid size-9 place-items-center rounded-xl bg-accent text-white font-bold">
        P
      </span>
      <div className="leading-tight">
        <p className="font-bold text-ink">PathGrid</p>
        <p className="text-xs text-muted">Find Your Path</p>
      </div>
    </div>
  )
}

/** Desktop sidebar (hidden on small screens — the drawer handles mobile). */
export default function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:gap-6 lg:border-r lg:border-border lg:bg-surface lg:p-4">
      <Brand />
      <NavItems />
      <p className="mt-auto px-3 text-xs text-muted">
        Graph &middot; BFS &middot; Queue &middot; Priority Queue
      </p>
    </aside>
  )
}

/** Mobile slide-in drawer. */
export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className={`fixed inset-0 z-40 lg:hidden ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div
        className={`absolute left-0 top-0 flex h-full w-72 flex-col gap-6 bg-surface p-4 shadow-xl transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Brand />
        <div className="sm:hidden">
          <SearchBox onSubmitted={onClose} />
        </div>
        <NavItems onNavigate={onClose} />
      </div>
    </div>
  )
}
