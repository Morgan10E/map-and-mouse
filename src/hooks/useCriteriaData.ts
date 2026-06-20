import { useEffect, useState } from 'react'
import type { CriterionKey, NeighborhoodFeature } from '../types'
import { getPolygonCenter } from '../utils/geojson'
import { OVERLAY_CONFIG, POI_CRITERIA } from '../data/overlayConfig'

export type CriteriaData = Record<string, Partial<Record<CriterionKey, google.maps.places.PlaceResult[]>>>

function nearbySearch(
  service: google.maps.places.PlacesService,
  request: google.maps.places.PlaceSearchRequest,
): Promise<google.maps.places.PlaceResult[]> {
  return new Promise(resolve => {
    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        resolve(results)
      } else {
        resolve([])
      }
    })
  })
}

export function useCriteriaData(
  placesService: google.maps.places.PlacesService | null,
  neighborhoods: NeighborhoodFeature[],
): {
  criteriaData: CriteriaData
  poiCounts: Record<string, Partial<Record<CriterionKey, number>>>
} {
  const [criteriaData, setCriteriaData] = useState<CriteriaData>({})

  useEffect(() => {
    if (!placesService || neighborhoods.length === 0) return

    setCriteriaData({})

    for (const neighborhood of neighborhoods) {
      const id = neighborhood.properties.id
      const center = getPolygonCenter(neighborhood.geometry)
      const location = new google.maps.LatLng(center.lat, center.lng)

      const searches = POI_CRITERIA.map(async key => {
        const config = OVERLAY_CONFIG[key]!
        const types = config.placesTypes ?? []

        const batches = await Promise.all(
          types.map(type =>
            nearbySearch(placesService, { location, radius: config.searchRadius, type }),
          ),
        )

        // Merge results from multiple types, deduplicating by place_id
        const seen = new Set<string>()
        const merged: google.maps.places.PlaceResult[] = []
        for (const batch of batches) {
          for (const r of batch) {
            if (r.place_id && !seen.has(r.place_id)) {
              seen.add(r.place_id)
              merged.push(r)
            }
          }
        }
        return [key, merged] as [CriterionKey, google.maps.places.PlaceResult[]]
      })

      Promise.all(searches).then(entries => {
        setCriteriaData(prev => ({ ...prev, [id]: Object.fromEntries(entries) }))
      })
    }
  }, [placesService, neighborhoods])

  const poiCounts: Record<string, Partial<Record<CriterionKey, number>>> = {}
  for (const [id, nbData] of Object.entries(criteriaData)) {
    poiCounts[id] = {}
    for (const [key, results] of Object.entries(nbData)) {
      poiCounts[id][key as CriterionKey] = results.length
    }
  }

  return { criteriaData, poiCounts }
}
