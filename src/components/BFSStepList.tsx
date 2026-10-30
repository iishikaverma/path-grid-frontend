import { useEffect, useRef } from 'react'
import type { BFSStep } from '../types/api'

interface BFSStepListProps {
  steps: BFSStep[]
  activeIndex: number
  onSelect: (index: number) => void
}

export default function BFSStepList({ steps, activeIndex, onSelect }: BFSStepListProps) {
  const listRef = useRef<HTMLOListElement>(null)
  const activeRef = useRef<HTMLButtonElement>(null)

  // Keep the active step in view by scrolling ONLY the list box — never the page
  // (scrollIntoView would also scroll the window, which jumps the whole page).
  useEffect(() => {
    const list = listRef.current
    const active = activeRef.current
    if (!list || !active) return
    const top = active.offsetTop
    const bottom = top + active.offsetHeight
    if (top < list.scrollTop) {
      list.scrollTop = top
    } else if (bottom > list.scrollTop + list.clientHeight) {
      list.scrollTop = bottom - list.clientHeight
    }
  }, [activeIndex])

  return (
    <ol ref={listRef} className="relative max-h-64 space-y-1 overflow-y-auto pr-1">
      {steps.map((step, i) => {
        const active = i === activeIndex
        return (
          <li key={step.step + '-' + i}>
            <button
              ref={active ? activeRef : undefined}
              type="button"
              onClick={() => onSelect(i)}
              aria-current={active}
              className={`flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                active
                  ? 'bg-accent-soft text-ink'
                  : 'text-muted hover:bg-surface-2 hover:text-ink'
              }`}
            >
              <span
                className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                  active ? 'bg-accent text-white' : 'bg-surface-2 text-muted'
                }`}
              >
                {i + 1}
              </span>
              <span>{step.description}</span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
