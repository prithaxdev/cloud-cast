import * as React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import type { HourlyPoint } from "@/hooks/use-chart-data"
import type { WeatherUnit } from "@/components/weather-provider"
import { ChartContainer } from "./chart-container"
import { AXIS_TICK } from "./axis"
import { CustomTooltip } from "./custom-tooltip"

type Props = { data: HourlyPoint[]; unit: WeatherUnit }

export default React.memo(function PressureChart({ data }: Props) {
  return (
    <ChartContainer title="Pressure" meta="hPa, sea level">
      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={AXIS_TICK} interval="preserveStartEnd" minTickGap={32} axisLine={false} tickLine={false} tickMargin={8} />
        <YAxis tick={AXIS_TICK} domain={["dataMin - 2", "dataMax + 2"]} allowDecimals={false} width={44} axisLine={false} tickLine={false} />
        <Tooltip content={CustomTooltip} cursor={{ stroke: "var(--border)" }} />
        <Line
          type="monotone"
          dataKey="pressure"
          name="Pressure"
          unit=" hPa"
          stroke="var(--color-chart-1)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3, strokeWidth: 0, fill: "var(--color-chart-1)" }}
        />
      </LineChart>
    </ChartContainer>
  )
})
