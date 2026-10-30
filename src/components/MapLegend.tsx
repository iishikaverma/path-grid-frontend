import type { NodeState } from './CampusNode'

const ITEMS: Array<{ state: NodeState; label: string; fill: string }> = [
  { state: 'start', label: 'Start', fill: 'bg-node-start' },
  { state: 'dest', label: 'Destination', fill: 'bg-node-dest' },
  { state: 'current', label: 'Current', fill: 'bg-node-current' },
  { state: 'visited', label: 'Visited', fill: 'bg-node-visited' },
  { state: 'route', label: 'Final route', fill: 'bg-node-route' },
  { state: 'default', label: 'Unvisited', fill: 'bg-node' },
]

/** Only show the states relevant to the current view. */
export default function MapLegend({ states }: { states?: NodeState[] }) {
  const items = states ? ITEMS.filter((i) => states.includes(i.state)) : ITEMS
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
      {items.map(({ state, label, fill }) => (
        <li key={state} className="flex items-center gap-1.5">
          <span className={`inline-block size-3 rounded-full ${fill}`} aria-hidden />
          {label}
        </li>
      ))}
    </ul>
  )
}
