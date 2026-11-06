import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import {
  Sun01Icon,
  Moon01Icon,
  SunCloud01Icon,
  CloudIcon,
  CloudSlowWindIcon,
  CloudMidRainIcon,
  CloudBigRainIcon,
  CloudAngledZapIcon,
  SunCloudMidRainIcon,
  SunCloudLittleSnowIcon,
  SunCloudSnowIcon,
  FastWindIcon,
  HumidityIcon,
  TemperatureIcon,
  SunriseIcon,
  SunsetIcon,
} from "@hugeicons/core-free-icons"
import { useWeather } from "@/hooks/use-weather"
import type { WeatherUnit } from "@/components/weather-provider"
import type { OpenMeteoRes } from "@/types"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

// ─── Types ────────────────────────────────────────────────────────────────────

type InsightPriority = 1 | 2 | 3 | 4

type Insight = {
  id: string
  priority: InsightPriority
  headline: string
  subtext: string
  icon: IconSvgElement
}

// ─── Time helpers ─────────────────────────────────────────────────────────────

/** "YYYY-MM-DDTHH:MM" → minutes since midnight */
function isoToMinutes(isoStr: string): number {
  const [h, m] = isoStr.substring(11, 16).split(":").map(Number)
  return h * 60 + m
}

/** Current local time in the given timezone → minutes since midnight */
function localMinutes(now: Date, tz: string): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(now)
  const h = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0")
  const m = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0")
  return h * 60 + m
}

/** 0 = Sunday … 6 = Saturday in the given timezone */
function localDayOfWeek(now: Date, tz: string): number {
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "long",
  }).format(now)
  return [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ].indexOf(name)
}

// ─── Insight computation ──────────────────────────────────────────────────────

