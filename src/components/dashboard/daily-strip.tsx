import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { RainDropIcon } from "@hugeicons/core-free-icons"
import type { DailyPoint } from "@/hooks/use-chart-data"
import { getWMOInfo } from "@/lib/wmo"
import { ScrollArea } from "@/components/ui/scroll-area"

type DayCardProps = { day: DailyPoint; globalMin: number; globalMax: number }

const DayCard = React.memo(function DayCard({ day, globalMin, globalMax }: DayCardProps) {
  const wmo = getWMOInfo(day.weatherCode, 1)
  const range = globalMax - globalMin || 1
  const lowPct  = ((day.tempMin - globalMin) / range) * 100
  const highPct = ((day.tempMax - globalMin) / range) * 100

  return (
    <div className="group flex min-w-[88px] flex-col items-center gap-2 rounded-xl border border-border/60 bg-card/80 px-3 py-3.5 text-center backdrop-blur-sm transition-colors hover:bg-card">
      <span className="text-xs font-medium text-muted-foreground">{day.label}</span>

      <div
        className="flex size-9 items-center justify-center rounded-lg transition-all"
        style={{ backgroundColor: `${wmo.color}15` }}
      >
        <HugeiconsIcon
          icon={wmo.icon}
          className="size-5"
          style={{ color: wmo.color }}
        />
      </div>

      {/* Temp high / low */}
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-sm font-semibold tabular-nums">{Math.round(day.tempMax)}°</span>
        <span className="text-xs tabular-nums text-muted-foreground">{Math.round(day.tempMin)}°</span>
      </div>

      {/* Temp range bar */}
      <div className="relative h-1 w-10 rounded-full bg-muted">
        <div
          className="absolute top-0 h-1 rounded-full"
          style={{
            left: `${lowPct}%`,
            width: `${highPct - lowPct}%`,
            background: "linear-gradient(90deg, #60A5FA, #F59E0B)",
          }}
        />
      </div>

      {/* Precip probability */}
      {day.precipProbMax > 10 && (
        <div className="flex items-center gap-0.5">
          <HugeiconsIcon icon={RainDropIcon} className="size-3 text-blue-400" />
          <span className="text-[10px] tabular-nums text-muted-foreground">{day.precipProbMax}%</span>
        </div>
      )}
    </div>
  )
})

type DailyStripProps = { daily: DailyPoint[] }

export const DailyStrip = React.memo(function DailyStrip({ daily }: DailyStripProps) {
  const globalMin = Math.min(...daily.map((d) => d.tempMin))
  const globalMax = Math.max(...daily.map((d) => d.tempMax))

  return (
    <ScrollArea orientation="horizontal" className="w-full">
      <div className="flex gap-2 pb-2">
        {daily.map((day) => (
          <DayCard key={day.time} day={day} globalMin={globalMin} globalMax={globalMax} />
        ))}
      </div>
    </ScrollArea>
  )
})
