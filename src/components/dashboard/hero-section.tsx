import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Location01Icon } from "@hugeicons/core-free-icons"
import { useWeather } from "@/hooks/use-weather"
import { getWMOInfo, getUVLevel, windDirection } from "@/lib/wmo"
import { cn } from "@/lib/utils"
import { SunDial } from "./sun-dial"

// Current local time in the given timezone → minutes since midnight
function localMinutes(now: Date, tz: string): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(now)
  const h = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0")
  const m = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0")
  return (h % 24) * 60 + m
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

  if (Math.abs(delta) < (isCelsius ? 1.5 : 2.5)) return "Close to actual"
  if (delta <= -deltaThreshold && wind > windThreshold) return "Wind chill"
  if (delta >= deltaThreshold && humidity > 70) return "Humidity"
  if (delta <= -deltaThreshold && humidity < 35) return "Dry air"
  if (isDay && uv > 5 && delta >= deltaThreshold) return "Solar gain"
  if (delta < 0) return "Cooler than actual"
  return "Warmer than actual"
}


function computeDayScore(
  apparentTemp: number,
  precipProbMax: number,
  weatherCode: number,
  windSpeed: number,
  uvIndex: number,
  isDay: 0 | 1,
  isCelsius: boolean
): { score: number; label: string } {
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

  let label: string
  if (score >= 85) label = "Excellent"
  else if (score >= 70) label = "Great"
  else if (score >= 55) label = "Good"
  else if (score >= 40) label = "Fair"
  else if (score >= 20) label = "Poor"
  else label = "Rough"

  return { score, label }
}

type ReadoutProps = { label: string; value: string; detail?: string }

function Readout({ label, value, detail }: ReadoutProps) {
  return (
    <div className="min-w-0 sm:border-l sm:border-border sm:pl-5 sm:first:border-l-0 sm:first:pl-0">
      <dt className="text-[13px] text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-xl font-medium tabular-nums">{value}</dd>
      {detail && (
        <dd className="mt-0.5 truncate text-xs text-muted-foreground">{detail}</dd>
      )}
    </div>
  )
}

export const HeroSection = React.memo(function HeroSection({
  className,
}: {
  className?: string
}) {
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
  const uvIndex = Math.round(current.uv_index ?? 0)
  const isCelsius = unit === "celsius"
  const windUnit = isCelsius ? "km/h" : "mph"

  const locationName = location?.name ?? "Current location"
  const region = location?.admin1 ?? location?.country ?? ""

  // Format current time in the location's timezone
  const localTimeStr = new Intl.DateTimeFormat("en-US", {
    timeZone: weather.timezone,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(now)

  const feelsLikeLabel = feelsLikeReason(
    current.temperature_2m,
    current.apparent_temperature,
    current.wind_speed_10m,
    current.relative_humidity_2m,
    current.uv_index ?? 0,
    current.is_day === 1,
    isCelsius
  )

  const precipProbMax = daily.precipitation_probability_max[0] ?? 0
  const { score, label: scoreLabel } = computeDayScore(
    current.apparent_temperature,
    precipProbMax,
    current.weather_code,
    current.wind_speed_10m,
    current.uv_index ?? 0,
    current.is_day,
    isCelsius
  )

  const dewPoint = current.dew_point_2m

  return (
    <section
      className={cn(
        "flex flex-col rounded-2xl border border-border bg-card p-6",
        className
      )}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {region && (
            <p className="flex items-center gap-2 text-sm text-subtle-foreground">
              <HugeiconsIcon icon={Location01Icon} className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{region}</span>
            </p>
          )}
          <h1 className="mt-1 truncate text-[28px] leading-tight font-medium">
            {locationName}
          </h1>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{localTimeStr}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[13px] text-muted-foreground">Today</p>
          <p className="mt-1 text-sm tabular-nums">
            <span className="text-muted-foreground">H</span>{" "}
            <span className="font-medium">{Math.round(daily.temperature_2m_max[0])}°</span>
            <span className="ms-3 text-muted-foreground">L</span>{" "}
            <span className="font-medium">{Math.round(daily.temperature_2m_min[0])}°</span>
          </p>
        </div>
      </header>

      <div className="mt-8 grid flex-1 items-center gap-8 md:grid-cols-[1fr_minmax(0,22rem)]">
        <div>
          <p className="flex items-start leading-none">
            <span className="text-8xl font-normal tracking-[-0.04em] tabular-nums">
              {Math.round(current.temperature_2m)}
            </span>
            <span className="mt-2 ms-1 text-3xl text-muted-foreground">
              {isCelsius ? "°C" : "°F"}
            </span>
          </p>
          <p className="mt-4 flex items-center gap-2 text-base text-subtle-foreground">
            <HugeiconsIcon icon={wmo.icon} className="size-[18px] text-muted-foreground" />
            {wmo.label}
          </p>
        </div>

        {daily.sunrise?.[0] && daily.sunset?.[0] && (
          <SunDial
            sunrise={daily.sunrise[0]}
            sunset={daily.sunset[0]}
            nowMinutes={localMinutes(now, weather.timezone)}
            latitude={weather.latitude}
          />
        )}
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-x-5 gap-y-5 border-t border-border pt-5 sm:grid-cols-4">
        <Readout
          label="Feels like"
          value={`${Math.round(current.apparent_temperature)}°`}
          detail={feelsLikeLabel}
        />
        <Readout
          label="Humidity"
          value={`${current.relative_humidity_2m}%`}
          detail={dewPoint !== undefined ? `Dew point ${Math.round(dewPoint)}°` : undefined}
        />
        <Readout
          label="Wind"
          value={`${Math.round(current.wind_speed_10m)} ${windUnit}`}
          detail={`${windDirection(current.wind_direction_10m)}, gusts ${Math.round(current.wind_gusts_10m)}`}
        />
        <Readout label="UV index" value={String(uvIndex)} detail={getUVLevel(uvIndex)} />
      </dl>

      <div className="mt-5 flex items-center gap-4 border-t border-border pt-4">
        <span className="text-[13px] text-muted-foreground">Day score</span>
        <div
          className="relative h-1 flex-1 overflow-hidden rounded-full bg-muted"
          role="meter"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={score}
          aria-label="Day score"
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-foreground/70"
            style={{ width: `${score}%` }}
          />
        </div>
        <span className="text-sm tabular-nums">
          <span className="font-medium">{score}</span>
          <span className="ms-2 text-subtle-foreground">{scoreLabel}</span>
        </span>
      </div>
    </section>
  )
})
