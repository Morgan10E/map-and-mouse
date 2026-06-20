import type { CriterionKey, Filters } from '../types'
import { TEMP_CRITERIA } from '../types'

const WEIGHT: Partial<Record<CriterionKey, number>> = {
  freeway: 1,
  trees: 1,
  restaurants: 1,
  grocery: 1,
  gym: 1,
  park: 1,
  transit: 1,
  // tempMean/tempMedian/tempMax are raw °F — excluded from weighted score
}

export function computeWeightedScore(
  scores: Partial<Record<CriterionKey, number>>,
  filters: Filters,
): number {
  const active = (Object.keys(filters) as CriterionKey[]).filter(
    k => filters[k] && !TEMP_CRITERIA.has(k),
  )
  if (!active.length) return 0
  const totalW = active.reduce((s, k) => s + (WEIGHT[k] ?? 0), 0)
  if (totalW === 0) return 0
  const weightedSum = active.reduce((s, k) => s + (scores[k] ?? 0) * (WEIGHT[k] ?? 0), 0)
  return Math.round(weightedSum / totalW)
}

export function scoreToColor(score: number): string {
  // 0 = red (0°), 100 = green (120°)
  return `hsl(${score * 1.2}, 80%, 42%)`
}
