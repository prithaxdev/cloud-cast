import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import type { HourlyPoint } from "@/hooks/use-chart-data"
import type { WeatherUnit } from "@/components/weather-provider"
import { getWMOInfo } from "@/lib/wmo"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { NowMark } from "@/components/now-mark"

const TemperatureChart = React.lazy(() => import("@/components/charts/temperature-chart"))

type HourColumnProps = { point: HourlyPoint; isCurrent: boolean }

const HourColumn = React.memo(function HourColumn({ point, isCurrent }: HourColumnProps) {
  const wmo = getWMOInfo(point.weatherCode, point.isDay)
  return (
    <li className="flex min-w-12 flex-1 flex-col items-center gap-2 py-1 text-center">
      {isCurrent ? (
        <NowMark />
      ) : (
        <span className="font-mono text-xs leading-4 text-muted-foreground">{point.label}</span>
      )}
      <HugeiconsIcon icon={wmo.icon} className="size-[18px] text-muted-foreground" aria-label={wmo.label} />
      <span className="text-sm font-medium tabular-nums">{Math.round(point.temp)}°</span>
      <span className="h-4 font-mono text-xs text-muted-foreground">
        {point.precipProb > 20 ? `${point.precipProb}%` : ""}
      </span>
    </li>
  )
})

type HourlyTabProps = { data: HourlyPoint[]; unit: WeatherUnit }

export const HourlyTab = React.memo(function HourlyTab({ data, unit }: HourlyTabProps) {
  return (
    <section className="rounded-2xl border border-border bg-card">
      <div className="px-5 pt-5">
        <h2 className="text-sm font-medium">Next 24 hours</h2>
      </div>
      <ScrollArea orientation="horizontal" className="w-full">
        <ul className="flex px-3 pt-4 pb-2">
          {data.map((point, i) => (
            <HourColumn key={point.time} point={point} isCurrent={i === 0} />
          ))}
        </ul>
      </ScrollArea>
      <div className="border-t border-border p-5">
        <React.Suspense fallback={<Skeleton className="h-80 w-full rounded-xl" />}>
          <TemperatureChart data={data} unit={unit} />
        </React.Suspense>
      </div>
    </section>
  )
})
