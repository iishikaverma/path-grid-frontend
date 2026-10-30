import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { CheckIcon, ChevronDownIcon } from './icons'

interface SelectProps {
  id?: string
  value: string
  options: string[]
  onChange: (value: string) => void
  placeholder?: string
  labelId?: string
}

/**
 * Accessible themed listbox replacing the native <select> so the open list
 * matches the app's light/dark design (native option lists are OS-rendered).
 */
export default function Select({
  id,
  value,
  options,
  onChange,
  placeholder = 'Select a location…',
  labelId,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const baseId = useId()
  const listId = `${baseId}-list`

  const select = (v: string) => {
    onChange(v)
    setOpen(false)
  }

  const openList = () => {
    setActive(Math.max(0, options.indexOf(value)))
    setOpen(true)
  }

  // Close on outside click.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  // Keep the active option scrolled into view within the list.
  useEffect(() => {
    if (!open) return
    const el = listRef.current?.children[active] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  const onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!open) openList()
        else setActive((a) => Math.min(a + 1, options.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        if (!open) openList()
        else setActive((a) => Math.max(a - 1, 0))
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (!open) openList()
        else if (options[active]) select(options[active])
        break
      case 'Escape':
        setOpen(false)
        break
      case 'Home':
        if (open) {
          e.preventDefault()
          setActive(0)
        }
        break
      case 'End':
        if (open) {
          e.preventDefault()
          setActive(options.length - 1)
        }
        break
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={labelId ? `${labelId} ${id ?? baseId}` : undefined}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 text-left text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
      >
        <span className={value ? 'text-ink' : 'text-muted'}>{value || placeholder}</span>
        <ChevronDownIcon
          width={16}
          height={16}
          className={`shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          className="thin-scroll absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-border bg-surface p-1 shadow-lg"
        >
          {options.map((opt, i) => {
            const selected = opt === value
            return (
              <li
                key={opt}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActive(i)}
                onClick={() => select(opt)}
                className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm ${
                  i === active ? 'bg-accent-soft text-accent' : 'text-ink'
                }`}
              >
                <span>{opt}</span>
                {selected && <CheckIcon width={15} height={15} className="text-accent" />}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
