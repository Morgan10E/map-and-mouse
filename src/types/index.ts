export type CriterionKey =
  | 'freeway'
  | 'trees'
  | 'restaurants'
  | 'grocery'
  | 'gym'
  | 'park'
  | 'transit'
  | 'weather'

export type Scores = Record<CriterionKey, number>
export type Filters = Record<CriterionKey, boolean>

export interface NeighborhoodProperties {
  id: string
  name: string
  color: string
}

export type NeighborhoodFeature = GeoJSON.Feature<
  GeoJSON.Polygon | GeoJSON.MultiPolygon,
  NeighborhoodProperties
>

export interface LiveScores {
  restaurants: number
  grocery: number
  gym: number
}

export const ALL_CRITERIA: CriterionKey[] = [
  'freeway',
  'trees',
  'restaurants',
  'grocery',
  'gym',
  'park',
  'transit',
  'weather',
]

export const CRITERION_LABELS: Record<CriterionKey, string> = {
  freeway: 'No freeway/sewage',
  trees: 'Trees + walkability',
  restaurants: 'Restaurants',
  grocery: 'Grocery access',
  gym: 'Gym / pool',
  park: 'Parks nearby',
  transit: 'Transit',
  weather: 'Rain shadow',
}
