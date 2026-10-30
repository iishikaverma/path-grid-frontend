import { useMemo, useState } from 'react'
import { MAP_VIEWBOX, positionFor, type Point } from '../data/mapLayout'
import { metaFor } from '../data/locationMeta'
import type { GraphData } from '../types/api'
import CampusNode, { type NodeState } from './CampusNode'

interface CampusMapProps {
  graph: GraphData
  nodeStates?: Record<string, NodeState>
  /** Consecutive nodes whose connecting edges are highlighted as the route. */
  routePath?: string[]
  onSetStart?: (name: string) => void
  onSetDestination?: (name: string) => void
  className?: string
}

const pairKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`)

export default function CampusMap({
  graph,
  nodeStates = {},
  routePath = [],
  onSetStart,
  onSetDestination,
  className = '',
}: CampusMapProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const positions = useMemo(() => {
    const map: Record<string, Point> = {}
    graph.locations.forEach((name, i) => {
      map[name] = positionFor(name, i, graph.locations.length)
    })
    return map
  }, [graph.locations])

  const edges = useMemo(() => {
    const seen = new Set<string>()
    const list: Array<{ a: string; b: string }> = []
    for (const [a, neighbours] of Object.entries(graph.neighbours)) {
      for (const b of neighbours) {
        const key = pairKey(a, b)
        if (!seen.has(key) && positions[a] && positions[b]) {
          seen.add(key)
          list.push({ a, b })
        }
      }
    }
    return list
  }, [graph.neighbours, positions])

  const routeEdges = useMemo(() => {
    const set = new Set<string>()
    for (let i = 0; i < routePath.length - 1; i++) {
      set.add(pairKey(routePath[i], routePath[i + 1]))
    }
    return set
  }, [routePath])

  const selPos = selected ? positions[selected] : null

  return (
    <div className={`relative w-full ${className}`}>
      <svg
        viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-auto w-full select-none"
        role="img"
        aria-label="Campus map graph"
      >
        {/* Edges */}
        {edges.map(({ a, b }) => {
          const isRoute = routeEdges.has(pairKey(a, b))
          return (
            <line
              key={pairKey(a, b)}
              x1={positions[a].x}
              y1={positions[a].y}
              x2={positions[b].x}
              y2={positions[b].y}
              className={isRoute ? 'stroke-node-route' : 'stroke-border'}
              strokeWidth={isRoute ? 5 : 2}
              strokeLinecap="round"
            />
          )
        })}

        {/* Nodes */}
        {graph.locations.map((name) => (
          <CampusNode
            key={name}
            name={name}
            point={positions[name]}
            state={nodeStates[name] ?? 'default'}
            selected={selected === name}
            onClick={setSelected}
          />
        ))}
      </svg>

      {/* Node popover (HTML overlay positioned over the selected node).
          Flip its anchor near the edges so it never clips out of the map. */}
      {selected && selPos && (() => {
        const fracX = selPos.x / MAP_VIEWBOX.width
        const fracY = selPos.y / MAP_VIEWBOX.height
        const tx = fracX <= 0.22 ? '0' : fracX >= 0.78 ? '-100%' : '-50%'
        const ty = fracY >= 0.55 ? 'calc(-100% - 14px)' : '14px'
        return (
        <div
          className="absolute z-10 w-56 rounded-xl border border-border bg-surface p-3 shadow-lg"
          style={{
            left: `${fracX * 100}%`,
            top: `${fracY * 100}%`,
            transform: `translate(${tx}, ${ty})`,
          }}
          role="dialog"
          aria-label={`${selected} details`}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-ink">{selected}</p>
              <p className="text-xs text-muted">{metaFor(selected).category}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close"
              className="text-muted hover:text-ink"
            >
              ✕
            </button>
          </div>

          <p className="mt-1 text-xs text-muted">
            Connected to:{' '}
            <span className="text-ink">
              {graph.neighbours[selected]?.join(', ') || '—'}
            </span>
          </p>

          {(onSetStart || onSetDestination) && (
            <div className="mt-3 flex gap-2">
              {onSetStart && (
                <button
                  type="button"
                  onClick={() => {
                    onSetStart(selected)
                    setSelected(null)
                  }}
                  className="flex-1 rounded-lg bg-node-start px-2 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
                >
                  Set as Start
                </button>
              )}
              {onSetDestination && (
                <button
                  type="button"
                  onClick={() => {
                    onSetDestination(selected)
                    setSelected(null)
                  }}
                  className="flex-1 rounded-lg bg-node-dest px-2 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
                >
                  Set as Destination
                </button>
              )}
            </div>
          )}
        </div>
        )
      })()}
    </div>
  )
}
