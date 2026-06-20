import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useNeighborhoods } from '../hooks/useNeighborhoods'
import { geojsonCoordsToLatLng, getPolygonCenter } from '../utils/geojson'
import { STATIC_SCORES } from '../data/staticScores'
import { FREEWAY_POINTS, SEWAGE_POINTS } from '../data/staticOverlays'
import { OVERLAY_CONFIG, POI_CRITERIA } from '../data/overlayConfig'
import { HEATMAP_CRITERIA, TEMP_CRITERIA } from '../types'
import type { CriterionKey, Filters, NeighborhoodFeature } from '../types'
import type { CriteriaData } from '../hooks/useCriteriaData'

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
  criteriaData: CriteriaData
  onNeighborhoodSelect: (feature: NeighborhoodFeature) => void
  onMapReady: (svc: google.maps.places.PlacesService) => void
}

export function MapView({
  apiKey,
  filters,
  activeNeighborhoodId,
  criteriaData,
  onNeighborhoodSelect,
  onMapReady,
}: Props) {
  const mapElRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const polygonsRef = useRef<Map<string, google.maps.Polygon>>(new Map())
  const circleLayersRef = useRef<Map<CriterionKey, google.maps.Circle[]>>(new Map())
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const heatmapLayersRef = useRef<Map<CriterionKey, any>>(new Map())
  const createdNbCountRef = useRef(0)
  const mapsLoadedRef = useRef(false)
  const onNeighborhoodSelectRef = useRef(onNeighborhoodSelect)
  const onMapReadyRef = useRef(onMapReady)
  const [mapsError, setMapsError] = useState<string | null>(null)
  const [mapsReady, setMapsReady] = useState(false)

  useEffect(() => { onNeighborhoodSelectRef.current = onNeighborhoodSelect }, [onNeighborhoodSelect])
  useEffect(() => { onMapReadyRef.current = onMapReady }, [onMapReady])

  const { neighborhoods, hoaZones, loading, error } = useNeighborhoods()

  // Load Maps JS API with places + visualization libraries
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,visualization&callback=${callbackName}&loading=async`
    script.async = true
    script.defer = true
    script.onerror = () => {
      setMapsError('Failed to load the Google Maps script. Check your API key and network connection.')
    }
    document.head.appendChild(script)

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

      const placesService = new google.maps.places.PlacesService(map)
      onMapReadyRef.current(placesService)
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

      // Neighborhood polygons — outline only, no score fill
      neighborhoods.forEach(feature => {
        const paths = geojsonCoordsToLatLng(feature.geometry)

        const poly = new google.maps.Polygon({
          paths,
          strokeColor: '#444444',
          strokeOpacity: 0.8,
          strokeWeight: 1.5,
          fillColor: '#000000',
          fillOpacity: 0,
          map,
        })

        poly.addListener('click', () => onNeighborhoodSelectRef.current(feature))
        poly.addListener('mouseover', () =>
          poly.setOptions({ strokeWeight: 2.5, fillOpacity: 0.04 }),
        )
        poly.addListener('mouseout', () =>
          poly.setOptions({ strokeWeight: 1.5, fillOpacity: 0 }),
        )

        polygonsRef.current.set(feature.properties.id, poly)
      })
    }

    return () => clearInterval(waitForMaps)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, loading, neighborhoods, hoaZones])

  // Highlight active neighborhood polygon
  useEffect(() => {
    polygonsRef.current.forEach((poly, id) => {
      const isActive = id === activeNeighborhoodId
      poly.setOptions({
        strokeColor: isActive ? '#111111' : '#444444',
        strokeWeight: isActive ? 2.5 : 1.5,
        fillOpacity: isActive ? 0.06 : 0,
      })
    })
  }, [activeNeighborhoodId])

  // Create static overlays: repellant circles + heatmap layers (runs once after map ready)
  useEffect(() => {
    const map = mapRef.current
    if (!mapsReady || !map || neighborhoods.length === 0) return

    // Freeway repellant circles
    const freewayCfg = OVERLAY_CONFIG.freeway!
    circleLayersRef.current.set(
      'freeway',
      FREEWAY_POINTS.map(
        pt =>
          new google.maps.Circle({
            center: pt,
            radius: freewayCfg.radius,
            strokeWeight: 0,
            fillColor: freewayCfg.color,
            fillOpacity: 0.2,
            map: null,
            clickable: false,
          }),
      ),
    )

    // Sewage repellant circles
    const sewageCfg = OVERLAY_CONFIG.sewage!
    circleLayersRef.current.set(
      'sewage',
      SEWAGE_POINTS.map(
        pt =>
          new google.maps.Circle({
            center: pt,
            radius: sewageCfg.radius,
            strokeWeight: 0,
            fillColor: sewageCfg.color,
            fillOpacity: 0.2,
            map: null,
            clickable: false,
          }),
      ),
    )

    // HeatmapLayer for trees and temperature criteria.
    // @types/google.maps 3.58+ only stubs visualization types; cast to any for the constructor.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const HeatmapLayerCtor = google.maps.visualization.HeatmapLayer as any
    for (const criterion of HEATMAP_CRITERIA) {
      const points = neighborhoods
        .map(nb => {
          const c = getPolygonCenter(nb.geometry)
          return {
            location: new google.maps.LatLng(c.lat, c.lng),
            weight: STATIC_SCORES[nb.properties.id]?.[criterion] ?? 0,
          }
        })
        .filter(p => p.weight > 0)

      const gradient = TEMP_CRITERIA.has(criterion)
        ? ['rgba(0,0,255,0)', 'rgba(0,128,255,1)', 'rgba(255,255,0,1)', 'rgba(255,128,0,1)', 'rgba(255,0,0,1)']
        : ['rgba(0,128,0,0)', 'rgba(50,200,50,1)', 'rgba(0,100,0,1)']

      const layer = new HeatmapLayerCtor({ data: points, map: null, radius: 80, opacity: 0.7, gradient })
      heatmapLayersRef.current.set(criterion, layer)
    }
  }, [mapsReady, neighborhoods])

  // Build POI circles as criteriaData updates (additive per neighborhood batch)
  useEffect(() => {
    const map = mapRef.current
    if (!mapsReady || !map) return

    const nbCount = Object.keys(criteriaData).length
    if (nbCount === 0 || nbCount === createdNbCountRef.current) return

    // Destroy existing POI circles before rebuilding with updated data
    for (const key of POI_CRITERIA) {
      circleLayersRef.current.get(key)?.forEach(c => c.setMap(null))
    }

    for (const key of POI_CRITERIA) {
      const config = OVERLAY_CONFIG[key]!

      // Collect all results across all loaded neighborhoods, dedup by place_id
      const seen = new Set<string>()
      const allResults: google.maps.places.PlaceResult[] = []
      for (const nbData of Object.values(criteriaData)) {
        for (const result of nbData[key] ?? []) {
          if (result.place_id && !seen.has(result.place_id)) {
            seen.add(result.place_id)
            allResults.push(result)
          }
        }
      }

      const circles = allResults
        .filter(r => r.geometry?.location)
        .map(
          r =>
            new google.maps.Circle({
              center: r.geometry!.location!.toJSON(),
              radius: config.radius,
              strokeWeight: 0,
              fillColor: config.color,
              fillOpacity: 0.13,
              map: null,
              clickable: false,
            }),
        )

      circleLayersRef.current.set(key, circles)
    }

    createdNbCountRef.current = nbCount
  }, [criteriaData, mapsReady])

  // Apply filter visibility to all layers (runs on filter changes and after new circles are created)
  useEffect(() => {
    const map = mapRef.current
    if (!mapsReady || !map) return

    circleLayersRef.current.forEach((circles, key) => {
      const visible = filters[key] ?? false
      circles.forEach(c => c.setMap(visible ? map : null))
    })

    heatmapLayersRef.current.forEach((layer, key) => {
      layer.setMap((filters[key] ?? false) ? map : null)
    })
  }, [filters, criteriaData, mapsReady])

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
      {showLoading && <StatusMsg>Loading map…</StatusMsg>}
    </MapContainer>
  )
}
