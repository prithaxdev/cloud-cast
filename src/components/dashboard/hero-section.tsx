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
  const tempUnit = unit === "celsius" ? "°C" : "°F"
  const windUnit = unit === "celsius" ? "km/h" : "mph"

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
            label="Feels Like"
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
      </div>
    </div>
  )
})
