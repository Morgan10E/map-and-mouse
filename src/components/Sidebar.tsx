import styled from 'styled-components'
import { CRITERION_LABELS, HEATMAP_CRITERIA, REPELLANT_CRITERIA, type CriterionKey, type Filters } from '../types'
import { CRITERION_GROUPS, OVERLAY_CONFIG } from '../data/overlayConfig'

const Panel = styled.aside`
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: white;
  border-left: 2px solid #e0e0e0;
  overflow-y: auto;
`

const PanelHeader = styled.div`
  padding: 1rem 1.25rem 0.75rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`

const NeighborhoodName = styled.h2`
  font-size: 1rem;
  font-weight: 700;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #888;
  line-height: 1;
  padding: 0;
  margin-left: 0.5rem;

  &:hover {
    color: #333;
  }
`

const Group = styled.div`
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`

const GroupLabel = styled.div`
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #aaa;
  padding: 0.5rem 1.25rem 0.25rem;
`

const Row = styled.div<{ $dimmed: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 1.25rem;
  opacity: ${p => p.$dimmed ? 0.35 : 1};
  transition: opacity 0.2s;
`

const Swatch = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background: ${p => p.$color};
  flex-shrink: 0;
`

const CriterionName = styled.span`
  font-size: 0.82rem;
  flex: 1;
`

const CriterionValue = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
  color: #555;
  white-space: nowrap;
`

interface Props {
  name: string
  poiCounts: Partial<Record<CriterionKey, number>>
  filters: Filters
  onClose: () => void
}

function formatValue(
  key: CriterionKey,
  poiCounts: Partial<Record<CriterionKey, number>>,
): string {
  if (REPELLANT_CRITERIA.has(key)) return 'overlay active'
  if (HEATMAP_CRITERIA.has(key)) return 'see map'
  const count = poiCounts[key]
  if (count == null) return 'loading…'
  return `${count} found`
}

export function Sidebar({ name, poiCounts, filters, onClose }: Props) {
  return (
    <Panel>
      <PanelHeader>
        <NeighborhoodName>{name}</NeighborhoodName>
        <CloseButton onClick={onClose} aria-label="Close">✕</CloseButton>
      </PanelHeader>

      {CRITERION_GROUPS.map(group => (
        <Group key={group.label}>
          <GroupLabel>{group.label}</GroupLabel>
          {group.keys.map(key => {
            const color = OVERLAY_CONFIG[key]?.color ?? '#888'
            const active = filters[key]
            const value = active ? formatValue(key, poiCounts) : '—'
            return (
              <Row key={key} $dimmed={!active}>
                <Swatch $color={color} />
                <CriterionName>{CRITERION_LABELS[key]}</CriterionName>
                <CriterionValue>{value}</CriterionValue>
              </Row>
            )
          })}
        </Group>
      ))}
    </Panel>
  )
}
