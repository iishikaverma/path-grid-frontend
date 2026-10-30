import type { Point } from '../data/mapLayout'

export type NodeState = 'default' | 'start' | 'dest' | 'current' | 'visited' | 'route'

const NODE_RADIUS = 26

const FILL: Record<NodeState, string> = {
  default: 'fill-node',
  start: 'fill-node-start',
  dest: 'fill-node-dest',
  current: 'fill-node-current',
  visited: 'fill-node-visited',
  route: 'fill-node-route',
}

// Short badge so state is readable without relying on colour alone.
const BADGE: Partial<Record<NodeState, string>> = {
  start: 'S',
  dest: 'D',
  current: '•',
  visited: '✓',
  route: '→',
}

const STATE_LABEL: Record<NodeState, string> = {
  default: '',
  start: 'start',
  dest: 'destination',
  current: 'current node',
  visited: 'visited',
  route: 'on route',
}

// Light-filled states need dark text for contrast; strong fills use white.
const LIGHT_FILL: NodeState[] = ['default', 'visited']

interface CampusNodeProps {
  name: string
  point: Point
  state: NodeState
  selected?: boolean
  onClick?: (name: string) => void
}

export default function CampusNode({ name, point, state, selected, onClick }: CampusNodeProps) {
  const interactive = Boolean(onClick)
  const badge = BADGE[state]
  const darkText = LIGHT_FILL.includes(state)
  const stateLabel = STATE_LABEL[state]

  return (
    <g
      transform={`translate(${point.x}, ${point.y})`}
      className={interactive ? 'cursor-pointer' : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={stateLabel ? `${name}, ${stateLabel}` : name}
      onClick={interactive ? () => onClick!(name) : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick!(name)
              }
            }
          : undefined
      }
    >
      {state === 'current' && (
        <circle r={NODE_RADIUS + 7} className="fill-none stroke-node-current" strokeWidth={2}>
          <animate attributeName="r" values={`${NODE_RADIUS + 3};${NODE_RADIUS + 10};${NODE_RADIUS + 3}`} dur="1.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.1;0.8" dur="1.4s" repeatCount="indefinite" />
        </circle>
      )}

      <circle
        r={NODE_RADIUS}
        className={`${FILL[state]} ${selected ? 'stroke-accent' : 'stroke-surface'}`}
        strokeWidth={selected ? 4 : 3}
      />

      {badge && (
        <text
          textAnchor="middle"
          dominantBaseline="central"
          className={`text-[15px] font-bold ${darkText ? 'fill-ink' : 'fill-white'}`}
        >
          {badge}
        </text>
      )}

      <text
        y={NODE_RADIUS + 16}
        textAnchor="middle"
        className="fill-ink text-[13px] font-medium"
      >
        {name}
      </text>
    </g>
  )
}
