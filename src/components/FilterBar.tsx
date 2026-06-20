import styled from 'styled-components'
import { ALL_CRITERIA, CRITERION_LABELS, type CriterionKey, type Filters } from '../types'

const Bar = styled.section`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  padding: 0.6rem 1.5rem;
  background: #f4f4f4;
  border-bottom: 1px solid #ddd;
  align-items: center;
  flex-shrink: 0;
`

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.82rem;
  cursor: pointer;
  user-select: none;
`

const Caption = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #555;
  margin-right: 0.5rem;
`

interface Props {
  filters: Filters
  onFilterChange: (criterion: CriterionKey, checked: boolean) => void
}

export function FilterBar({ filters, onFilterChange }: Props) {
  return (
    <Bar>
      <Caption>Show:</Caption>
      {ALL_CRITERIA.map(key => (
        <Label key={key}>
          <input
            type="checkbox"
            checked={filters[key]}
            onChange={e => onFilterChange(key, e.target.checked)}
          />
          {CRITERION_LABELS[key]}
        </Label>
      ))}
    </Bar>
  )
}
