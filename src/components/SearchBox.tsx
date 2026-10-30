import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchIcon } from './icons'

/** Navbar search — routes to All Locations filtered by the query. */
export default function SearchBox() {
  const [value, setValue] = useState('')
  const navigate = useNavigate()

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const q = value.trim()
    navigate(q ? `/locations?q=${encodeURIComponent(q)}` : '/locations')
  }

  return (
    <form onSubmit={onSubmit} role="search" className="relative w-full max-w-xs">
      <SearchIcon
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        width={16}
        height={16}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search locations…"
        aria-label="Search campus locations"
        className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
      />
    </form>
  )
}
