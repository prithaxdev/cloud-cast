import * as React from "react"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import L from "leaflet"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  MinusSignIcon,
  Navigation03Icon,
  FullScreenIcon,
  MinimizeIcon,
} from "@hugeicons/core-free-icons"
import { useWeather } from "@/hooks/use-weather"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

// ── Map view definitions ──────────────────────────────────────────────────────
type MapView = "street" | "satellite" | "terrain"

const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services"

const TILE_LAYERS: Record<
  MapView,
  {
    light: string
    dark: string
    labels?: { light: string; dark: string }
    label: string
    attribution: string
  }
> = {
  street: {
    // ESRI Canvas (gray base + label overlay) — free, no API key.
    // CARTO basemaps now return an "API KEY REQUIRED" tile without a key.
    light: `${ESRI}/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
    dark: `${ESRI}/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
    labels: {
      light: `${ESRI}/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}`,
      dark: `${ESRI}/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`,
    },
    label: "Map",
    attribution: "&copy; Esri, HERE, Garmin, OSM",
  },
  satellite: {
    // ESRI World Imagery — free, no API key
    light:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    dark: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    label: "Satellite",
    attribution: "&copy; Esri, Maxar, Earthstar Geographics",
  },
  terrain: {
    // ESRI World Topo Map — free, no API key
    light:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    dark: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    label: "Terrain",
    attribution: "&copy; Esri, HERE, Garmin, USGS, OSM",
  },
}

// ── Location pin ──────────────────────────────────────────────────────────────
const PIN_ICON = L.divIcon({
  className: "",
  html: `<div class="ccast-pin"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

// ── Inner helpers ─────────────────────────────────────────────────────────────
function MapCapture({
  mapRef,
}: {
  mapRef: React.MutableRefObject<L.Map | null>
}) {
  const map = useMap()
  React.useEffect(() => {
    mapRef.current = map
  }, [map, mapRef])
  return null
}

function MapFlyTo({ center }: { center: [number, number] }) {
  const map = useMap()
  const prev = React.useRef<[number, number]>(center)
  React.useEffect(() => {
    if (prev.current[0] !== center[0] || prev.current[1] !== center[1]) {
      map.flyTo(center, 12, { animate: true, duration: 1.2 })
      prev.current = center
    }
  }, [map, center])
  return null
}

// ── Main component ────────────────────────────────────────────────────────────
export const LocationMap = React.memo(function LocationMap({
  className,
}: {
  className?: string
}) {
  const { lat, lon, weather, geolocate, geolocating } = useWeather()
  const { theme } = useTheme()
  const mapRef = React.useRef<L.Map | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [mapView, setMapView] = React.useState<MapView>("street")

  React.useEffect(() => {
    const onChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
      setTimeout(() => mapRef.current?.invalidateSize(), 100)
    }
    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [])

  const toggleFullscreen = React.useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }, [])

  // Reactive dark-mode detection
  const [isDark, setIsDark] = React.useState(() =>
    document.documentElement.classList.contains("dark")
  )
  React.useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains("dark"))
    )
    obs.observe(document.documentElement, { attributeFilter: ["class"] })
    return () => obs.disconnect()
  }, [])

  void theme

  const layer = TILE_LAYERS[mapView]
  const tileUrl = isDark ? layer.dark : layer.light
  const labelsUrl = layer.labels && (isDark ? layer.labels.dark : layer.labels.light)

  const center: [number, number] = [lat, lon]

  const elevation = weather?.elevation
  const tzAbbr = weather?.timezone_abbreviation ?? ""
  const timezone = weather?.timezone ?? ""
  const latStr = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}`
  const lonStr = `${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? "E" : "W"}`

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative isolate overflow-hidden rounded-2xl border border-border bg-card [&:fullscreen]:h-screen [&:fullscreen]:rounded-none [&:fullscreen]:border-0",
        className
      )}
    >
      {/* ── Map ── */}
      <MapContainer
        center={center}
        zoom={12}
        zoomControl={false}
        scrollWheelZoom={false}
        attributionControl
        className="h-full w-full"
      >
        <TileLayer key={tileUrl} url={tileUrl} attribution={layer.attribution} />
        {labelsUrl && <TileLayer key={labelsUrl} url={labelsUrl} />}
        <Marker position={center} icon={PIN_ICON} />
        <MapCapture mapRef={mapRef} />
        <MapFlyTo center={center} />
      </MapContainer>

      {/* ── Bottom scrim, a tone shift within the card color ── */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[650] h-24 bg-gradient-to-t from-card via-card/80 to-transparent" />

      {/* ── Bottom readout ── */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-[651] max-w-[85%] px-4 pb-6 font-mono text-xs">
        <p className="tabular-nums text-foreground">
          {latStr}&ensp;{lonStr}
        </p>
        <p className="mt-0.5 truncate text-muted-foreground">
          {[
            elevation !== undefined ? `${Math.round(elevation)} m` : null,
            timezone,
            tzAbbr,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>

      {/* ── View switcher (top-left) ── */}
      <div className="absolute top-2 left-2 z-[1000] flex rounded-lg border border-border bg-card p-0.5 shadow-[0_1px_2px_rgb(0_0_0/0.08)]">
        {(["street", "satellite", "terrain"] as MapView[]).map((view) => (
          <button
            key={view}
            onClick={() => setMapView(view)}
            aria-pressed={mapView === view}
            className={cn(
              "h-7 rounded-md px-2.5 text-xs font-medium transition-colors duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              mapView === view
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {TILE_LAYERS[view].label}
          </button>
        ))}
      </div>

      {/* ── Top-right controls ── */}
      <div className="absolute top-2 right-2 z-[1000] flex flex-col gap-2">
        <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-[0_1px_2px_rgb(0_0_0/0.08)]">
          <button onClick={() => mapRef.current?.zoomIn()} aria-label="Zoom in" className="flex size-8 items-center justify-center text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
            <HugeiconsIcon icon={Add01Icon} className="size-4" />
          </button>
          <div className="h-px bg-border" />
          <button onClick={() => mapRef.current?.zoomOut()} aria-label="Zoom out" className="flex size-8 items-center justify-center text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
            <HugeiconsIcon icon={MinusSignIcon} className="size-4" />
          </button>
        </div>
        <button
          onClick={geolocate}
          disabled={geolocating}
          title="Use my location"
          aria-label="Use my location"
          className="flex size-8 items-center justify-center text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none rounded-lg border border-border bg-card shadow-[0_1px_2px_rgb(0_0_0/0.08)] disabled:opacity-50"
        >
          <HugeiconsIcon icon={Navigation03Icon} className="size-4" />
        </button>
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit full screen" : "Full screen"}
          aria-label={isFullscreen ? "Exit full screen" : "Full screen"}
          className="flex size-8 items-center justify-center text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none rounded-lg border border-border bg-card shadow-[0_1px_2px_rgb(0_0_0/0.08)]"
        >
          <HugeiconsIcon icon={isFullscreen ? MinimizeIcon : FullScreenIcon} className="size-4" />
        </button>
      </div>
    </div>
  )
})
