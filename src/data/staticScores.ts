import type { CriterionKey } from '../types'

// Static scores (0–100) for non-live criteria, plus raw °F temperature values.
// Temperature values are annual mean, median, and mean daily max of the warmest
// month (July) based on NOAA climate normals for Seattle.
export const STATIC_SCORES: Record<string, Partial<Record<CriterionKey, number>>> = {
  'capitol-hill': {
    freeway: 70,
    trees: 65,
    park: 75,
    transit: 95,
    tempMean: 53,
    tempMedian: 53,
    tempMax: 76,
  },
  'montlake': {
    freeway: 40,
    trees: 80,
    park: 70,
    transit: 60,
    tempMean: 51,
    tempMedian: 51,
    tempMax: 73,
  },
  'madison-valley': {
    freeway: 75,
    trees: 70,
    park: 60,
    transit: 65,
    tempMean: 52,
    tempMedian: 52,
    tempMax: 75,
  },
  'central-district': {
    freeway: 55,
    trees: 55,
    park: 65,
    transit: 80,
    tempMean: 52,
    tempMedian: 52,
    tempMax: 75,
  },
}
