import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import {
  Bicycle01Icon,
  Camera01Icon,
  ForkIcon,
  Running,
} from "@hugeicons/core-free-icons"
import { useWeather } from "@/hooks/use-weather"
import { useChartData } from "@/hooks/use-chart-data"
import type { HourlyPoint } from "@/hooks/use-chart-data"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { NowMark } from "@/components/now-mark"

type ActivityWindow = {
  id: string
  name: string
  icon: IconSvgElement
  rangeLabel: string
  hoursAway: number
  score: number
  conditions: string
}

type ActivityDef = {
  id: string
  name: string
  icon: IconSvgElement
  minScore: number
  scoreHour: (h: HourlyPoint, isCelsius: boolean) => number
  conditions: (h: HourlyPoint, isCelsius: boolean) => string
}

const ACTIVITIES: ActivityDef[] = [
  {
    id: "running",
    name: "Running",
    icon: Running,
    minScore: 50,
    scoreHour(h, isCelsius) {
      const hour = parseInt(h.time.substring(11, 13), 10)
      // Preferred running times: morning (6–10 AM) or evening (5–8 PM)
      const timeBonus = hour >= 6 && hour <= 10 ? 10 : hour >= 17 && hour <= 20 ? 5 : 0
      // Night running is uncommon and unsafe — strong penalty
      const nightPenalty = h.isDay === 0 ? 30 : 0
      let tempPts: number
      if (isCelsius) {
        if (h.feelsLike >= 10 && h.feelsLike <= 18) tempPts = 40
        else if (h.feelsLike >= 5 && h.feelsLike <= 22) tempPts = 25
        else tempPts = 0
      } else {
        if (h.feelsLike >= 50 && h.feelsLike <= 64) tempPts = 40
        else if (h.feelsLike >= 41 && h.feelsLike <= 72) tempPts = 25
        else tempPts = 0
      }
      let windPts: number
      if (isCelsius) {
        if (h.windSpeed < 20) windPts = 30
        else if (h.windSpeed < 35) windPts = 18
        else windPts = 0
      } else {
        if (h.windSpeed < 12) windPts = 30
        else if (h.windSpeed < 22) windPts = 18
        else windPts = 0
      }
      const precipPts = h.precipProb < 20 ? 30 : h.precipProb < 40 ? 15 : 0
      return Math.max(0, tempPts + windPts + precipPts + timeBonus - nightPenalty)
    },
    conditions(h, isCelsius) {
      const unit = isCelsius ? "°C" : "°F"
      const hour = parseInt(h.time.substring(11, 13), 10)
      const windLow = isCelsius ? 20 : 12
      const windHigh = isCelsius ? 35 : 22
      const windDesc =
        h.windSpeed < windLow
          ? "calm"
          : h.windSpeed < windHigh
            ? "light breeze"
            : "breezy"
      const rainDesc = h.precipProb < 15 ? "no rain" : `${h.precipProb}% rain`
      const timeDesc = hour >= 6 && hour <= 10 ? " · morning run" : hour >= 17 && hour <= 20 ? " · evening run" : ""
      return `${Math.round(h.feelsLike)}${unit} · ${windDesc} · ${rainDesc}${timeDesc}`
    },
  },
  {
    id: "cycling",
    name: "Cycling",
    icon: Bicycle01Icon,
    minScore: 50,
    scoreHour(h, isCelsius) {
      const hour = parseInt(h.time.substring(11, 13), 10)
      // Preferred cycling times: morning (7–11 AM) or afternoon (2–6 PM)
      const timeBonus = hour >= 7 && hour <= 11 ? 10 : hour >= 14 && hour <= 18 ? 5 : 0
      // Night cycling is unsafe — strong penalty
      const nightPenalty = h.isDay === 0 ? 30 : 0
      let tempPts: number
      if (isCelsius) {
        if (h.feelsLike >= 15 && h.feelsLike <= 25) tempPts = 40
        else if (h.feelsLike >= 10 && h.feelsLike <= 28) tempPts = 25
        else tempPts = 0
      } else {
        if (h.feelsLike >= 59 && h.feelsLike <= 77) tempPts = 40
        else if (h.feelsLike >= 50 && h.feelsLike <= 82) tempPts = 25
        else tempPts = 0
      }
      let windPts: number
      if (isCelsius) {
        if (h.windSpeed < 25) windPts = 30
        else if (h.windSpeed < 45) windPts = 15
        else windPts = 0
      } else {
        if (h.windSpeed < 15) windPts = 30
        else if (h.windSpeed < 28) windPts = 15
        else windPts = 0
      }
      const precipPts = h.precipProb < 15 ? 30 : h.precipProb < 35 ? 12 : 0
      return Math.max(0, tempPts + windPts + precipPts + timeBonus - nightPenalty)
    },
    conditions(h, isCelsius) {
      const unit = isCelsius ? "°C" : "°F"
      const hour = parseInt(h.time.substring(11, 13), 10)
      const windLow = isCelsius ? 25 : 15
      const windHigh = isCelsius ? 45 : 28
      const windDesc =
        h.windSpeed < windLow
          ? "calm"
          : h.windSpeed < windHigh
            ? "light breeze"
            : "breezy"
      const rainDesc = h.precipProb < 15 ? "no rain" : `${h.precipProb}% rain`
      const timeDesc = hour >= 7 && hour <= 11 ? " · morning ride" : hour >= 14 && hour <= 18 ? " · afternoon ride" : ""
      return `${Math.round(h.feelsLike)}${unit} · ${windDesc} · ${rainDesc}${timeDesc}`
    },
  },
  {
    id: "outdoor-dining",
    name: "Outdoor dining",
    icon: ForkIcon,
    minScore: 55,
    scoreHour(h, isCelsius) {
      const hour = parseInt(h.time.substring(11, 13), 10)
      // Preferred meal times: lunch (11 AM–2 PM) or dinner (6–9 PM)
      const timeBonus = (hour >= 11 && hour <= 14) || (hour >= 18 && hour <= 21) ? 15 : 0
      // Late-night dining is unusual; moderate penalty after sunset
      const nightPenalty = h.isDay === 0 ? 20 : 0
      let tempPts: number
      if (isCelsius) {
        if (h.feelsLike >= 18 && h.feelsLike <= 28) tempPts = 40
        else if (h.feelsLike >= 15 && h.feelsLike <= 32) tempPts = 25
        else tempPts = 0
      } else {
        if (h.feelsLike >= 64 && h.feelsLike <= 82) tempPts = 40
        else if (h.feelsLike >= 59 && h.feelsLike <= 89) tempPts = 25
        else tempPts = 0
      }
      let windPts: number
      if (isCelsius) {
        if (h.windSpeed < 15) windPts = 30
        else if (h.windSpeed < 25) windPts = 15
        else windPts = 0
      } else {
        if (h.windSpeed < 9) windPts = 30
        else if (h.windSpeed < 15) windPts = 15
        else windPts = 0
      }
      const precipPts = h.precipProb < 10 ? 30 : h.precipProb < 25 ? 12 : 0
      return Math.max(0, tempPts + windPts + precipPts + timeBonus - nightPenalty)
    },
    conditions(h, isCelsius) {
      const unit = isCelsius ? "°C" : "°F"
      const hour = parseInt(h.time.substring(11, 13), 10)
      const windLow = isCelsius ? 15 : 9
      const windHigh = isCelsius ? 25 : 15
      const windDesc =
        h.windSpeed < windLow
          ? "calm"
          : h.windSpeed < windHigh
            ? "light breeze"
            : "breezy"
      const rainDesc = h.precipProb < 15 ? "no rain" : `${h.precipProb}% rain`
      const timeDesc = hour >= 11 && hour <= 14 ? " · lunch" : hour >= 18 && hour <= 21 ? " · dinner" : ""
      return `${Math.round(h.feelsLike)}${unit} · ${windDesc} · ${rainDesc}${timeDesc}`
    },
  },
  {
    id: "photography",
    name: "Photography",
    icon: Camera01Icon,
    minScore: 45,
    scoreHour(h, _isCelsius) {
      // Photography requires daylight — night hours are useless
      if (h.isDay === 0) return 0
      // Golden hour bonus: low UV during daylight = near sunrise/sunset
      const goldenBonus = h.uvIndex <= 1 ? 15 : 0
      let skyPts: number
      if (h.cloudCover >= 20 && h.cloudCover <= 60) skyPts = 40
      else if (h.cloudCover < 20) skyPts = 35
      else if (h.cloudCover <= 80) skyPts = 25
      else skyPts = 10
      let rainPts: number
      if (h.weatherCode < 51) rainPts = 35
      else if (h.weatherCode <= 60) rainPts = 10
      else rainPts = 0
      const precipPts = h.precipProb < 20 ? 25 : h.precipProb < 40 ? 12 : 0
      return skyPts + rainPts + precipPts + goldenBonus
    },
    conditions(h, _isCelsius) {
      const cloudDesc =
        h.cloudCover < 20
          ? "clear sky"
          : h.cloudCover < 50
            ? "light clouds"
            : h.cloudCover < 80
              ? "dramatic clouds"
              : "overcast"
      const rainDesc = h.precipProb < 15 ? "dry" : `${h.precipProb}% rain`
      const goldenHour = h.isDay === 1 && h.uvIndex <= 1 ? " · golden hour" : ""
      return `${cloudDesc} · ${rainDesc}${goldenHour}`
    },
  },
]

