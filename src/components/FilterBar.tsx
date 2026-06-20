import styled from 'styled-components'
import { CRITERION_LABELS, type CriterionKey, type Filters } from '../types'
import { CRITERION_GROUPS, OVERLAY_CONFIG } from '../data/overlayConfig'

const Bar = styled.section`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.75rem;
  padding: 0.5rem 1.25rem;
  background: #f4f4f4;
  border-bottom: 1px solid #ddd;
  align-items: center;
  flex-shrink: 0;
`

const GroupBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem 0.75rem;
  flex-wrap: wrap;
`

const GroupSep = styled.span`
  width: 1px;
  height: 1.2rem;
  background: #ccc;
  align-self: center;
  flex-shrink: 0;
`

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  cursor: pointer;
  user-select: none;
`

const Swatch = styled.span<{ $color: string }>`
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 2px;
  background: ${p => p.$color};
  flex-shrink: 0;
`

interface Props {
  filters: Filters
  onFilterChange: (criterion: CriterionKey, checked: boolean) => void
}

export function FilterBar({ filters, onFilterChange }: Props) {
  return (
    <Bar>
      {CRITERION_GROUPS.map((group, i) => (
        <>
          {i > 0 && <GroupSep key={`sep-${group.label}`} />}
          <GroupBlock key={group.label}>
            {group.keys.map(key => (
              <Label key={key}>
                <input
                  type="checkbox"
                  checked={filters[key]}
                  onChange={e => onFilterChange(key, e.target.checked)}
                />
                <Swatch $color={OVERLAY_CONFIG[key]?.color ?? '#888'} />
                {CRITERION_LABELS[key]}
              </Label>
            ))}
          </GroupBlock>
        </>
      ))}
    </Bar>
  )
}
