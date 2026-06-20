export function geojsonCoordsToLatLng(
  geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon,
): google.maps.LatLngLiteral[][] {
  if (geometry.type === 'Polygon') {
    return geometry.coordinates.map(ring =>
      ring.map(([lng, lat]) => ({ lat, lng })),
    )
  }
  // MultiPolygon: flatten all rings from all polygons
  return geometry.coordinates.flatMap(polygon =>
    polygon.map(ring => ring.map(([lng, lat]) => ({ lat, lng }))),
  )
}

export function getPolygonCenter(
  geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon,
): google.maps.LatLngLiteral {
  const ring =
    geometry.type === 'Polygon'
      ? geometry.coordinates[0]
      : geometry.coordinates[0][0]

  const sum = ring.reduce(
    (acc, [lng, lat]) => ({ lat: acc.lat + lat, lng: acc.lng + lng }),
    { lat: 0, lng: 0 },
  )
  return { lat: sum.lat / ring.length, lng: sum.lng / ring.length }
}
