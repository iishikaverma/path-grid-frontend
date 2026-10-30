import {
  ApiError,
  type GraphData,
  type Location,
  type PriorityItem,
  type RouteResponse,
  type VisualizerResponse,
} from '../types/api'

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:8080'

/** Single fetch wrapper: maps transport + HTTP errors to a typed ApiError. */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    })
  } catch {
    throw new ApiError('Unable to connect to PathGrid server.', 'network')
  }

  if (!res.ok) {
    // Backend sends { message } (or a RouteResponse with message) on errors.
    let message = `Request failed (${res.status}).`
    try {
      const body = await res.json()
      if (body && typeof body.message === 'string') message = body.message
    } catch {
      /* non-JSON error body — keep the generic message */
    }
    const kind = res.status === 404 ? 'notFound' : res.status === 400 ? 'badRequest' : 'server'
    throw new ApiError(message, kind)
  }

  return res.json() as Promise<T>
}

export function getLocations(): Promise<string[]> {
  return request<string[]>('/api/locations')
}

export function getLocationDetails(name: string): Promise<Location> {
  return request<Location>(`/api/locations/${encodeURIComponent(name)}`)
}

export function getPrioritizedLocations(): Promise<PriorityItem[]> {
  return request<PriorityItem[]>('/api/locations/prioritized')
}

export function findRoute(from: string, to: string): Promise<RouteResponse> {
  return request<RouteResponse>('/api/routes/find', {
    method: 'POST',
    body: JSON.stringify({ from, to }),
  })
}

export function getBFSSteps(from: string, to: string): Promise<VisualizerResponse> {
  return request<VisualizerResponse>('/api/visualizer/bfs', {
    method: 'POST',
    body: JSON.stringify({ from, to }),
  })
}

/**
 * Assemble the whole graph: the backend has no single "get graph" endpoint,
 * so fetch names then each node's neighbours. N+1 calls, fine for ~9 nodes.
 * ponytail: N+1 fan-out; add a GET /api/graph endpoint if the graph grows.
 */
export async function getGraph(): Promise<GraphData> {
  const locations = await getLocations()
  const details = await Promise.all(locations.map((name) => getLocationDetails(name)))

  const neighbours: Record<string, string[]> = {}
  for (const d of details) neighbours[d.name] = d.neighbours

  return { locations, neighbours }
}
