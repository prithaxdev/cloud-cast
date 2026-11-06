import * as React from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import type { HourlyPoint } from "@/hooks/use-chart-data"
import type { WeatherUnit } from "@/components/weather-provider"
import { ChartContainer } from "./chart-container"
import { AXIS_TICK } from "./axis"
import { CustomTooltip } from "./custom-tooltip"

type Props = { data: HourlyPoint[]; unit: WeatherUnit }

export default React.memo(function CloudCoverChart({ data }: Props) {
  return (
    <ChartContainer title="Cloud cover" meta="%">
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={AXIS_TICK} interval="preserveStartEnd" minTickGap={32} axisLine={false} tickLine={false} tickMargin={8} />
        <YAxis tick={AXIS_TICK} domain={[0, 100]} ticks={[0, 50, 100]} width={32} axisLine={false} tickLine={false} />
        <Tooltip content={CustomTooltip} cursor={{ stroke: "var(--border)" }} />
        <Area
          type="monotone"
          dataKey="cloudCover"
          name="Cloud cover"
          unit="%"
          stroke="var(--muted-foreground)"
          fill="var(--muted-foreground)"
          fillOpacity={0.16}
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 3, strokeWidth: 0, fill: "var(--muted-foreground)" }}
        />
      </AreaChart>
    </ChartContainer>
  )
})
