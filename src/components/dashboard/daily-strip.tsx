import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import type { DailyPoint } from "@/hooks/use-chart-data"
import type { WeatherUnit } from "@/components/weather-provider"
import { getWMOInfo } from "@/lib/wmo"
import { tempColor } from "@/lib/temperature"
import { cn } from "@/lib/utils"

type DayRowProps = {
  day: DailyPoint
  globalMin: number
  globalMax: number
  isCelsius: boolean
  isToday: boolean
}

const DayRow = React.memo(function DayRow({
  day,
  globalMin,
  globalMax,
  isCelsius,
  isToday,
}: DayRowProps) {
  const wmo = getWMOInfo(day.weatherCode, 1)
  const range = globalMax - globalMin || 1
  const lowPct = ((day.tempMin - globalMin) / range) * 100
  const highPct = ((day.tempMax - globalMin) / range) * 100

  return (
    <li className="grid h-11 grid-cols-[3rem_1.5rem_2.5rem_2rem_1fr_2rem] items-center gap-3">
      <span className={cn("text-sm", isToday ? "font-medium text-foreground" : "text-subtle-foreground")}>
        {day.label}
      </span>
      <HugeiconsIcon icon={wmo.icon} className="size-[18px] text-muted-foreground" aria-label={wmo.label} />
      <span className="font-mono text-xs text-muted-foreground">
        {day.precipProbMax > 10 ? `${day.precipProbMax}%` : ""}
      </span>
      <span className="text-right text-sm tabular-nums text-muted-foreground">
        {Math.round(day.tempMin)}°
      </span>
      <span className="relative h-1 rounded-full bg-muted">
        <span
          className="absolute inset-y-0 rounded-full"
          style={{
            left: `${lowPct}%`,
            width: `${Math.max(highPct - lowPct, 2)}%`,
            background: `linear-gradient(90deg, ${tempColor(day.tempMin, isCelsius)}, ${tempColor(day.tempMax, isCelsius)})`,
          }}
        />
      </span>
      <span className="text-right text-sm font-medium tabular-nums">{Math.round(day.tempMax)}°</span>
    </li>
  )
})

type DailyStripProps = { daily: DailyPoint[]; unit: WeatherUnit; className?: string }

export const DailyStrip = React.memo(function DailyStrip({ daily, unit, className }: DailyStripProps) {
  const globalMin = Math.min(...daily.map((d) => d.tempMin))
  const globalMax = Math.max(...daily.map((d) => d.tempMax))
  const isCelsius = unit === "celsius"

  return (
    <section className={cn("rounded-2xl border border-border bg-card p-5", className)}>
      <header className="flex items-baseline justify-between">
        <h2 className="text-sm font-medium">7-day forecast</h2>
        <span className="font-mono text-xs text-muted-foreground">Rain · low · high</span>
      </header>
      <ul className="mt-3">
        {daily.map((day, i) => (
          <DayRow
            key={day.time}
            day={day}
            globalMin={globalMin}
            globalMax={globalMax}
            isCelsius={isCelsius}
            isToday={i === 0}
          />
        ))}
      </ul>
    </section>
  )
})