// "8–10 AM" when both ends share a period, "11 AM–1 PM" otherwise
function windowLabel(timeStr: string): string {
  const start = parseInt(timeStr.substring(11, 13), 10)
  const end = (start + 2) % 24
  const period = (h: number) => (h < 12 ? "AM" : "PM")
  const h12 = (h: number) => h % 12 || 12
  return period(start) === period(end)
    ? `${h12(start)}–${h12(end)} ${period(end)}`
    : `${h12(start)} ${period(start)}–${h12(end)} ${period(end)}`
}

function computeWindows(
  hourly: HourlyPoint[],
  isCelsius: boolean
): ActivityWindow[] {
  const slice = hourly.slice(0, 18)
  const windows: ActivityWindow[] = []

  for (const activity of ACTIVITIES) {
    let bestScore = -1
    let bestIdx = 0

    for (let i = 0; i < slice.length - 1; i++) {
      const avg =
        (activity.scoreHour(slice[i], isCelsius) +
          activity.scoreHour(slice[i + 1], isCelsius)) /
        2
      if (avg > bestScore) {
        bestScore = avg
        bestIdx = i
      }
    }

    const score = Math.round(bestScore)
    if (score >= activity.minScore) {
      const bestHour = slice[bestIdx]
      windows.push({
        id: activity.id,
        name: activity.name,
        icon: activity.icon,
        rangeLabel: windowLabel(bestHour.time),
        hoursAway: bestIdx,
        score,
        conditions: activity.conditions(bestHour, isCelsius),
      })
    }
  }

  return windows
}

