import styled from 'styled-components'
import type { NeighborhoodFeature } from '../types'

const Header = styled.header`
  padding: 0.75rem 1.5rem;
  background: #1a1a2e;
  color: white;
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-shrink: 0;
`

const Title = styled.h1`
  font-size: 1.2rem;
  font-weight: 700;
  white-space: nowrap;
`

const Subtitle = styled.p`
  font-size: 0.8rem;
  color: #aaa;
  white-space: nowrap;
`

const LegendRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-left: auto;
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
`

const Swatch = styled.div<{ $color: string }>`
  width: 14px;
  height: 14px;
  border-radius: 3px;
  background: ${p => p.$color};
  opacity: 0.8;
  flex-shrink: 0;
`

interface Props {
  neighborhoods: NeighborhoodFeature[]
}

export function Hero({ neighborhoods }: Props) {
  return (
    <Header>
      <div>
        <Title>Seattle Neighborhood Explorer</Title>
        <Subtitle>Click a neighborhood to score it</Subtitle>
      </div>
      <LegendRow>
        {neighborhoods.map(f => (
          <LegendItem key={f.properties.id}>
            <Swatch $color={f.properties.color} />
            <span>{f.properties.name}</span>
          </LegendItem>
        ))}
      </LegendRow>
    </Header>
  )
}
