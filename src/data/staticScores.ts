import type { CriterionKey } from '../types'

// Static values for heatmap criteria only (trees score 0–100, temperatures in raw °F).
// Temperature values are annual mean, median, and mean daily max of the warmest
// month (July) based on NOAA climate normals for Seattle.
export const STATIC_SCORES: Record<string, Partial<Record<CriterionKey, number>>> = {
  'capitol-hill': {
    trees: 65,
    tempMean: 53,
    tempMedian: 53,
    tempMax: 76,
  },
  'montlake': {
    trees: 80,
    tempMean: 51,
    tempMedian: 51,
    tempMax: 73,
  },
  'madison-valley': {
    trees: 70,
    tempMean: 52,
    tempMedian: 52,
    tempMax: 75,
  },
  'central-district': {
    trees: 55,
    tempMean: 52,
    tempMedian: 52,
    tempMax: 75,
  },
}