export const ActivityWindows = React.memo(function ActivityWindows({
  className,
}: {
  className?: string
}) {
  const { weather, unit } = useWeather()
  const { hourly24 } = useChartData(weather)
  const isCelsius = unit === "celsius"

  const windows = React.useMemo(
    () => computeWindows(hourly24, isCelsius),
    [hourly24, isCelsius]
  )

  if (windows.length === 0) return null

  return (
    <section className={cn("flex flex-col rounded-2xl border border-border bg-card p-5", className)}>
      <header>
        <h2 className="text-sm font-medium">Best times to head out</h2>
        <p className="mt-1 text-[13px] text-muted-foreground">
          The best 2-hour window in the next 18 hours
        </p>
      </header>
      <ul className="mt-4 grid flex-1 grid-cols-1 sm:auto-rows-fr sm:grid-cols-2">
        {windows.map((w) => (
          <li
            key={w.id}
            className="flex flex-col gap-2 border-t border-border py-4 sm:even:border-l sm:even:pl-5 sm:odd:pr-5"
          >
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={w.icon} className="size-4 shrink-0 text-muted-foreground" />
              <span className="text-sm text-subtle-foreground">{w.name}</span>
              {w.hoursAway === 0 ? (
                <NowMark className="ms-auto" />
              ) : (
                <span className="ms-auto font-mono text-xs text-muted-foreground">
                  in {w.hoursAway} h
                </span>
              )}
            </div>
            <p className="text-xl font-medium tabular-nums">{w.rangeLabel}</p>
            <p className="text-[13px] text-muted-foreground">{w.conditions}</p>
          </li>
        ))}
      </ul>
    </section>
  )
})

export function ActivityWindowsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5", className)}>
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="h-3 w-56" />
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 border-t border-border py-4 sm:even:border-l sm:even:pl-5 sm:odd:pr-5"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
