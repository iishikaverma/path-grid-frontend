// Types mirror the PathGrid Java backend responses exactly.
// Source of truth: path-grid-backend controllers + model POJOs.

/** GET /api/locations/{name} */
export interface Location {
  name: string
  neighbours: string[]
}

/** POST body for /api/routes/find and /api/visualizer/bfs */
export interface RouteRequest {
  from: string
  to: string
}

/** POST /api/routes/find response */
export interface RouteResponse {
  from: string
  to: string
  path: string[]
  visited: string[]
  nodesVisited: number
  pathLength: number
  algorithm: string
  message: string
}

/** One BFS snapshot from POST /api/visualizer/bfs */
export interface BFSStep {
  step: number
  current: string | null // null on the initial step
  queue: string[] // front -> rear
  visited: string[]
  description: string
}

/** POST /api/visualizer/bfs response */
export interface VisualizerResponse {
  from: string
  to: string
  path: string[]
  steps: BFSStep[]
  nodesVisited: number
  pathLength: number
  algorithm: string
  message: string
}

/** GET /api/locations/prioritized item */
export interface PriorityItem {
  name: string
  priority: number
}

/** Frontend-assembled graph (not a single backend endpoint). */
export interface GraphData {
  locations: string[]
  /** adjacency: location name -> its neighbours */
  neighbours: Record<string, string[]>
}

/** Thrown by the API layer; carries a user-friendly message. */
export type ApiErrorKind = 'network' | 'notFound' | 'badRequest' | 'server'

export class ApiError extends Error {
  readonly kind: ApiErrorKind

  constructor(message: string, kind: ApiErrorKind) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
  }
}
