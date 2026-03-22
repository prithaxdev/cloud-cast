# Cloud Cast

A production-grade weather dashboard built with React 19, Tailwind CSS 4, and the Open-Meteo API. Features real-time forecasts, interactive charts, a location map, and full light/dark theming - with zero API keys required.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2-06B6D4?style=flat&logo=tailwindcss) ![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=flat&logo=vite)

---

## Features

- **Current conditions** - temperature, apparent temperature, humidity, wind speed, UV index, dew point, visibility, cloud cover, pressure
- **7-day daily forecast** - high/low temps, precipitation probability, weather condition icons
- **24-hour hourly forecast** - tabular view with all key metrics
- **48-hour charts** - interactive Recharts graphs for temperature, precipitation, wind, visibility, and cloud cover
- **Location map** - interactive Leaflet map centered on the selected location
- **Location search** - debounced geocoding via the Open-Meteo Geocoding API
- **Geolocation** - one-click browser geolocation with reverse geocoding via Nominatim
- **Unit toggle** - switch between Celsius/m/s and Fahrenheit/mph
- **Theme switcher** - light, dark, and system modes; press `D` to toggle
- **Persistent state** - location, unit, and theme survive page reload via localStorage

### Smart features

- **Day Score** - a 0–100 livability score computed from temperature comfort, precipitation probability, wind, UV, and sky conditions; displayed as a color-coded progress bar in the hero card (Excellent → Rough)
- **Feels-Like Explainer** - the apparent temperature pill now shows *why* it differs from the actual temp: Wind chill, Humidity, Dry air, Solar gain, Cooler out, or Warmer out — unit-aware for both °C and °F
- **Best Time for Activities** - scans the next 18 hours and surfaces the optimal 2-hour window for Running, Cycling, Outdoor Dining, and Photography; each activity has its own weighted scoring model; hidden automatically on days with no viable windows
- **Contextual Weather Insights** - up to 3 situation-aware cards shown below the hero, covering 20+ conditions across four priority tiers: critical alerts (thunderstorm, extreme heat/cold, heavy rain, blizzard), noteworthy weather (rain, snow, fog, high wind, muggy, UV), ambient conditions (clear day, frost, stargazing, rain likely later), and time-based moments (golden hour, blue hour, weekend days) — with compound merges like "Sunny Sunday"

---

## Tech Stack

| Category | Library | Version |
|---|---|---|
| Framework | React | 19.2 |
| Language | TypeScript | 5.9 |
| Build | Vite | 7.3 |
| Styling | Tailwind CSS | 4.2 |
| Headless UI | Base UI React | 1.3 |
| Icons | Hugeicons | 4.0 |
| Charts | Recharts | 3.8 |
| Maps | Leaflet + React-Leaflet | 1.9 / 5.0 |
| HTTP | Axios | 1.13 |
| Dates | date-fns | 4.1 |
| Variants | class-variance-authority | 0.7 |

---

## Architecture

```
src/
├── api/                  # Axios instances (Open-Meteo forecast + geocoding)
├── assets/               # Logo SVG component
├── components/
│   ├── charts/           # Recharts chart wrappers (temperature, precipitation, wind, …)
│   ├── dashboard/        # Dashboard shell, hero, daily strip, hourly tab, charts tab, map, insights, activity windows
│   └── ui/               # Headless Base UI components (button, dialog, tabs, dropdown, …)
├── config/               # App constants, API defaults, localStorage keys
├── hooks/
│   ├── use-weather.ts    # Context consumer — access WeatherProvider state anywhere
│   ├── use-chart-data.ts # Transforms raw API response into chart-ready series
│   ├── use-geocoding.ts  # Debounced location search
│   └── use-debounce.ts   # Generic debounce primitive
├── lib/
│   ├── wmo.ts            # WMO weather code → label, icon pair, accent color
│   └── utils.ts          # cn() — Tailwind class merge utility
├── types/                # Shared TypeScript types (OpenMeteoRes, GeocodingResult, …)
└── App.tsx               # Root — lazy-loads Dashboard behind Suspense
```

