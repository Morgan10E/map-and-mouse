import type { CriterionKey } from '../types'

export interface OverlayConfig {
  color: string
  radius: number       // meters — circle display radius
  isRepellant: boolean // true = warns of bad zones
  placesTypes?: string[]
  searchRadius: number // meters — nearbySearch radius (0 = static data, no search)
}

export const OVERLAY_CONFIG: Partial<Record<CriterionKey, OverlayConfig>> = {
  transit: {
    color: '#4285F4',
    radius: 400,
    isRepellant: false,
    placesTypes: ['transit_station'],
    searchRadius: 1500,
  },
  park: {
    color: '#34A853',
    radius: 800,
    isRepellant: false,
    placesTypes: ['park'],
    searchRadius: 1500,
  },
  restaurants: {
    color: '#FF6D00',
    radius: 800,
    isRepellant: false,
    placesTypes: ['restaurant'],
    searchRadius: 1500,
  },
  gym: {
    color: '#9C27B0',
    radius: 1500,
    isRepellant: false,
    placesTypes: ['gym', 'spa'],
    searchRadius: 2000,
  },
  grocery: {
    color: '#00897B',
    radius: 800,
    isRepellant: false,
    placesTypes: ['supermarket'],
    searchRadius: 1500,
  },
  freeway: {
    color: '#F44336',
    radius: 400,
    isRepellant: true,
    searchRadius: 0,
  },
  sewage: {
    color: '#795548',
    radius: 1000,
    isRepellant: true,
    searchRadius: 0,
  },
  trees: {
    color: '#2e7d32',
    radius: 0,
    isRepellant: false,
    searchRadius: 0,
  },
  tempMean: {
    color: '#e53935',
    radius: 0,
    isRepellant: false,
    searchRadius: 0,
  },
  tempMax: {
    color: '#b71c1c',
    radius: 0,
    isRepellant: false,
    searchRadius: 0,
  },
}

export const POI_CRITERIA = (Object.keys(OVERLAY_CONFIG) as CriterionKey[]).filter(
  k => !OVERLAY_CONFIG[k]!.isRepellant && OVERLAY_CONFIG[k]!.searchRadius > 0,
)

export const CRITERION_GROUPS: { label: string; keys: CriterionKey[] }[] = [
  { label: 'Coverage', keys: ['transit', 'park', 'restaurants', 'grocery', 'gym'] },
  { label: 'Avoid zones', keys: ['freeway', 'sewage'] },
  { label: 'Heatmaps', keys: ['trees', 'tempMean', 'tempMax'] },
]
