// Static lat/lng points for repellant overlays.
// Freeway points are sampled every ~400m along I-5, I-90, SR-99, and SR-520
// through the Capitol Hill / Central District / Montlake corridor.
// Each point gets a circle with radius = OVERLAY_CONFIG.freeway.radius.

export const FREEWAY_POINTS: google.maps.LatLngLiteral[] = [
  // I-5 (lng ≈ -122.322), running north–south through Capitol Hill
  { lat: 47.570, lng: -122.322 },
  { lat: 47.574, lng: -122.322 },
  { lat: 47.578, lng: -122.322 },
  { lat: 47.582, lng: -122.322 },
  { lat: 47.586, lng: -122.322 },
  { lat: 47.590, lng: -122.322 },
  { lat: 47.594, lng: -122.321 },
  { lat: 47.598, lng: -122.321 },
  { lat: 47.602, lng: -122.321 },
  { lat: 47.606, lng: -122.322 },
  { lat: 47.610, lng: -122.322 },
  { lat: 47.614, lng: -122.323 },
  { lat: 47.618, lng: -122.324 },
  { lat: 47.622, lng: -122.325 },
  { lat: 47.626, lng: -122.325 },
  { lat: 47.630, lng: -122.324 },
  { lat: 47.634, lng: -122.322 },
  { lat: 47.638, lng: -122.320 },
  { lat: 47.642, lng: -122.318 },
  { lat: 47.646, lng: -122.317 },
  { lat: 47.650, lng: -122.317 },

  // I-90 (lat ≈ 47.595), running east–west through the Central District
  { lat: 47.595, lng: -122.330 },
  { lat: 47.595, lng: -122.322 },
  { lat: 47.596, lng: -122.314 },
  { lat: 47.596, lng: -122.306 },
  { lat: 47.595, lng: -122.298 },
  { lat: 47.594, lng: -122.290 },
  { lat: 47.592, lng: -122.282 },
  { lat: 47.590, lng: -122.274 },

  // SR-520 (lat ≈ 47.641), running east–west through Montlake
  { lat: 47.641, lng: -122.312 },
  { lat: 47.641, lng: -122.305 },
  { lat: 47.642, lng: -122.298 },
  { lat: 47.642, lng: -122.291 },
  { lat: 47.641, lng: -122.284 },
  { lat: 47.640, lng: -122.277 },
  { lat: 47.639, lng: -122.270 },

  // SR-99 / Battery Street (lng ≈ -122.342), running north–south west of Capitol Hill
  { lat: 47.594, lng: -122.342 },
  { lat: 47.598, lng: -122.343 },
  { lat: 47.602, lng: -122.345 },
  { lat: 47.606, lng: -122.346 },
  { lat: 47.610, lng: -122.347 },
  { lat: 47.614, lng: -122.347 },
  { lat: 47.618, lng: -122.346 },
  { lat: 47.622, lng: -122.345 },
  { lat: 47.626, lng: -122.344 },
]

export const SEWAGE_POINTS: google.maps.LatLngLiteral[] = [
  // West Point Wastewater Treatment Plant (Discovery Park, Magnolia)
  { lat: 47.6583, lng: -122.4035 },
]
