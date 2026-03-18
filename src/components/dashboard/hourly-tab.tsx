import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { RainDropIcon } from "@hugeicons/core-free-icons"
import type { HourlyPoint } from "@/hooks/use-chart-data"
import type { WeatherUnit } from "@/components/weather-provider"
import { getWMOInfo } from "@/lib/wmo"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

const TemperatureChart = React.lazy(() => import("@/components/charts/temperature-chart"))

type HourCardProps = {
  point: HourlyPoint
  isCurrent: boolean
  cardRef?: React.Ref<HTMLDivElement>
}

const HourCard = React.memo(function HourCard({ point, isCurrent, cardRef }: HourCardProps) {
  const wmo = getWMOInfo(point.weatherCode, point.isDay)
  return (
    <div
      ref={cardRef}
      className={`flex min-w-[68px] flex-col items-center gap-1.5 rounded-xl border px-2.5 py-3 text-center transition-all ${
        isCurrent
          ? "border-primary/30 bg-primary/10 shadow-sm shadow-primary/10 ring-1 ring-primary/20"
          : "border-border/60 bg-card/80 hover:bg-card"
      }`}
    >
      <span className={`text-[10px] font-medium uppercase tracking-wide ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>
        {isCurrent ? "Now" : point.label}
      </span>

      <div
        className="flex size-8 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${wmo.color}15` }}
      >
        <HugeiconsIcon
          icon={wmo.icon}
          className="size-4.5"
          style={{ color: wmo.color }}
        />
      </div>

      <span className="text-sm font-semibold tabular-nums">{Math.round(point.temp)}°</span>

      {point.precipProb > 20 ? (
        <div className="flex items-center gap-0.5">
          <HugeiconsIcon icon={RainDropIcon} className="size-2.5 text-blue-400" />
          <span className="text-[10px] tabular-nums text-blue-400">{point.precipProb}%</span>
        </div>
      ) : (
        <div className="h-3.5" />
      )}
    </div>
  )
})

type HourlyTabProps = { data: HourlyPoint[]; unit: WeatherUnit }

export const HourlyTab = React.memo(function HourlyTab({ data, unit }: HourlyTabProps) {
  const currentRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    currentRef.current?.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" })
  }, [])

  return (
    <div className="space-y-4">
      <ScrollArea orientation="horizontal" className="w-full">
        <div className="flex gap-1.5 pb-2">
          {data.map((point, i) => (
            <HourCard
              key={point.time}
              point={point}
              isCurrent={i === 0}
              cardRef={i === 0 ? currentRef : undefined}
            />
          ))}
        </div>
      </ScrollArea>

      <React.Suspense fallback={<Skeleton className="h-[268px] w-full rounded-xl" />}>
        <TemperatureChart data={data} unit={unit} />
      </React.Suspense>
    </div>
  )
})
