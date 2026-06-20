# Seattle Neighborhood Explorer

Interactive map scoring Seattle neighborhoods (Montlake, Madison Valley, Central District, Capitol Hill) across livability criteria: walkability, transit, parks, restaurants, grocery access, gym/pool, proximity to freeways, and rain shadow weather.

## Local Development

### Prerequisites
- Node 20+
- A Google Maps API key with **Maps JavaScript API** and **Places API** enabled

### Setup

```bash
npm install
cp .env.example .env
# Edit .env and set your API key
npm run dev
```

Open `http://localhost:5173/map-and-mouse/`.

> **Note**: The GeoJSON files are loaded via `fetch`, so you must use the dev server (`npm run dev`). Opening `index.html` directly from the filesystem will fail due to browser CORS restrictions.

### Build

```bash
npm run build   # TypeScript check + Vite build → dist/
npm run preview # Preview the production build locally
```

## Deployment (GitHub Pages)

### One-time GitHub secret setup

1. In [Google Cloud Console](https://console.cloud.google.com/), create an API key and restrict it:
   - **APIs**: Maps JavaScript API, Places API
   - **HTTP referrers**: `https://Morgan10E.github.io/*`
2. In this repo: **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `GOOGLE_MAPS_API_KEY`
   - Value: your API key

### Auto-deploy

Push to `main` — GitHub Actions builds the project and deploys `dist/` to the `gh-pages` branch automatically.

Enable GitHub Pages in **Settings → Pages → Source: Deploy from branch → gh-pages → / (root)**.

Live URL: `https://Morgan10E.github.io/map-and-mouse/`

## Updating neighborhood data

- **Polygon boundaries**: Edit `public/data/neighborhoods.geojson`. Replace approximate bounding boxes with precise boundaries from the [City of Seattle Open Data portal](https://data.seattle.gov).
- **Static scores**: Edit `src/data/staticScores.ts`. Scores are integers 0–100 for: `freeway`, `trees`, `park`, `transit`, `weather`.
- **HOA zones**: Add polygon features to `public/data/hoa-zones.geojson` — they render as neutral outlines automatically.

## Architecture

```
src/
├── App.tsx              # Top-level state: apiKey, filters, activeNeighborhood
├── components/
│   ├── Hero.tsx         # Header + neighborhood color legend
│   ├── ApiKeyBanner.tsx # Shown when no API key is available (local dev fallback)
│   ├── FilterBar.tsx    # Criterion toggle checkboxes
│   ├── MapView.tsx      # Google Maps, polygon rendering, Places API queries
│   ├── Sidebar.tsx      # Score breakdown panel
│   └── ScoreBar.tsx     # Score visualization bar
├── hooks/
│   ├── useNeighborhoods.ts  # Fetches GeoJSON files
│   └── usePlacesScores.ts   # Places API queries with per-neighborhood cache
├── utils/
│   ├── scoring.ts       # computeWeightedScore, scoreToColor
│   └── geojson.ts       # GeoJSON → google.maps coordinate conversion
├── data/
│   └── staticScores.ts  # Researcher-assigned scores for non-live criteria
└── types/index.ts       # Shared TypeScript types
```
