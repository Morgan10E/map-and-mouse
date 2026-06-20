import { useRef, useCallback } from 'react'
import type { LiveScores } from '../types'

const RADIUS = 800 // ~0.5 mile

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

export function usePlacesScores(
  placesService: google.maps.places.PlacesService | null,
) {
  const cache = useRef<Record<string, LiveScores>>({})

  const getScores = useCallback(
    async (
      neighborhoodId: string,
      center: google.maps.LatLngLiteral,
    ): Promise<LiveScores> => {
      if (cache.current[neighborhoodId]) {
        return cache.current[neighborhoodId]
      }

      if (!placesService) {
        return { restaurants: 0, grocery: 0, gym: 0 }
      }

      const location = new google.maps.LatLng(center.lat, center.lng)

      const [restaurants, groceries, gyms, pools] = await Promise.all([
        nearbySearch(placesService, { location, radius: RADIUS, type: 'restaurant' }),
        nearbySearch(placesService, { location, radius: RADIUS, type: 'supermarket' }),
        nearbySearch(placesService, { location, radius: RADIUS, type: 'gym' }),
        nearbySearch(placesService, { location, radius: RADIUS, type: 'spa' }),
      ])

      // Merge gyms and pools, deduplicating by place_id
      const gymIds = new Set(gyms.map(p => p.place_id))
      const gymPool = [...gyms, ...pools.filter(p => !gymIds.has(p.place_id))]

      const scores: LiveScores = {
        restaurants: Math.min(100, restaurants.length * 5),
        grocery: Math.min(100, groceries.length * 25),
        gym: Math.min(100, gymPool.length * 20),
      }

      cache.current[neighborhoodId] = scores
      return scores
    },
    [placesService],
  )

  return { getScores }
}
