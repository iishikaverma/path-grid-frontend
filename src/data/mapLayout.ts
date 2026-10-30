// Presentation-only node coordinates for the SVG campus map.
// The backend provides adjacency (edges) but no positions, so layout lives here.
// Any location missing from this map gets an auto-placed fallback position.

export const MAP_VIEWBOX = { width: 800, height: 520 }

export interface Point {
  x: number
  y: number
}

export const NODE_POSITIONS: Record<string, Point> = {
  'Main Gate': { x: 400, y: 470 },
  Canteen: { x: 190, y: 350 },
  'CSE Block': { x: 400, y: 310 },
  Hostel: { x: 610, y: 350 },
  Parking: { x: 140, y: 210 },
  'Sports Complex': { x: 250, y: 165 },
  Library: { x: 400, y: 150 },
  'Admin Block': { x: 560, y: 190 },
  'Medical Centre': { x: 660, y: 110 },
}

/** Position for a location, falling back to a point on a circle for unknowns. */
export function positionFor(name: string, index: number, total: number): Point {
  const known = NODE_POSITIONS[name]
  if (known) return known

  const cx = MAP_VIEWBOX.width / 2
  const cy = MAP_VIEWBOX.height / 2
  const radius = Math.min(cx, cy) * 0.75
  const angle = (index / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2
  return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) }
}
