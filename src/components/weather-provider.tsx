import * as React from "react"
import { startTransition } from "react"
import { weatherApi } from "@/api"
import { APP, WEATHER_API } from "@/config"
import type { GeocodingResult, OpenMeteoRes } from "@/types"

export type WeatherUnit = "celsius" | "fahrenheit"

type WeatherProviderState = {
  lat: number
  lon: number
  unit: WeatherUnit
  weather: OpenMeteoRes | null
  location: GeocodingResult | null
  loading: boolean
  geolocating: boolean
  setUnit: (unit: WeatherUnit) => void
  setLocation: (location: GeocodingResult) => void
  geolocate: () => void
}

const WeatherContext = React.createContext<WeatherProviderState | undefined>(
  undefined
)

async function reverseGeocode(lat: number, lon: number): Promise<GeocodingResult> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
    { headers: { "Accept-Language": "en" } }
  )
  const data = await res.json()
  const address = data.address ?? {}
  const name =
    address.city ??
    address.town ??
    address.village ??
    address.municipality ??
    address.county ??
    "Current Location"
  return {
    id: 0,
    name,
    latitude: lat,
    longitude: lon,
    elevation: 0,
    country: address.country ?? "",
    country_code: (address.country_code ?? "").toUpperCase(),
    admin1: address.state,
    admin2: address.county,
    timezone: "auto",
  }
}

export function WeatherProvider({ children }: React.PropsWithChildren) {
  const [lat, setLat] = React.useState(() => {
    const stored = localStorage.getItem(APP.STORE_KEY.LAT)
    return stored ? parseFloat(stored) : WEATHER_API.DEFAULTS.LAT
  })
  const [lon, setLon] = React.useState(() => {
    const stored = localStorage.getItem(APP.STORE_KEY.LON)
    return stored ? parseFloat(stored) : WEATHER_API.DEFAULTS.LON
  })
  const [unit, setUnitState] = React.useState<WeatherUnit>(() => {
    const stored = localStorage.getItem(APP.STORE_KEY.UNIT)
    return (stored as WeatherUnit) ?? WEATHER_API.DEFAULTS.TEMPERATURE_UNIT
  })
  const [weather, setWeather] = React.useState<OpenMeteoRes | null>(null)
  const [location, setLocationState] = React.useState<GeocodingResult | null>(
    () => {
      const stored = localStorage.getItem(APP.STORE_KEY.LOCATION)
      return stored ? (JSON.parse(stored) as GeocodingResult) : null
    }
  )
  const [loading, setLoading] = React.useState(false)
  const [geolocating, setGeolocating] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    setLoading(true)

    weatherApi
      .get<OpenMeteoRes>("/forecast", {
        params: {
          latitude: lat,
          longitude: lon,
          temperature_unit: unit,
          wind_speed_unit:
            unit === "celsius" ? WEATHER_API.DEFAULTS.WIND_SPEED_UNIT : "mph",
          timezone: WEATHER_API.DEFAULTS.TIMEZONE,
          current: [
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "is_day",
            "precipitation",
            "rain",
            "showers",
            "snowfall",
            "weather_code",
            "cloud_cover",
            "pressure_msl",
            "surface_pressure",
            "wind_speed_10m",
            "wind_direction_10m",
            "wind_gusts_10m",
            "visibility",
            "uv_index",
            "dew_point_2m",
          ].join(","),
          hourly: [
            "temperature_2m",
            "apparent_temperature",
            "precipitation_probability",
            "precipitation",
            "rain",
            "snowfall",
            "weather_code",
            "wind_speed_10m",
            "wind_direction_10m",
            "is_day",
            "visibility",
            "uv_index",
            "cloud_cover",
            "pressure_msl",
            "dew_point_2m",
            "relative_humidity_2m",
            "wind_gusts_10m",
          ].join(","),
          daily: [
            "weather_code",
            "temperature_2m_max",
            "temperature_2m_min",
            "apparent_temperature_max",
            "apparent_temperature_min",
            "sunrise",
            "sunset",
            "precipitation_sum",
            "rain_sum",
            "snowfall_sum",
            "precipitation_probability_max",
            "wind_speed_10m_max",
            "wind_gusts_10m_max",
            "wind_direction_10m_dominant",
            "uv_index_max",
          ].join(","),
        },
      })
      .then((res) => {
        if (!cancelled) setWeather(res.data)
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [lat, lon, unit])

  const setUnit = React.useCallback((next: WeatherUnit) => {
    localStorage.setItem(APP.STORE_KEY.UNIT, next)
    startTransition(() => setUnitState(next))
  }, [])

  const setLocation = React.useCallback((loc: GeocodingResult) => {
    localStorage.setItem(APP.STORE_KEY.LAT, String(loc.latitude))
    localStorage.setItem(APP.STORE_KEY.LON, String(loc.longitude))
    localStorage.setItem(APP.STORE_KEY.LOCATION, JSON.stringify(loc))
    setLat(loc.latitude)
    setLon(loc.longitude)
    setLocationState(loc)
  }, [])

  const geolocate = React.useCallback(() => {
    if (!navigator.geolocation || geolocating) return
    setGeolocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        reverseGeocode(latitude, longitude)
          .then((loc) => setLocation(loc))
          .catch(() => {
            // Coords still usable without a name
            localStorage.setItem(APP.STORE_KEY.LAT, String(latitude))
            localStorage.setItem(APP.STORE_KEY.LON, String(longitude))
            setLat(latitude)
            setLon(longitude)
          })
          .finally(() => setGeolocating(false))
      },
      () => setGeolocating(false),
      { timeout: 10_000 }
    )
  }, [geolocating, setLocation])

  // Auto-geolocate on first visit (no stored coords)
  const didAutoGeolocate = React.useRef(false)
  React.useEffect(() => {
    if (didAutoGeolocate.current) return
    didAutoGeolocate.current = true
    const hasStored = localStorage.getItem(APP.STORE_KEY.LAT)
    if (!hasStored) geolocate()
  }, [geolocate])

  const value = React.useMemo(
    () => ({
      lat,
      lon,
      unit,
      weather,
      location,
      loading,
      geolocating,
      setUnit,
      setLocation,
      geolocate,
    }),
    [lat, lon, unit, weather, location, loading, geolocating, setUnit, setLocation, geolocate]
  )

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  )
}

export function useWeatherContext() {
  const context = React.useContext(WeatherContext)
  if (!context)
    throw new Error("useWeatherContext must be used within WeatherProvider")
  return context
}
