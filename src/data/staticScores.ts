import type { CriterionKey } from '../types'

export const STATIC_SCORES: Record<string, Partial<Record<CriterionKey, number>>> = {
  'capitol-hill': {
    freeway: 70,
    trees: 65,
    park: 75,
    transit: 95,
    weather: 45,
  },
  'montlake': {
    freeway: 40,
    trees: 80,
    park: 70,
    transit: 60,
    weather: 65,
  },
  'madison-valley': {
    freeway: 75,
    trees: 70,
    park: 60,
    transit: 65,
    weather: 70,
  },
  'central-district': {
    freeway: 55,
    trees: 55,
    park: 65,
    transit: 80,
    weather: 60,
  },
}
