import styled from 'styled-components'
import { ScoreBar } from './ScoreBar'
import { scoreToColor } from '../utils/scoring'
import { ALL_CRITERIA, CRITERION_LABELS, type CriterionKey, type Filters } from '../types'

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

const ScoreTotal = styled.div<{ $color: string }>`
  padding: 0.75rem 1.25rem;
  font-size: 2.25rem;
  font-weight: 800;
  color: ${p => p.$color};
  border-bottom: 1px solid #eee;
`

const ScoreLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 400;
  color: #888;
  margin-left: 0.25rem;
`

const List = styled.ul`
  list-style: none;
  padding: 0.5rem 0;
`

const Row = styled.li<{ $dimmed: boolean }>`
  padding: 0.5rem 1.25rem;
  opacity: ${p => p.$dimmed ? 0.35 : 1};
  transition: opacity 0.2s;
`

const RowTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`

const CriterionName = styled.span`
  font-size: 0.82rem;
`

const CriterionScore = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
  color: #555;
`

const LoadingMsg = styled.p`
  padding: 2rem 1.25rem;
  color: #888;
  font-size: 0.85rem;
`

interface Props {
  name: string
  totalScore: number | null
  scores: Partial<Record<CriterionKey, number>>
  filters: Filters
  loading: boolean
  onClose: () => void
}

export function Sidebar({ name, totalScore, scores, filters, loading, onClose }: Props) {
  return (
    <Panel>
      <PanelHeader>
        <NeighborhoodName>{name}</NeighborhoodName>
        <CloseButton onClick={onClose} aria-label="Close">✕</CloseButton>
      </PanelHeader>

      {loading || totalScore === null ? (
        <LoadingMsg>Loading live data…</LoadingMsg>
      ) : (
        <>
          <ScoreTotal $color={scoreToColor(totalScore)}>
            {totalScore}
            <ScoreLabel>/ 100</ScoreLabel>
          </ScoreTotal>
          <List>
            {ALL_CRITERIA.map(key => {
              const val = scores[key] ?? 0
              const active = filters[key]
              return (
                <Row key={key} $dimmed={!active}>
                  <RowTop>
                    <CriterionName>{CRITERION_LABELS[key]}</CriterionName>
                    <CriterionScore>{active ? val : '—'}</CriterionScore>
                  </RowTop>
                  <ScoreBar score={active ? val : 0} />
                </Row>
              )
            })}
          </List>
        </>
      )}
    </Panel>
  )
}
