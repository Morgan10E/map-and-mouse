export type CriterionKey =
  | 'freeway'
  | 'trees'
  | 'restaurants'
  | 'grocery'
  | 'gym'
  | 'park'
  | 'transit'
  | 'tempMean'
  | 'tempMedian'
  | 'tempMax'

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
  'tempMean',
  'tempMedian',
  'tempMax',
]

export const CRITERION_LABELS: Record<CriterionKey, string> = {
  freeway: 'No freeway/sewage',
  trees: 'Trees + walkability',
  restaurants: 'Restaurants',
  grocery: 'Grocery access',
  gym: 'Gym / pool',
  park: 'Parks nearby',
  transit: 'Transit',
  tempMean: 'Mean temp (°F)',
  tempMedian: 'Median temp (°F)',
  tempMax: 'Max temp (°F)',
}

// Temperature criteria store raw °F values; excluded from weighted score
export const TEMP_CRITERIA = new Set<CriterionKey>(['tempMean', 'tempMedian', 'tempMax'])
