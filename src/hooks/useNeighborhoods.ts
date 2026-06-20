import { useState, useEffect } from 'react'
import type { NeighborhoodFeature } from '../types'

interface UseNeighborhoodsResult {
  neighborhoods: NeighborhoodFeature[]
  hoaZones: GeoJSON.Feature[]
  loading: boolean
  error: string | null
}

export function useNeighborhoods(): UseNeighborhoodsResult {
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodFeature[]>([])
  const [hoaZones, setHoaZones] = useState<GeoJSON.Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const base = import.meta.env.BASE_URL

    Promise.all([
      fetch(`${base}data/neighborhoods.geojson`).then(r => r.json()),
      fetch(`${base}data/hoa-zones.geojson`).then(r => r.json()),
    ])
      .then(([neighborhoodData, hoaData]: [GeoJSON.FeatureCollection, GeoJSON.FeatureCollection]) => {
        setNeighborhoods(neighborhoodData.features as NeighborhoodFeature[])
        setHoaZones(hoaData.features)
        setLoading(false)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load map data')
        setLoading(false)
      })
  }, [])

  return { neighborhoods, hoaZones, loading, error }
}
