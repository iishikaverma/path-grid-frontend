// Presentation-only metadata (category / description / glyph) for locations.
// NOT DSA data — the backend only exposes names + neighbours. Unknown
// locations fall back to a generic entry so the UI stays dynamic.

export interface LocationMeta {
  category: string
  description: string
  glyph: string
}

export const LOCATION_META: Record<string, LocationMeta> = {
  'Main Gate': {
    category: 'Entrance',
    description: 'The main entry point to campus.',
    glyph: '🚪',
  },
  Canteen: {
    category: 'Dining',
    description: 'Food court and dining area for students and staff.',
    glyph: '🍽️',
  },
  'CSE Block': {
    category: 'Academic',
    description: 'Computer Science & Engineering department block.',
    glyph: '💻',
  },
  Library: {
    category: 'Academic',
    description: 'Central library and quiet study halls.',
    glyph: '📚',
  },
  Hostel: {
    category: 'Residential',
    description: 'Student residential hostel.',
    glyph: '🏠',
  },
  'Admin Block': {
    category: 'Administrative',
    description: 'Administrative and faculty offices.',
    glyph: '🏢',
  },
  'Sports Complex': {
    category: 'Recreation',
    description: 'Sports grounds, courts, and gymnasium.',
    glyph: '⚽',
  },
  Parking: {
    category: 'Facility',
    description: 'Vehicle parking area.',
    glyph: '🅿️',
  },
  'Medical Centre': {
    category: 'Health',
    description: 'Campus health and medical centre.',
    glyph: '⚕️',
  },
}

const FALLBACK: LocationMeta = {
  category: 'Location',
  description: 'A campus location.',
  glyph: '📍',
}

export function metaFor(name: string): LocationMeta {
  return LOCATION_META[name] ?? FALLBACK
}
