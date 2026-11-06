import * as React from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts"
import type { HourlyPoint } from "@/hooks/use-chart-data"
import type { WeatherUnit } from "@/components/weather-provider"
import { tempColor } from "@/lib/temperature"
import { CustomTooltip } from "./custom-tooltip"
import { AXIS_TICK } from "./axis"

type Props = { data: HourlyPoint[]; unit: WeatherUnit }

// Runs of consecutive night hours, shaded behind the curve
function nightRanges(data: HourlyPoint[]) {
  const ranges: { from: string; to: string }[] = []
  let start: number | null = null
  data.forEach((p, i) => {
    if (p.isDay === 0 && start === null) start = i
    const endsHere = p.isDay === 0 && (i === data.length - 1 || data[i + 1].isDay === 1)
    if (endsHere && start !== null) {
      ranges.push({ from: data[start].label, to: data[i].label })
      start = null
    }
  })
  return ranges
}

export default React.memo(function TemperatureChart({ data, unit }: Props) {
  const isCelsius = unit === "celsius"
  const last = Math.max(data.length - 1, 1)
  const nights = React.useMemo(() => nightRanges(data), [data])

  return (
    <figure>
      <figcaption className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <span className="text-sm font-medium text-foreground">Temperature</span>
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-4 rounded-full bg-foreground/70" />
          Actual
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 border-t border-dashed border-muted-foreground" />
          Feels like
        </span>
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-sm bg-foreground/[0.06]" />
          Night
        </span>
      </figcaption>
      <ResponsiveContainer width="100%" height={288} className="mt-4">
        <AreaChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="tempInk" x1="0" y1="0" x2="1" y2="0">
              {data.map((p, i) => (
                <stop key={p.time} offset={i / last} stopColor={tempColor(p.temp, isCelsius)} />
              ))}
            </linearGradient>
            <linearGradient id="tempInkFill" x1="0" y1="0" x2="1" y2="0">
              {data.map((p, i) => (
                <stop
                  key={p.time}
                  offset={i / last}
                  stopColor={tempColor(p.temp, isCelsius)}
                  stopOpacity={0.12}
                />
              ))}
            </linearGradient>
          </defs>
          {nights.map((n) => (
            <ReferenceArea
              key={n.from}
              x1={n.from}
              x2={n.to}
              fill="var(--foreground)"
              fillOpacity={0.05}
              strokeOpacity={0}
              ifOverflow="visible"
            />
          ))}
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={AXIS_TICK}
            interval="preserveStartEnd"
            minTickGap={24}
            axisLine={false}
            tickLine={false}
            tickMargin={8}
          />
          <YAxis
            tick={AXIS_TICK}
            tickFormatter={(v: number) => `${v}°`}
            domain={["dataMin - 2", "dataMax + 2"]}
            allowDecimals={false}
            width={36}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={CustomTooltip} cursor={{ stroke: "var(--border)" }} />
          <Area
            type="monotone"
            dataKey="feelsLike"
            name="Feels like"
            unit="°"
            stroke="var(--muted-foreground)"
            fill="none"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            activeDot={{ r: 3, strokeWidth: 0, fill: "var(--muted-foreground)" }}
          />
          <Area
            type="monotone"
            dataKey="temp"
            name="Temperature"
            unit="°"
            stroke="url(#tempInk)"
            fill="url(#tempInkFill)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)", fill: "var(--foreground)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </figure>
  )
})
