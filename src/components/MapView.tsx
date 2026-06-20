import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useNeighborhoods } from '../hooks/useNeighborhoods'
import { usePlacesScores } from '../hooks/usePlacesScores'
import { geojsonCoordsToLatLng, getPolygonCenter } from '../utils/geojson'
import { computeWeightedScore, scoreToColor } from '../utils/scoring'
import { STATIC_SCORES } from '../data/staticScores'
import type { CriterionKey, Filters, NeighborhoodFeature } from '../types'

const MapContainer = styled.div`
  flex: 1;
  position: relative;
`

const MapEl = styled.div`
  position: absolute;
  inset: 0;
`

const StatusMsg = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  color: #555;
  font-size: 0.9rem;
  gap: 0.5rem;
  padding: 2rem;
  text-align: center;
`

const ErrorDetail = styled.p`
  font-size: 0.75rem;
  color: #e74c3c;
  max-width: 320px;
`

interface Props {
  apiKey: string
  filters: Filters
  activeNeighborhoodId: string | null
  onNeighborhoodSelect: (feature: NeighborhoodFeature, scores: Partial<Record<CriterionKey, number>>) => void
  onScoresReady: (id: string, scores: Partial<Record<CriterionKey, number>>) => void
}

export function MapView({
  apiKey,
  filters,
  activeNeighborhoodId,
  onNeighborhoodSelect,
  onScoresReady,
}: Props) {
  const mapElRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const polygonsRef = useRef<Map<string, google.maps.Polygon>>(new Map())
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null)
  const mapsLoadedRef = useRef(false)
  const [mapsError, setMapsError] = useState<string | null>(null)
  const [mapsReady, setMapsReady] = useState(false)

  const { neighborhoods, hoaZones, loading, error } = useNeighborhoods()
  const { getScores } = usePlacesScores(placesServiceRef.current)

  // Load the Maps JS API
  useEffect(() => {
    if (!apiKey || mapsLoadedRef.current) return

    const callbackName = '__mapAndMouseInit'

    // @ts-expect-error dynamic window property
    window[callbackName] = () => {
      mapsLoadedRef.current = true
      // @ts-expect-error dynamic window property
      delete window[callbackName]
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${callbackName}&loading=async`
    script.async = true
    script.defer = true
    script.onerror = () => {
      setMapsError('Failed to load the Google Maps script. Check your API key and network connection.')
    }
    document.head.appendChild(script)

    // Timeout: if Maps hasn't loaded within 15s, surface an error
    const timeout = setTimeout(() => {
      if (!mapsLoadedRef.current) {
        setMapsError(
          'Google Maps failed to initialize. Possible causes: API key is invalid, ' +
          'Maps JavaScript API is not enabled, or the key is restricted to a different domain.',
        )
      }
    }, 15000)

    return () => clearTimeout(timeout)
  }, [apiKey])

  // Initialize map once API is ready and neighborhoods are loaded
  useEffect(() => {
    if (!apiKey || loading || neighborhoods.length === 0 || !mapElRef.current) return

    const waitForMaps = setInterval(() => {
      if (typeof google === 'undefined' || !google.maps) return
      clearInterval(waitForMaps)
      initMap()
    }, 100)

    function initMap() {
      if (!mapElRef.current) return

      try {
        // Verify Maps loaded without auth errors by checking for expected constructor
        if (typeof google.maps.Map !== 'function') {
          setMapsError('Google Maps API loaded but Map constructor is unavailable. Check API key permissions.')
          return
        }
      } catch {
        setMapsError('Error accessing Google Maps API.')
        return
      }

      const map = new google.maps.Map(mapElRef.current, {
        center: { lat: 47.620, lng: -122.310 },
        zoom: 13,
        mapTypeId: 'roadmap',
        gestureHandling: 'cooperative',
        streetViewControl: false,
        mapTypeControl: false,
      })
      mapRef.current = map
      placesServiceRef.current = new google.maps.places.PlacesService(map)
      setMapsReady(true)

      // HOA zones via Data layer
      if (hoaZones.length > 0) {
        const hoaCollection: GeoJSON.FeatureCollection = {
          type: 'FeatureCollection',
          features: hoaZones,
        }
        map.data.addGeoJson(hoaCollection)
        map.data.setStyle({
          fillOpacity: 0,
          strokeColor: '#888888',
          strokeWeight: 1.5,
          strokeOpacity: 0.7,
        })
      }

      // Neighborhood polygons
      neighborhoods.forEach(feature => {
        const paths = geojsonCoordsToLatLng(feature.geometry)
        const color = feature.properties.color

        const poly = new google.maps.Polygon({
          paths,
          strokeColor: color,
          strokeOpacity: 0.85,
          strokeWeight: 2,
          fillColor: color,
          fillOpacity: 0.22,
          map,
        })

        poly.addListener('click', () => handlePolygonClick(feature))
        poly.addListener('mouseover', () => poly.setOptions({ fillOpacity: 0.4 }))
        poly.addListener('mouseout', () => {
          const isActive = feature.properties.id === activeNeighborhoodId
          poly.setOptions({ fillOpacity: isActive ? 0.5 : 0.22 })
        })

        polygonsRef.current.set(feature.properties.id, poly)
      })
    }

    return () => clearInterval(waitForMaps)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, loading, neighborhoods, hoaZones])

  // Update polygon colors when filters change or active neighborhood changes
  useEffect(() => {
    polygonsRef.current.forEach((poly, id) => {
      const feature = neighborhoods.find(f => f.properties.id === id)
      if (!feature) return
      const staticS = STATIC_SCORES[id] ?? {}
      const score = computeWeightedScore(staticS, filters)
      const color = scoreToColor(score)
      const isActive = id === activeNeighborhoodId
      poly.setOptions({
        strokeColor: color,
        fillColor: color,
        fillOpacity: isActive ? 0.5 : 0.22,
        strokeOpacity: isActive ? 1 : 0.85,
        strokeWeight: isActive ? 3 : 2,
      })
    })
  }, [filters, activeNeighborhoodId, neighborhoods])

  async function handlePolygonClick(feature: NeighborhoodFeature) {
    const id = feature.properties.id
    const center = getPolygonCenter(feature.geometry)

    // Notify parent with static scores while live scores load
    const staticS = STATIC_SCORES[id] ?? {}
    onNeighborhoodSelect(feature, staticS)

    if (!placesServiceRef.current) return

    try {
      const liveScores = await getScores(id, center)
      const merged = { ...staticS, ...liveScores }
      onScoresReady(id, merged)
    } catch {
      // Live scores failed — static scores already shown
    }
  }

  if (error) {
    return (
      <MapContainer>
        <StatusMsg>Failed to load map data: {error}</StatusMsg>
      </MapContainer>
    )
  }

  const showLoading = apiKey && !mapsError && !mapsReady

  return (
    <MapContainer>
      <MapEl ref={mapElRef} />
      {!apiKey && (
        <StatusMsg>Enter your Google Maps API key above to load the map.</StatusMsg>
      )}
      {mapsError && (
        <StatusMsg>
          <span>⚠️ Map failed to load</span>
          <ErrorDetail>{mapsError}</ErrorDetail>
        </StatusMsg>
      )}
      {showLoading && (
        <StatusMsg>Loading map…</StatusMsg>
      )}
    </MapContainer>
  )
}
