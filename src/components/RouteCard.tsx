import type { RouteResponse } from '../types/api'
import { ArrowDownIcon, CheckIcon } from './icons'
import EmptyState from './EmptyState'

export default function RouteCard({ result }: { result: RouteResponse }) {
  if (result.path.length === 0) {
    return (
      <EmptyState
        title="No route found"
        description={`There is no path between ${result.from} and ${result.to}.`}
      />
    )
  }

  const lastIndex = result.path.length - 1

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center gap-2 text-node-start">
        <CheckIcon width={18} height={18} />
        <span className="font-semibold">Route Found</span>
      </div>

      <ol className="flex flex-col">
        {result.path.map((name, i) => {
          const role =
            i === 0 ? 'Start' : i === lastIndex ? 'Destination' : `Stop ${i}`
          const dot =
            i === 0 ? 'bg-node-start' : i === lastIndex ? 'bg-node-dest' : 'bg-node-route'
          return (
            <li key={name}>
              <div className="flex items-center gap-3">
                <span className={`size-3 shrink-0 rounded-full ${dot}`} aria-hidden />
                <span className="font-medium text-ink">{name}</span>
                <span className="ml-auto text-xs text-muted">{role}</span>
              </div>
              {i < lastIndex && (
                <div className="ml-[5px] py-0.5 text-muted">
                  <ArrowDownIcon width={14} height={14} />
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
