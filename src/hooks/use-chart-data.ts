import { useMemo } from "react"
import { parseISO, format } from "date-fns"
import type { OpenMeteoRes, WMOCode } from "@/types"

// Extract "3 PM" from "2024-03-17T15:00" without any TZ conversion.
// Open-Meteo already returns times in the location's local timezone.
function hourLabel(timeStr: string): string {
  const h = parseInt(timeStr.substring(11, 13), 10)
  if (h === 0) return "12 AM"
  if (h === 12) return "12 PM"
  return h < 12 ? `${h} AM` : `${h - 12} PM`
}

export type HourlyPoint = {
  time: string
  label: string
  temp: number
  feelsLike: number
  precipProb: number
  precip: number
  windSpeed: number
  windDir: number
  windGust: number
  humidity: number
  dewPoint: number
  cloudCover: number
  pressure: number
  uvIndex: number
  visibility: number
  weatherCode: WMOCode
  isDay: 0 | 1
}

export type DailyPoint = {
  time: string
  label: string
  tempMax: number
  tempMin: number
  precipSum: number
  precipProbMax: number
  windSpeedMax: number
  uvIndexMax: number
  weatherCode: WMOCode
}

function mapHourly(h: OpenMeteoRes["hourly"], i: number): HourlyPoint {
  return {
    time: h.time[i],
    label: hourLabel(h.time[i]),
    temp: h.temperature_2m[i],
    feelsLike: h.apparent_temperature[i],
    precipProb: h.precipitation_probability[i],
    precip: h.precipitation[i],
    windSpeed: h.wind_speed_10m[i],
    windDir: h.wind_direction_10m[i],
    windGust: h.wind_gusts_10m?.[i] ?? 0,
    humidity: h.relative_humidity_2m?.[i] ?? 0,
    dewPoint: h.dew_point_2m?.[i] ?? 0,
    cloudCover: h.cloud_cover?.[i] ?? 0,
    pressure: h.pressure_msl?.[i] ?? 0,
    uvIndex: h.uv_index?.[i] ?? 0,
    visibility: (h.visibility?.[i] ?? 0) / 1000,
    weatherCode: h.weather_code[i],
    isDay: h.is_day[i],
  }
}

export function useChartData(weather: OpenMeteoRes | null) {
  const currentHourIndex = useMemo(() => {
    if (!weather) return 0
    const currentTime = weather.current.time.substring(0, 13)
    const idx = weather.hourly.time.findIndex((t) => t.startsWith(currentTime))
    return idx >= 0 ? idx : 0
  }, [weather])

  const hourly24 = useMemo(() => {
    if (!weather) return []
    const h = weather.hourly
    const end = Math.min(currentHourIndex + 24, h.time.length)
    return Array.from({ length: end - currentHourIndex }, (_, i) =>
      mapHourly(h, currentHourIndex + i)
    )
  }, [weather, currentHourIndex])

  const hourly48 = useMemo(() => {
    if (!weather) return []
    const h = weather.hourly
    const end = Math.min(currentHourIndex + 48, h.time.length)
    return Array.from({ length: end - currentHourIndex }, (_, i) =>
      mapHourly(h, currentHourIndex + i)
    )
  }, [weather, currentHourIndex])

  const daily = useMemo<DailyPoint[]>(() => {
    if (!weather) return []
    const d = weather.daily
    return d.time.map((time, i) => ({
      time,
      label: i === 0 ? "Today" : format(parseISO(time), "EEE"),
      tempMax: d.temperature_2m_max[i],
      tempMin: d.temperature_2m_min[i],
      precipSum: d.precipitation_sum[i],
      precipProbMax: d.precipitation_probability_max[i],
      windSpeedMax: d.wind_speed_10m_max[i],
      uvIndexMax: d.uv_index_max[i],
      weatherCode: d.weather_code[i],
    }))
  }, [weather])

  return { hourly24, hourly48, daily, currentHourIndex }
}
