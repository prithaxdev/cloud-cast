import * as React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts"
import type { HourlyPoint } from "@/hooks/use-chart-data"
import type { WeatherUnit } from "@/components/weather-provider"
import { ChartContainer } from "./chart-container"
import { AXIS_TICK } from "./axis"
import { CustomTooltip } from "./custom-tooltip"

type Props = { data: HourlyPoint[]; unit: WeatherUnit }

// Only hours at UV 6 or above (high and up) take the accent
const HIGH_UV = 6

export default React.memo(function UVIndexChart({ data }: Props) {
  return (
    <ChartContainer
      title="UV index"
      meta={
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-sm bg-brand" />
          High, 6+
        </span>
      }
    >
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={AXIS_TICK} interval="preserveStartEnd" minTickGap={32} axisLine={false} tickLine={false} tickMargin={8} />
        <YAxis domain={[0, 12]} ticks={[0, 6, 12]} tick={AXIS_TICK} width={32} axisLine={false} tickLine={false} />
        <Tooltip content={CustomTooltip} cursor={{ fill: "var(--foreground)", fillOpacity: 0.04 }} />
        <Bar dataKey="uvIndex" name="UV index" radius={[2, 2, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.time}
              fill={entry.uvIndex >= HIGH_UV ? "var(--brand)" : "var(--muted-foreground)"}
              fillOpacity={entry.uvIndex >= HIGH_UV ? 1 : 0.5}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
})
