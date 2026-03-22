import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Location01Icon,
  SunriseIcon,
  SunsetIcon,
  HumidityIcon,
  FastWindIcon,
  Sun01Icon,
  TemperatureIcon,
} from "@hugeicons/core-free-icons"
import { useWeather } from "@/hooks/use-weather"
import { getWMOInfo, getUVLevel, windDirection } from "@/lib/wmo"
import { StatPill } from "./stat-pill"

// Parse "YYYY-MM-DDTHH:MM" (already in location's local time) → "6:45 AM"
function localTimeToAmPm(isoStr: string): string {
  const timePart = isoStr.substring(11, 16) // "HH:MM"
  const [hStr, mStr] = timePart.split(":")
  const h = parseInt(hStr, 10)
  const period = h >= 12 ? "PM" : "AM"
  const h12 = h % 12 || 12
  return `${h12}:${mStr} ${period}`
}

function feelsLikeReason(
  temp: number,
  apparent: number,
  wind: number,
  humidity: number,
  uv: number,
  isDay: boolean,
  isCelsius: boolean
): string {
  const delta = apparent - temp
  const windThreshold = isCelsius ? 20 : 12
  const deltaThreshold = isCelsius ? 3 : 5

  if (Math.abs(delta) < (isCelsius ? 1.5 : 2.5)) return "Feels Like"
  if (delta <= -deltaThreshold && wind > windThreshold) return "Feels Like · Wind chill"
  if (delta >= deltaThreshold && humidity > 70) return "Feels Like · Humidity"
  if (delta <= -deltaThreshold && humidity < 35) return "Feels Like · Dry air"
  if (isDay && uv > 5 && delta >= deltaThreshold) return "Feels Like · Solar gain"
  if (delta < 0) return "Feels Like · Cooler out"
  return "Feels Like · Warmer out"
}

type ScoreResult = {
  label: string
  color: string
}

function computeDayScore(
  apparentTemp: number,
  precipProbMax: number,
  weatherCode: number,
  windSpeed: number,
  uvIndex: number,
  isDay: 0 | 1,
  isCelsius: boolean
): { score: number; result: ScoreResult } {
  // Temperature comfort (0–30 pts)
  let tempPts: number
  if (isCelsius) {
    if (apparentTemp >= 18 && apparentTemp <= 24) tempPts = 30
    else if (apparentTemp >= 10 && apparentTemp <= 30) tempPts = 18
    else if (apparentTemp >= 2 && apparentTemp <= 35) tempPts = 8
    else tempPts = 0
  } else {
    if (apparentTemp >= 64 && apparentTemp <= 75) tempPts = 30
    else if (apparentTemp >= 50 && apparentTemp <= 86) tempPts = 18
    else if (apparentTemp >= 35 && apparentTemp <= 95) tempPts = 8
    else tempPts = 0
  }

  // Precipitation (0–25 pts)
  let precipPts: number
  if (precipProbMax <= 10) precipPts = 25
  else if (precipProbMax <= 25) precipPts = 20
  else if (precipProbMax <= 50) precipPts = 12
  else if (precipProbMax <= 70) precipPts = 5
  else precipPts = 0
  if (weatherCode >= 51) precipPts = Math.max(0, precipPts - 10)

  // Wind (0–20 pts)
  let windPts: number
  if (isCelsius) {
    if (windSpeed <= 15) windPts = 20
    else if (windSpeed <= 30) windPts = 15
    else if (windSpeed <= 50) windPts = 8
    else if (windSpeed <= 70) windPts = 3
    else windPts = 0
  } else {
    if (windSpeed <= 9) windPts = 20
    else if (windSpeed <= 18) windPts = 15
    else if (windSpeed <= 31) windPts = 8
    else if (windSpeed <= 43) windPts = 3
    else windPts = 0
  }

  // UV (0–15 pts)
  let uvPts: number
  if (isDay === 0) {
    uvPts = 15
  } else {
    if (uvIndex <= 3) uvPts = 15
    else if (uvIndex <= 6) uvPts = 12
    else if (uvIndex <= 9) uvPts = 6
    else if (uvIndex <= 11) uvPts = 2
    else uvPts = 0
  }

  // Sky (0–10 pts)
  let skyPts: number
  if (weatherCode <= 1) skyPts = 10
  else if (weatherCode === 2) skyPts = 8
  else if (weatherCode === 3) skyPts = 5
  else if (weatherCode === 45 || weatherCode === 48) skyPts = 2
  else skyPts = 0

  const score = tempPts + precipPts + windPts + uvPts + skyPts

  let result: ScoreResult
  if (score >= 85) result = { label: "Excellent", color: "#22C55E" }
  else if (score >= 70) result = { label: "Great", color: "#84CC16" }
  else if (score >= 55) result = { label: "Good", color: "#EAB308" }
  else if (score >= 40) result = { label: "Fair", color: "#F97316" }
  else if (score >= 20) result = { label: "Poor", color: "#EF4444" }
  else result = { label: "Rough", color: "#991B1B" }

  return { score, result }
}