function computeInsights(
  weather: OpenMeteoRes,
  unit: WeatherUnit,
  now: Date
): Insight[] {
  const { current, daily, timezone } = weather
  const isCelsius = unit === "celsius"

  const code = current.weather_code
  const isDay = current.is_day === 1
  const temp = current.apparent_temperature // already in user's unit
  const humidity = current.relative_humidity_2m
  const gusts = current.wind_gusts_10m // km/h (celsius) | mph (fahrenheit)
  const vis = current.visibility // always metres
  const uv = current.uv_index ?? 0
  const uvMax = daily.uv_index_max[0]
  const precipProbMax = daily.precipitation_probability_max[0]
  const cloudCover = current.cloud_cover

  // Unit-aware thresholds
  const T = {
    extremeHot: isCelsius ? 38 : 100,
    veryHot: isCelsius ? 32 : 89,
    muggyTemp: isCelsius ? 27 : 80,
    nearFreeze: isCelsius ? -2 : 28,
    freeze: isCelsius ? 4 : 39,
    extremeCold: isCelsius ? -15 : 5,
    gustHigh: isCelsius ? 60 : 37, // km/h | mph
    gustExtreme: isCelsius ? 90 : 55,
  }

  const candidates: Insight[] = []
  const add = (i: Insight) => candidates.push(i)

  // ── Priority 1 · Critical ─────────────────────────────────────────────────

  if (code >= 96) {
    add({
      id: "hail-storm",
      priority: 1,
      headline: "Thunderstorm with hail",
      subtext:
        "Stay indoors. Hail and lightning are dangerous, so bring in anything left outside.",
      icon: CloudAngledZapIcon,
    })
  } else if (code === 95) {
    add({
      id: "thunderstorm",
      priority: 1,
      headline: "Thunderstorm warning",
      subtext:
        "Lightning nearby. Find shelter and stay away from open ground and tall trees.",
      icon: CloudAngledZapIcon,
    })
  }

  if (code === 65 || code === 82) {
    add({
      id: "heavy-rain",
      priority: 1,
      headline: "Heavy rain",
      subtext: "Roads may flood and visibility drops. Drive slowly.",
      icon: CloudBigRainIcon,
    })
  }

  if (code === 75 || code === 86) {
    add({
      id: "heavy-snow",
      priority: 1,
      headline: "Heavy snowfall",
      subtext: "Near-blizzard snow is possible. Avoid travel if you can.",
      icon: SunCloudSnowIcon,
    })
  }

  if (temp > T.extremeHot) {
    add({
      id: "extreme-heat",
      priority: 1,
      headline: "Dangerous heat",
      subtext:
        "Stay indoors where you can, drink water often and keep out of the sun.",
      icon: Sun01Icon,
    })
  }

  if (temp < T.extremeCold) {
    add({
      id: "extreme-cold",
      priority: 1,
      headline: "Dangerous cold",
      subtext:
        "Frostbite can set in within minutes. Cover exposed skin and limit time outside.",
      icon: TemperatureIcon,
    })
  }

  if (gusts > T.gustExtreme) {
    add({
      id: "extreme-wind",
      priority: 1,
      headline: "Extreme wind gusts",
      subtext: `Gusts up to ${Math.round(gusts)} ${isCelsius ? "km/h" : "mph"} can damage structures. Stay indoors.`,
      icon: FastWindIcon,
    })
  }

  // ── Priority 2 · Noteworthy weather ───────────────────────────────────────

  const hasCriticalWeather = candidates.some(
    (c) =>
      c.priority === 1 &&
      ["hail-storm", "thunderstorm", "heavy-rain", "heavy-snow"].includes(c.id)
  )

  if (!hasCriticalWeather) {
    // Moderate/light rain
    if ((code >= 51 && code <= 64) || code === 80 || code === 81) {
      const isLight = [51, 53, 61, 80].includes(code)
      add({
        id: "rain",
        priority: 2,
        headline: isLight ? "Light rain" : "Moderate rain",
        subtext: isLight
          ? "A drizzle. A compact umbrella is enough."
          : "Take an umbrella. Expect puddles.",
        icon: isLight ? SunCloudMidRainIcon : CloudMidRainIcon,
      })
    }

    // Snow (light/moderate)
    if ((code >= 71 && code <= 73) || code === 85) {
      add({
        id: "snow",
        priority: 2,
        headline: code <= 71 ? "Light snowfall" : "Moderate snow",
        subtext: "Surfaces will be slippery. Drive carefully and watch your step.",
        icon: SunCloudLittleSnowIcon,
      })
    }

    // Fog / low visibility
    if (code === 45 || code === 48 || (vis !== undefined && vis < 1000)) {
      add({
        id: "fog",
        priority: 2,
        headline: "Low visibility",
        subtext:
          vis !== undefined && vis < 200
            ? "Dense fog, visibility under 200 m. Use fog lights and slow down."
            : "Foggy. Use low beams and leave more following distance.",
        icon: CloudSlowWindIcon,
      })
    }

    // Strong winds (not extreme)
    if (gusts > T.gustHigh && gusts <= T.gustExtreme) {
      add({
        id: "wind",
        priority: 2,
        headline: "Strong wind gusts",
        subtext: `Gusts of ${Math.round(gusts)} ${isCelsius ? "km/h" : "mph"}. Secure loose items outside.`,
        icon: FastWindIcon,
      })
    }

    // Heat + humidity (muggy / heat index)
    const hasExtremeHeat = candidates.some((c) => c.id === "extreme-heat")
    if (!hasExtremeHeat && temp > T.muggyTemp && humidity > 78) {
      add({
        id: "muggy",
        priority: 2,
        headline: "Hot and humid",
        subtext: `${humidity}% humidity makes ${Math.round(temp)}° feel heavier. Stay in the shade.`,
        icon: HumidityIcon,
      })
    }

    // High UV (when sunny enough to matter)
    if (isDay && uvMax >= 8) {
      add({
        id: "uv",
        priority: 2,
        headline: uvMax >= 11 ? "Extreme UV" : "Very high UV",
        subtext: `UV index peaks at ${Math.round(uvMax)} today. Wear SPF 50+, sunglasses and a hat.`,
        icon: Sun01Icon,
      })
    }
  }

  // ── Priority 3 · Ambient conditions ───────────────────────────────────────

  const hasWeatherNote = candidates.some(
    (c) =>
      c.priority <= 2 &&
      !["extreme-heat", "extreme-cold", "extreme-wind"].includes(c.id)
  )

  // Clear sunny day
  const isSunnyDay = isDay && (code === 0 || code === 1) && precipProbMax < 20
  if (isSunnyDay) {
    const uvTip =
      uv >= 7
        ? " UV is high, so wear sunscreen."
        : uv >= 4
          ? " UV is moderate, light sunscreen helps."
          : " UV stays low."
    add({
      id: "sunny",
      priority: 3,
      headline: "Clear skies all day",
      subtext: `Good conditions to be outside.${uvTip}`,
      icon: Sun01Icon,
    })
  }

  // Rain likely later (currently dry)
  const isCurrentlyDry = code < 51 || (code >= 45 && code <= 48) // clear, cloudy, or fog only
  if (
    !candidates.some((c) =>
      ["rain", "heavy-rain", "thunderstorm", "hail-storm"].includes(c.id)
    ) &&
    precipProbMax >= 70 &&
    isCurrentlyDry
  ) {
    add({
      id: "rain-later",
      priority: 3,
      headline: "Rain expected later",
      subtext: `${precipProbMax}% chance of rain today. Dry for now, so keep an umbrella close.`,
      icon: SunCloudMidRainIcon,
    })
  }

  // Overcast / gloomy
  if ((code === 3 || cloudCover > 88) && !hasWeatherNote && !isSunnyDay) {
    add({
      id: "overcast",
      priority: 3,
      headline: "Grey skies today",
      subtext: "Fully overcast, with no sun breaking through.",
      icon: CloudIcon,
    })
  }

  // Near-freezing / frost risk
  const hasSnowOrCold = candidates.some((c) =>
    ["snow", "heavy-snow", "extreme-cold"].includes(c.id)
  )
  if (!hasSnowOrCold && temp >= T.nearFreeze && temp <= T.freeze) {
    add({
      id: "frost",
      priority: 3,
      headline: "Near freezing",
      subtext: "Black ice is possible on roads and paths. Allow extra time.",
      icon: SunCloudLittleSnowIcon,
    })
  }

  // Very hot day (below extreme, but still scorching)
  const hasHeat = candidates.some((c) =>
    ["extreme-heat", "muggy"].includes(c.id)
  )
  if (!hasHeat && temp > T.veryHot && temp <= T.extremeHot) {
    add({
      id: "hot-day",
      priority: 3,
      headline: "Very hot day",
      subtext: "Drink water and take breaks in the shade.",
      icon: Sun01Icon,
    })
  }

  // Clear night / stargazing
  if (!isDay && (code === 0 || code === 1)) {
    add({
      id: "stargazing",
      priority: 3,
      headline: "Clear night",
      subtext: "Good visibility for stargazing tonight.",
      icon: Moon01Icon,
    })
  }

  // ── Priority 4 · Time-based ───────────────────────────────────────────────

  const nowMin = localMinutes(now, timezone)
  const sunriseMin = daily.sunrise?.[0] ? isoToMinutes(daily.sunrise[0]) : -1
  const sunsetMin = daily.sunset?.[0] ? isoToMinutes(daily.sunset[0]) : -1

  // Golden hour — morning (first 45 min after sunrise)
  if (
    sunriseMin !== -1 &&
    isDay &&
    nowMin >= sunriseMin &&
    nowMin <= sunriseMin + 45
  ) {
    add({
      id: "golden-hour-am",
      priority: 4,
      headline: "Golden hour",
      subtext: "Soft, low light for the next 45 minutes. Good for photos or a walk.",
      icon: SunriseIcon,
    })
  }

  // Blue hour — dawn (30 min before sunrise)
  if (
    sunriseMin !== -1 &&
    !isDay &&
    nowMin >= sunriseMin - 30 &&
    nowMin < sunriseMin
  ) {
    add({
      id: "blue-hour-am",
      priority: 4,
      headline: "Blue hour",
      subtext: "The sky turns deep blue in the half hour before sunrise.",
      icon: SunriseIcon,
    })
  }

  // Golden hour — evening (45 min before sunset)
  if (
    sunsetMin !== -1 &&
    isDay &&
    nowMin >= sunsetMin - 45 &&
    nowMin < sunsetMin
  ) {
    add({
      id: "golden-hour-pm",
      priority: 4,
      headline: "Sunset approaching",
      subtext: "Warm, low light until sunset. A good time to head out.",
      icon: SunsetIcon,
    })
  }

  // Blue hour — dusk (30 min after sunset)
  if (
    sunsetMin !== -1 &&
    !isDay &&
    nowMin >= sunsetMin &&
    nowMin <= sunsetMin + 30
  ) {
    add({
      id: "blue-hour-pm",
      priority: 4,
      headline: "Blue hour",
      subtext: "The sky stays deep blue for about half an hour after sunset.",
      icon: SunsetIcon,
    })
  }

  // Weekend days
  const dow = localDayOfWeek(now, timezone)
  if (dow === 0) {
    add({
      id: "sunday",
      priority: 4,
      headline: "Sunday",
      subtext: "A free day. The activity windows below show the best hours outside.",
      icon: SunCloud01Icon,
    })
  } else if (dow === 6) {
    add({
      id: "saturday",
      priority: 4,
      headline: "Saturday",
      subtext: "A free day. The activity windows below show the best hours outside.",
      icon: Sun01Icon,
    })
  }

  // ── Compound merges ───────────────────────────────────────────────────────

  let result = [...candidates]

  // Sunny + weekend → merged card (better than showing both)
  const sunnyIdx = result.findIndex((c) => c.id === "sunny")
  const sundayIdx = result.findIndex((c) => c.id === "sunday")
  const saturdayIdx = result.findIndex((c) => c.id === "saturday")
  const weekendIdx = sundayIdx !== -1 ? sundayIdx : saturdayIdx
  const isSunday = sundayIdx !== -1

  if (sunnyIdx !== -1 && weekendIdx !== -1) {
    const removed = new Set([sunnyIdx, weekendIdx])
    result = result.filter((_, i) => !removed.has(i))
    result.push({
      id: "sunny-weekend",
      priority: 3,
      headline: isSunday ? "Sunny Sunday" : "Sunny Saturday",
      subtext: "Clear skies on a free day, a good one to spend outside.",
      icon: Sun01Icon,
    })
  }

  // Drop time-based cards if there's any critical weather (wrong tone)
  const hasCritical = result.some((c) => c.priority === 1)
  if (hasCritical) {
    result = result.filter((c) => c.priority !== 4)
  }

  // Sort by priority, cap at 3
  return result.sort((a, b) => a.priority - b.priority).slice(0, 3)
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function WeatherInsightsSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="divide-y divide-border rounded-2xl border border-border bg-card">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 px-5 py-4">
          <Skeleton className="size-[18px] shrink-0 rounded-sm" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export const WeatherInsights = React.memo(function WeatherInsights() {
  const { weather, unit } = useWeather()

  const [now, setNow] = React.useState(() => new Date())
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  const insights = React.useMemo(() => {
    if (!weather) return []
    return computeInsights(weather, unit, now)
  }, [weather, unit, now])

  if (insights.length === 0) return null

  return (
    <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
      {insights.map((insight) => {
        const isWarning = insight.priority === 1
        return (
          <li key={insight.id} className="flex items-start gap-3 px-5 py-4">
            <HugeiconsIcon
              icon={insight.icon}
              className={cn(
                "mt-px size-[18px] shrink-0",
                isWarning ? "text-destructive" : "text-muted-foreground"
              )}
            />
            <div className="min-w-0">
              <p className="text-sm leading-5 font-medium text-foreground">
                {insight.headline}
              </p>
              <p className="mt-1 text-[13px] leading-5 text-subtle-foreground">
                {insight.subtext}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
})
