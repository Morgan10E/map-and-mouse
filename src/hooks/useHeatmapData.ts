import { useEffect, useState } from 'react'
import { TEMPERATURE_NORMALS } from '../data/temperatureNormals'

export type TreePoint = { position: [number, number] }
export type TempPoint = { position: [number, number]; tmean: number; tmax: number }

interface HeatmapData {
  treePoints: TreePoint[]
  tempPoints: TempPoint[]
  treeLoading: boolean
  treeError: string | null
}

// Bounding box for the four target neighborhoods
const BBOX = {
  latMin: 47.59, latMax: 47.65,
  lngMin: -122.35, lngMax: -122.275,
}

const SDOT_TREES_URL =
  `https://data.seattle.gov/resource/gapw-b2rf.json` +
  `?$where=latitude>${BBOX.latMin}+AND+latitude<${BBOX.latMax}` +
  `+AND+longitude>${BBOX.lngMin}+AND+longitude<${BBOX.lngMax}` +
  `&$limit=8000` +
  `&$select=latitude,longitude`

export function useHeatmapData(): HeatmapData {
  const [treePoints, setTreePoints] = useState<TreePoint[]>([])
  const [treeLoading, setTreeLoading] = useState(true)
  const [treeError, setTreeError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setTreeLoading(true)
    setTreeError(null)

    fetch(SDOT_TREES_URL)
      .then(r => {
        if (!r.ok) throw new Error(`SDOT Trees API: ${r.status} ${r.statusText}`)
        return r.json() as Promise<Array<{ latitude: string; longitude: string }>>
      })
      .then(rows => {
        if (cancelled) return
        const pts: TreePoint[] = rows
          .map(row => {
            const lat = parseFloat(row.latitude)
            const lng = parseFloat(row.longitude)
            return isNaN(lat) || isNaN(lng) ? null : { position: [lng, lat] as [number, number] }
          })
          .filter((p): p is TreePoint => p !== null)
        setTreePoints(pts)
        setTreeLoading(false)
      })
      .catch(err => {
        if (cancelled) return
        setTreeError(err.message)
        setTreeLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  const tempPoints: TempPoint[] = TEMPERATURE_NORMALS.map(p => ({
    position: [p.lng, p.lat],
    tmean: p.tmean,
    tmax: p.tmax,
  }))

  return { treePoints, tempPoints, treeLoading, treeError }
}
