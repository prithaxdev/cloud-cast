import * as React from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea } from "recharts"
import type { HourlyPoint } from "@/hooks/use-chart-data"
import type { WeatherUnit } from "@/components/weather-provider"
import { ChartContainer } from "./chart-container"
import { AXIS_TICK } from "./axis"
import { CustomTooltip } from "./custom-tooltip"

type Props = { data: HourlyPoint[]; unit: WeatherUnit }

export default React.memo(function HumidityChart({ data }: Props) {
  return (
    <ChartContainer title="Humidity" meta="%, comfort band 40–60">
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="humidFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.16} />
            <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <ReferenceArea y1={40} y2={60} fill="var(--foreground)" fillOpacity={0.05} strokeOpacity={0} />
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={AXIS_TICK} interval="preserveStartEnd" minTickGap={32} axisLine={false} tickLine={false} tickMargin={8} />
        <YAxis tick={AXIS_TICK} domain={[0, 100]} ticks={[0, 50, 100]} width={32} axisLine={false} tickLine={false} />
        <Tooltip content={CustomTooltip} cursor={{ stroke: "var(--border)" }} />
        <Area
          type="monotone"
          dataKey="humidity"
          name="Humidity"
          unit="%"
          stroke="var(--color-chart-1)"
          fill="url(#humidFill)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3, strokeWidth: 0, fill: "var(--color-chart-1)" }}
        />
      </AreaChart>
    </ChartContainer>
  )
})
