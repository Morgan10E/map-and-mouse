export type CriterionKey =
  | 'freeway'
  | 'sewage'
  | 'trees'
  | 'restaurants'
  | 'grocery'
  | 'gym'
  | 'park'
  | 'transit'
  | 'tempMean'
  | 'tempMedian'
  | 'tempMax'

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

export const ALL_CRITERIA: CriterionKey[] = [
  'transit',
  'park',
  'restaurants',
  'grocery',
  'gym',
  'freeway',
  'sewage',
  'trees',
  'tempMean',
  'tempMedian',
  'tempMax',
]

export const CRITERION_LABELS: Record<CriterionKey, string> = {
  transit: 'Transit access',
  park: 'Parks',
  restaurants: 'Restaurants',
  grocery: 'Groceries',
  gym: 'Gym / pool',
  freeway: 'Far from freeway',
  sewage: 'Far from smell sources',
  trees: 'Tree coverage',
  tempMean: 'Mean temp (°F)',
  tempMedian: 'Median temp (°F)',
  tempMax: 'Max temp (°F)',
}

export const TEMP_CRITERIA = new Set<CriterionKey>(['tempMean', 'tempMedian', 'tempMax'])
export const HEATMAP_CRITERIA = new Set<CriterionKey>(['trees', 'tempMean', 'tempMedian', 'tempMax'])
export const REPELLANT_CRITERIA = new Set<CriterionKey>(['freeway', 'sewage'])