### Data flow

```
ThemeProvider
  └── WeatherProvider  (fetches forecast on lat/lon/unit change, persists to localStorage)
        └── App
              ├── TopBar
              │     ├── SearchDialog  →  useGeocoding()  →  setLocation()
              │     ├── GeolocateButton  →  geolocate()
              │     ├── ThemeDropdown  →  setTheme()
              │     └── UnitDropdown  →  setUnit()
              │
              └── Dashboard  (lazy)
                    ├── useWeather()      raw API state
                    ├── useChartData()    memoized chart series
                    ├── HeroSection       current conditions + WMO icon + day score + feels-like explainer
                    ├── WeatherInsights   contextual situation cards (20+ conditions, priority-sorted)
                    ├── LocationMap       Leaflet map  (lazy)
                    ├── DailyStrip        7-day cards
                    ├── ActivityWindows   best 2-hour activity windows from hourly forecast
                    └── Tabs
                          ├── HourlyTab   24-hour table
                          └── ChartsTab   48-hour Recharts graphs
```

### State management

No Redux or Zustand. Global state lives in `WeatherProvider` via React Context. All user preferences (coordinates, unit, location name) are persisted to `localStorage` and rehydrated on mount. `startTransition` is used for non-urgent unit updates to keep the UI responsive.

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9

### Installation

```bash
git clone https://github.com/prithaxdev/cloud-cast.git
cd cloud-cast
pnpm install
pnpm dev
```

The app runs on `http://localhost:5173` with no environment variables required - Open-Meteo is a fully free, no-auth API.

### Build

```bash
pnpm build       # type-check + Vite production build → dist/
pnpm preview     # preview the production build locally
```

---

## API

All weather data is sourced from [Open-Meteo](https://open-meteo.com) — open-source, free, and no API key required.

| Endpoint | Purpose |
|---|---|
| `api.open-meteo.com/v1/forecast` | Current, hourly (168h), and daily (7d) weather |
| `geocoding-api.open-meteo.com/v1/search` | Forward geocoding for location search |
| `nominatim.openstreetmap.org/reverse` | Reverse geocoding from coordinates |

The forecast request fetches the full set of hourly and daily variables in a single call. `useChartData` then slices the 168-hour response into a 24-hour window (hourly tab) and a 48-hour window (charts tab) relative to the current hour index.

---

## WMO Weather Codes

Weather conditions are decoded from [WMO code table 4677](https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM) defined in `src/lib/wmo.ts`. Each code resolves to:

- A human-readable label (e.g. `"Moderate rain"`)
- A day icon and night icon (Hugeicons)
- An accent color in `oklch` for chart and badge coloring

---

## Theming

Tailwind CSS 4 with OKLch color space for perceptually uniform, accessible color palettes. CSS custom properties are scoped to `:root` (light) and `.dark`, toggled by `ThemeProvider` on the `<html>` element.

```css
/* Light */
--background: oklch(1 0 0);
--foreground: oklch(0.153 0.006 107.1);

/* Dark */
--background: oklch(0.153 0.006 107.1);
--foreground: oklch(0.988 0.003 106.5);
```

Press `D` anywhere in the app to cycle the theme. The shortcut is blocked inside input elements.

---

## Performance Notes

- **Lazy loading** — `Dashboard` and `LocationMap` are loaded with `React.lazy()` + `Suspense`. Initial bundle only includes the shell and TopBar.
- **Memoization** — `Dashboard` and `HeroSection` are wrapped in `React.memo`. Chart series are computed with `useMemo` in `useChartData`.
- **Debouncing** — Geocoding search requests are debounced at 400 ms.
- **Stale update prevention** — Both `useWeather` and `useGeocoding` use a `cancelled` flag pattern to discard async results from superseded requests.
- **`startTransition`** — Unit changes are wrapped in `startTransition` to defer the expensive re-render of chart series.

---
