import { useState, useCallback } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { Hero } from './components/Hero'
import { ApiKeyBanner } from './components/ApiKeyBanner'
import { FilterBar } from './components/FilterBar'
import { MapView } from './components/MapView'
import { Sidebar } from './components/Sidebar'
import { useNeighborhoods } from './hooks/useNeighborhoods'
import { computeWeightedScore } from './utils/scoring'
import { STATIC_SCORES } from './data/staticScores'
import { ALL_CRITERIA, type CriterionKey, type Filters, type NeighborhoodFeature } from './types'

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, -apple-system, sans-serif; }
`

const AppShell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100dvh;
`

const MainContent = styled.main`
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`

function makeDefaultFilters(): Filters {
  return Object.fromEntries(ALL_CRITERIA.map(k => [k, true])) as Filters
}

export function App() {
  const [apiKey, setApiKey] = useState<string>(
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  )
  const [filters, setFilters] = useState<Filters>(makeDefaultFilters)
  const [activeFeature, setActiveFeature] = useState<NeighborhoodFeature | null>(null)
  const [activeScores, setActiveScores] = useState<Partial<Record<CriterionKey, number>>>({})
  const [scoresLoading, setScoresLoading] = useState(false)

  const { neighborhoods } = useNeighborhoods()

  const handleFilterChange = useCallback((criterion: CriterionKey, checked: boolean) => {
    setFilters(prev => ({ ...prev, [criterion]: checked }))
  }, [])

  const handleNeighborhoodSelect = useCallback(
    (feature: NeighborhoodFeature, scores: Partial<Record<CriterionKey, number>>) => {
      setActiveFeature(feature)
      setActiveScores(scores)
      setScoresLoading(true)
    },
    [],
  )

  const handleScoresReady = useCallback(
    (id: string, scores: Partial<Record<CriterionKey, number>>) => {
      if (activeFeature?.properties.id === id) {
        setActiveScores(scores)
        setScoresLoading(false)
      }
    },
    [activeFeature],
  )

  const totalScore = activeFeature
    ? computeWeightedScore(
        activeFeature
          ? { ...STATIC_SCORES[activeFeature.properties.id], ...activeScores }
          : activeScores,
        filters,
      )
    : null

  const showApiKeyBanner = !apiKey

  return (
    <>
      <GlobalStyle />
      <AppShell>
        <Hero neighborhoods={neighborhoods} />
        {showApiKeyBanner && <ApiKeyBanner onKeySubmit={setApiKey} />}
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />
        <MainContent>
          <MapView
            apiKey={apiKey}
            filters={filters}
            activeNeighborhoodId={activeFeature?.properties.id ?? null}
            onNeighborhoodSelect={handleNeighborhoodSelect}
            onScoresReady={handleScoresReady}
          />
          {activeFeature && (
            <Sidebar
              name={activeFeature.properties.name}
              totalScore={scoresLoading ? null : totalScore}
              scores={activeScores}
              filters={filters}
              loading={scoresLoading}
              onClose={() => setActiveFeature(null)}
            />
          )}
        </MainContent>
      </AppShell>
    </>
  )
}
