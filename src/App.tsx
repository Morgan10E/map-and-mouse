import { useState, useCallback } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { Hero } from './components/Hero'
import { ApiKeyBanner } from './components/ApiKeyBanner'
import { FilterBar } from './components/FilterBar'
import { MapView } from './components/MapView'
import { Sidebar } from './components/Sidebar'
import { useNeighborhoods } from './hooks/useNeighborhoods'
import { useCriteriaData } from './hooks/useCriteriaData'
import { useHeatmapData } from './hooks/useHeatmapData'
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
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null)

  const { neighborhoods } = useNeighborhoods()
  const { criteriaData, poiCounts } = useCriteriaData(placesService, neighborhoods)
  const { treePoints, tempPoints } = useHeatmapData()

  const handleFilterChange = useCallback((criterion: CriterionKey, checked: boolean) => {
    setFilters(prev => ({ ...prev, [criterion]: checked }))
  }, [])

  const handleNeighborhoodSelect = useCallback((feature: NeighborhoodFeature) => {
    setActiveFeature(feature)
  }, [])

  const showApiKeyBanner = !apiKey

  const activeCounts = activeFeature
    ? { ...poiCounts[activeFeature.properties.id] }
    : {}

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
            criteriaData={criteriaData}
            heatmapData={{ treePoints, tempPoints }}
            onNeighborhoodSelect={handleNeighborhoodSelect}
            onMapReady={setPlacesService}
          />
          {activeFeature && (
            <Sidebar
              name={activeFeature.properties.name}
              poiCounts={activeCounts}
              filters={filters}
              onClose={() => setActiveFeature(null)}
            />
          )}
        </MainContent>
      </AppShell>
    </>
  )
}
