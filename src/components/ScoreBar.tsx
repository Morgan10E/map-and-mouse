import styled from 'styled-components'
import { scoreToColor } from '../utils/scoring'

const Track = styled.div`
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  margin-top: 4px;
  overflow: hidden;
`

const Fill = styled.div<{ $pct: number; $color: string }>`
  height: 100%;
  width: ${p => p.$pct}%;
  background: ${p => p.$color};
  border-radius: 3px;
  transition: width 0.3s ease, background 0.3s ease;
`

interface Props {
  score: number
}

export function ScoreBar({ score }: Props) {
  return (
    <Track>
      <Fill $pct={score} $color={scoreToColor(score)} />
    </Track>
  )
}
