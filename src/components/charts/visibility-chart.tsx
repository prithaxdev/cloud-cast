import * as React from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import type { HourlyPoint } from "@/hooks/use-chart-data"
import type { WeatherUnit } from "@/components/weather-provider"
import { ChartContainer } from "./chart-container"
import { AXIS_TICK } from "./axis"
import { CustomTooltip } from "./custom-tooltip"

type Props = { data: HourlyPoint[]; unit: WeatherUnit }

export default React.memo(function VisibilityChart({ data }: Props) {
  return (
    <ChartContainer title="Visibility" meta="km">
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="visFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.16} />
            <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={AXIS_TICK} interval="preserveStartEnd" minTickGap={32} axisLine={false} tickLine={false} tickMargin={8} />
        <YAxis tick={AXIS_TICK} domain={[0, "auto"]} width={32} axisLine={false} tickLine={false} />
        <Tooltip content={CustomTooltip} cursor={{ stroke: "var(--border)" }} />
        <Area
          type="monotone"
          dataKey="visibility"
          name="Visibility"
          unit=" km"
          stroke="var(--color-chart-1)"
          fill="url(#visFill)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3, strokeWidth: 0, fill: "var(--color-chart-1)" }}
        />
      </AreaChart>
    </ChartContainer>
  )
})
