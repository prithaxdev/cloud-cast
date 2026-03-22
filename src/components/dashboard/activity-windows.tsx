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

type ActivityWindow = {
  id: string
  name: string
  icon: IconSvgElement
  color: string
  startLabel: string
  endLabel: string
  score: number
  conditions: string
}

type ActivityDef = {
  id: string
  name: string
  icon: IconSvgElement
  color: string
  minScore: number
  scoreHour: (h: HourlyPoint, isCelsius: boolean) => number
  conditions: (h: HourlyPoint, isCelsius: boolean) => string
}

const ACTIVITIES: ActivityDef[] = [
  {
    id: "running",
    name: "Running",
    icon: Running,
    color: "#F97316",
    minScore: 50,
    scoreHour(h, isCelsius) {
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
      const dayPenalty = h.isDay === 0 ? 15 : 0
      return Math.max(0, tempPts + windPts + precipPts - dayPenalty)
    },
    conditions(h, isCelsius) {
      const unit = isCelsius ? "°C" : "°F"
      const windLow = isCelsius ? 20 : 12
      const windHigh = isCelsius ? 35 : 22
      const windDesc =
        h.windSpeed < windLow
          ? "calm"
          : h.windSpeed < windHigh
            ? "light breeze"
            : "breezy"
      const rainDesc = h.precipProb < 15 ? "no rain" : `${h.precipProb}% rain`
      return `${Math.round(h.feelsLike)}${unit} · ${windDesc} · ${rainDesc}`
    },
  },
  {
    id: "cycling",
    name: "Cycling",
    icon: Bicycle01Icon,
    color: "#3B82F6",
    minScore: 50,
    scoreHour(h, isCelsius) {
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
      const dayPenalty = h.isDay === 0 ? 10 : 0
      return Math.max(0, tempPts + windPts + precipPts - dayPenalty)
    },
    conditions(h, isCelsius) {
      const unit = isCelsius ? "°C" : "°F"
      const windLow = isCelsius ? 25 : 15
      const windHigh = isCelsius ? 45 : 28
      const windDesc =
        h.windSpeed < windLow
          ? "calm"
          : h.windSpeed < windHigh
            ? "light breeze"
            : "breezy"
      const rainDesc = h.precipProb < 15 ? "no rain" : `${h.precipProb}% rain`
      return `${Math.round(h.feelsLike)}${unit} · ${windDesc} · ${rainDesc}`
    },
  },
  {
    id: "outdoor-dining",
    name: "Outdoor Dining",
    icon: ForkIcon,
    color: "#10B981",
    minScore: 55,
    scoreHour(h, isCelsius) {
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
      const dayPenalty = h.isDay === 0 ? 5 : 0
      return Math.max(0, tempPts + windPts + precipPts - dayPenalty)
    },
    conditions(h, isCelsius) {
      const unit = isCelsius ? "°C" : "°F"
      const windLow = isCelsius ? 15 : 9
      const windHigh = isCelsius ? 25 : 15
      const windDesc =
        h.windSpeed < windLow
          ? "calm"
          : h.windSpeed < windHigh
            ? "light breeze"
            : "breezy"
      const rainDesc = h.precipProb < 15 ? "no rain" : `${h.precipProb}% rain`
      return `${Math.round(h.feelsLike)}${unit} · ${windDesc} · ${rainDesc}`
    },
  },
  {
    id: "photography",
    name: "Photography",
    icon: Camera01Icon,
    color: "#A78BFA",
    minScore: 45,
    scoreHour(h, _isCelsius) {
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
      return skyPts + rainPts + precipPts
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
      return `${cloudDesc} · ${rainDesc}`
    },
  },
]

function hourLabel(timeStr: string): string {
  const h = parseInt(timeStr.substring(11, 13), 10)
  if (h === 0) return "12 AM"
  if (h === 12) return "12 PM"
  return h < 12 ? `${h} AM` : `${h - 12} PM`
}

function nextHourLabel(timeStr: string): string {
  const h = parseInt(timeStr.substring(11, 13), 10)
  const next = h + 2
  if (next === 0 || next === 24) return "12 AM"
  if (next === 12) return "12 PM"
  return next < 12 ? `${next} AM` : `${next - 12} PM`
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
        color: activity.color,
        startLabel: hourLabel(bestHour.time),
        endLabel: nextHourLabel(bestHour.time),
        score,
        conditions: activity.conditions(bestHour, isCelsius),
      })
    }
  }

  return windows
}

export const ActivityWindows = React.memo(function ActivityWindows() {
  const { weather, unit } = useWeather()
  const { hourly24 } = useChartData(weather)
  const isCelsius = unit === "celsius"

  const windows = React.useMemo(
    () => computeWindows(hourly24, isCelsius),
    [hourly24, isCelsius]
  )

  if (windows.length === 0) return null

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-foreground">
          Best Time for Activities
        </h2>
        <p className="text-xs text-muted-foreground">
          Based on today's hourly forecast
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {windows.map((w) => (
          <div
            key={w.id}
            className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card/80 p-3"
          >
            <div className="flex items-center gap-2">
              <div
                className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${w.color}18` }}
              >
                <HugeiconsIcon
                  icon={w.icon}
                  className="size-4"
                  style={{ color: w.color }}
                />
              </div>
              <span className="text-xs font-medium text-foreground">
                {w.name}
              </span>
            </div>
            <div className="text-sm font-semibold text-foreground">
              {w.startLabel} - {w.endLabel}
            </div>
            <div className="text-[10px] leading-relaxed text-muted-foreground">
              {w.conditions}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

export function ActivityWindowsSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5">
      <div className="mb-4 space-y-1.5">
        <div className="h-3.5 w-40 animate-pulse rounded-md bg-muted" />
        <div className="h-3 w-56 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card/80 p-3"
          >
            <div className="flex items-center gap-2">
              <div className="size-8 animate-pulse rounded-lg bg-muted" />
              <div className="h-3 w-14 animate-pulse rounded-md bg-muted" />
            </div>
            <div className="h-3.5 w-20 animate-pulse rounded-md bg-muted" />
            <div className="h-3 w-full animate-pulse rounded-md bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}
