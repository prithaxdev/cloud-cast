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
import { getWMOInfo } from "@/lib/wmo"

// ── Map view definitions ──────────────────────────────────────────────────────
type MapView = "street" | "satellite" | "terrain"

const TILE_LAYERS: Record<
  MapView,
  { light: string; dark: string; label: string; attribution: string }
> = {
  street: {
    light:
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    label: "Map",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  satellite: {
    // ESRI World Imagery — free, no API key
    light:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    dark: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    label: "Satellite",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP",
  },
  terrain: {
    // ESRI World Topo Map — free, no API key
    light:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    dark: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    label: "Terrain",
    attribution:
      "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China",
  },
}

// ── Pulsing divIcon ───────────────────────────────────────────────────────────
function createPulseIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div class="ccast-marker" style="--accent-color:${color}">
      <div class="ccast-ring ccast-ring-a"></div>
      <div class="ccast-ring ccast-ring-b"></div>
      <div class="ccast-dot"></div>
    </div>`,
    iconSize: [56, 56],
    iconAnchor: [28, 28],
  })
}

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
export const LocationMap = React.memo(function LocationMap() {
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

  const wmoColor = weather
    ? getWMOInfo(weather.current.weather_code, weather.current.is_day).color
    : "#60A5FA"

  const icon = React.useMemo(() => createPulseIcon(wmoColor), [wmoColor])
  const center: [number, number] = [lat, lon]

  const elevation = weather?.elevation
  const tzAbbr = weather?.timezone_abbreviation ?? ""
  const timezone = weather?.timezone ?? ""
  const latStr = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}`
  const lonStr = `${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? "E" : "W"}`

  return (
    <div
      ref={containerRef}
      className="group relative h-[220px] overflow-hidden rounded-2xl border border-border/50 bg-card md:h-[256px] [&:fullscreen]:h-screen [&:fullscreen]:rounded-none [&:fullscreen]:border-0"
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
        <Marker position={center} icon={icon} />
        <MapCapture mapRef={mapRef} />
        <MapFlyTo center={center} />
      </MapContainer>

      {/* ── Edge fades ── */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-card/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card via-card/70 to-transparent" />

      {/* ── Bottom info bar ── */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 px-4 pb-3">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[11px] tabular-nums text-foreground/60">
              {latStr}
            </span>
            <span className="text-[10px] text-border">·</span>
            <span className="font-mono text-[11px] tabular-nums text-foreground/60">
              {lonStr}
            </span>
          </div>
          {timezone && (
            <span className="font-mono text-[10px] text-muted-foreground/50">
              {timezone}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 pb-0.5">
          {elevation !== undefined && (
            <span className="font-mono text-[11px] text-foreground/50">
              ▲ {Math.round(elevation)}m
            </span>
          )}
          {tzAbbr && (
            <span className="rounded-md border border-border/40 bg-background/50 px-1.5 py-0.5 font-mono text-[10px] text-foreground/60 backdrop-blur-sm">
              {tzAbbr}
            </span>
          )}
        </div>
      </div>

      {/* ── View switcher (top-left) ── */}
      <div className="absolute left-3 top-3 z-[400] flex overflow-hidden rounded-xl border border-border/50 bg-background/80 shadow-sm backdrop-blur-sm">
        {(["street", "satellite", "terrain"] as MapView[]).map((view, i, arr) => (
          <React.Fragment key={view}>
            <button
              onClick={() => setMapView(view)}
              title={TILE_LAYERS[view].label}
              className={`px-3 py-1.5 text-[11px] font-medium transition-colors ${
                mapView === view
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              {TILE_LAYERS[view].label}
            </button>
            {i < arr.length - 1 && (
              <div className="my-1.5 w-px bg-border/50" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── Top-right controls ── */}
      <div className="absolute right-3 top-3 z-[400] flex flex-col gap-1.5">
        {/* Zoom */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-border/50 bg-background/80 shadow-sm backdrop-blur-sm">
          <button
            onClick={() => mapRef.current?.zoomIn()}
            className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            <HugeiconsIcon icon={Add01Icon} className="size-3.5" />
          </button>
          <div className="mx-1.5 h-px bg-border/50" />
          <button
            onClick={() => mapRef.current?.zoomOut()}
            className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            <HugeiconsIcon icon={MinusSignIcon} className="size-3.5" />
          </button>
        </div>

        {/* Geolocate */}
        <button
          onClick={geolocate}
          disabled={geolocating}
          title="Use my location"
          className="flex size-8 items-center justify-center rounded-xl border border-border/50 bg-background/80 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-muted/50 hover:text-foreground disabled:opacity-50"
        >
          <HugeiconsIcon
            icon={Navigation03Icon}
            className={`size-3.5 ${geolocating ? "animate-pulse text-primary" : ""}`}
          />
        </button>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          className="flex size-8 items-center justify-center rounded-xl border border-border/50 bg-background/80 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-muted/50 hover:text-foreground"
        >
          <HugeiconsIcon
            icon={isFullscreen ? MinimizeIcon : FullScreenIcon}
            className="size-3.5"
          />
        </button>
      </div>
    </div>
  )
})