export const HeroSection = React.memo(function HeroSection() {
  const { weather, location, unit } = useWeather()

  // Live clock — updates every minute
  const [now, setNow] = React.useState(() => new Date())
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  if (!weather) return null

  const { current, daily } = weather
  const wmo = getWMOInfo(current.weather_code, current.is_day)
  const uvLevel = getUVLevel(current.uv_index ?? 0)
  const isCelsius = unit === "celsius"
  const tempUnit = isCelsius ? "°C" : "°F"
  const windUnit = isCelsius ? "km/h" : "mph"

  const locationName = location?.name ?? "Current Location"
  const region = location?.admin1 ?? location?.country ?? ""

  // Format current time in the location's timezone
  const localTimeStr = new Intl.DateTimeFormat("en-US", {
    timeZone: weather.timezone,
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(now)

  // Sunrise/sunset strings are already in local time ("2024-03-17T06:45")
  const sunrise = daily.sunrise?.[0] ? localTimeToAmPm(daily.sunrise[0]) : "—"
  const sunset  = daily.sunset?.[0]  ? localTimeToAmPm(daily.sunset[0])  : "—"

  // Feels-like label (Feature 3)
  const feelsLikeLabel = feelsLikeReason(
    current.temperature_2m,
    current.apparent_temperature,
    current.wind_speed_10m,
    current.relative_humidity_2m,
    current.uv_index ?? 0,
    current.is_day === 1,
    isCelsius
  )

  // Day score (Feature 1)
  const precipProbMax = daily.precipitation_probability_max[0] ?? 0
  const { score, result: scoreResult } = computeDayScore(
    current.apparent_temperature,
    precipProbMax,
    current.weather_code,
    current.wind_speed_10m,
    current.uv_index ?? 0,
    current.is_day,
    isCelsius
  )

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border/50 bg-card"
    >
      {/* Subtle condition color glow */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: wmo.color }}
      />

      <div className="relative p-6">
        {/* Location + date row */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon icon={Location01Icon} className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{region}</span>
            </div>
            <h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-foreground">
              {locationName}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground/70">
              {localTimeStr}
            </p>
          </div>

          {/* Sunrise / Sunset */}
          <div className="shrink-0 space-y-1.5 text-right">
            <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
              <span>{sunrise}</span>
              <HugeiconsIcon icon={SunriseIcon} className="size-3.5" style={{ color: "#F59E0B" }} />
            </div>
            <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
              <span>{sunset}</span>
              <HugeiconsIcon icon={SunsetIcon} className="size-3.5" style={{ color: "#F97316" }} />
            </div>
          </div>
        </div>

        {/* Temperature + icon */}
        <div className="mb-6 flex items-end justify-between">
          <div className="flex items-start gap-4">
            <div
              className="flex size-20 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${wmo.color}20`, boxShadow: `0 0 40px ${wmo.color}15` }}
            >
              <HugeiconsIcon
                icon={wmo.icon}
                className="size-11"
                style={{ color: wmo.color }}
              />
            </div>
            <div>
              <div className="text-[5rem] font-extralight leading-none tracking-tighter tabular-nums text-foreground">
                {Math.round(current.temperature_2m)}
                <span className="text-4xl text-muted-foreground">{tempUnit}</span>
              </div>
              <p className="mt-1 text-sm font-medium text-muted-foreground">{wmo.label}</p>
            </div>
          </div>

          {/* High / Low */}
          <div className="hidden text-right sm:block">
            <div className="text-xs text-muted-foreground">Today</div>
            <div className="mt-0.5 text-sm font-medium">
              <span className="text-foreground">{Math.round(daily.temperature_2m_max[0])}°</span>
              <span className="mx-1 text-border">/</span>
              <span className="text-muted-foreground">{Math.round(daily.temperature_2m_min[0])}°</span>
            </div>
          </div>
        </div>

        {/* Stat pills */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatPill
            icon={TemperatureIcon}
            value={`${Math.round(current.apparent_temperature)}${tempUnit}`}
            label={feelsLikeLabel}
            accentColor="#60A5FA"
          />
          <StatPill
            icon={HumidityIcon}
            value={`${current.relative_humidity_2m}%`}
            label="Humidity"
            accentColor="#34D399"
          />
          <StatPill
            icon={FastWindIcon}
            value={`${Math.round(current.wind_speed_10m)} ${windUnit}`}
            label={`Wind · ${windDirection(current.wind_direction_10m)}`}
            accentColor="#A78BFA"
          />
          <StatPill
            icon={Sun01Icon}
            value={`${current.uv_index?.toFixed(1) ?? "—"} · ${uvLevel.label}`}
            label="UV Index"
            accentColor={uvLevel.color}
          />
        </div>

        {/* Day Score bar (Feature 1) */}
        <div className="mt-4 border-t border-border/30 pt-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Day Score</span>
            <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${score}%`, backgroundColor: scoreResult.color }}
              />
            </div>
            <span className="text-xs font-semibold tabular-nums" style={{ color: scoreResult.color }}>
              {score} · {scoreResult.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
})
