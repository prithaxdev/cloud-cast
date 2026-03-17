// WMO Weather interpretation codes used by Open-Meteo
export type WMOCode =
  | 0 // Clear sky
  | 1 // Mainly clear
  | 2 // Partly cloudy
  | 3 // Overcast
  | 45 // Fog
  | 48 // Depositing rime fog
  | 51 // Drizzle: light
  | 53 // Drizzle: moderate
  | 55 // Drizzle: dense
  | 56 // Freezing drizzle: light
  | 57 // Freezing drizzle: heavy
  | 61 // Rain: slight
  | 63 // Rain: moderate
  | 65 // Rain: heavy
  | 66 // Freezing rain: light
  | 67 // Freezing rain: heavy
  | 71 // Snow: slight
  | 73 // Snow: moderate
  | 75 // Snow: heavy
  | 77 // Snow grains
  | 80 // Rain showers: slight
  | 81 // Rain showers: moderate
  | 82 // Rain showers: violent
  | 85 // Snow showers: slight
  | 86 // Snow showers: heavy
  | 95 // Thunderstorm: slight or moderate
  | 96 // Thunderstorm with slight hail
  | 99 // Thunderstorm with heavy hail

export interface CurrentWeather {
  time: string
  interval: number
  temperature_2m: number
  relative_humidity_2m: number
  apparent_temperature: number
  is_day: 0 | 1
  precipitation: number
  rain: number
  showers: number
  snowfall: number
  weather_code: WMOCode
  cloud_cover: number
  pressure_msl: number
  surface_pressure: number
  wind_speed_10m: number
  wind_direction_10m: number
  wind_gusts_10m: number
  visibility?: number
  uv_index?: number
  dew_point_2m?: number
}

export interface HourlyForecast {
  time: string[]
  temperature_2m: number[]
  apparent_temperature: number[]
  precipitation_probability: number[]
  precipitation: number[]
  rain: number[]
  snowfall: number[]
  weather_code: WMOCode[]
  wind_speed_10m: number[]
  wind_direction_10m: number[]
  is_day: (0 | 1)[]
  visibility?: number[]
  uv_index?: number[]
}

export interface DailyForecast {
  time: string[]
  weather_code: WMOCode[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  apparent_temperature_max: number[]
  apparent_temperature_min: number[]
  sunrise: string[]
  sunset: string[]
  precipitation_sum: number[]
  rain_sum: number[]
  snowfall_sum: number[]
  precipitation_probability_max: number[]
  wind_speed_10m_max: number[]
  wind_gusts_10m_max: number[]
  wind_direction_10m_dominant: number[]
  uv_index_max: number[]
}

export interface OpenMeteoRes {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  current_units: Record<string, string>
  current: CurrentWeather
  hourly_units: Record<string, string>
  hourly: HourlyForecast
  daily_units: Record<string, string>
  daily: DailyForecast
}

export interface GeocodingResult {
  id: number
  name: string
  latitude: number
  longitude: number
  elevation: number
  state?: string
  country_code: string
  country: string
  admin1?: string
  admin2?: string
  timezone: string
  population?: number
}

export interface GeocodingRes {
  results?: GeocodingResult[]
  generationtime_ms: number
}

export type WeatherTimezone = {
  timezone: string
  offset: number
}
