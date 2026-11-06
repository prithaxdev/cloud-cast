import * as React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import type { HourlyPoint } from "@/hooks/use-chart-data"
import type { WeatherUnit } from "@/components/weather-provider"
import { ChartContainer } from "./chart-container"
import { AXIS_TICK } from "./axis"
import { CustomTooltip } from "./custom-tooltip"

type Props = { data: HourlyPoint[]; unit: WeatherUnit }

export default React.memo(function WindChart({ data, unit }: Props) {
  const windUnit = unit === "celsius" ? "km/h" : "mph"
  return (
    <ChartContainer title="Wind" meta={`${windUnit}, gusts dashed`}>
      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={AXIS_TICK} interval="preserveStartEnd" minTickGap={32} axisLine={false} tickLine={false} tickMargin={8} />
        <YAxis tick={AXIS_TICK} domain={[0, "auto"]} width={32} axisLine={false} tickLine={false} />
        <Tooltip content={CustomTooltip} cursor={{ stroke: "var(--border)" }} />
        <Line
          type="monotone"
          dataKey="windGust"
          name="Gusts"
          unit={` ${windUnit}`}
          stroke="var(--muted-foreground)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          dot={false}
          activeDot={{ r: 3, strokeWidth: 0, fill: "var(--muted-foreground)" }}
        />
        <Line
          type="monotone"
          dataKey="windSpeed"
          name="Speed"
          unit={` ${windUnit}`}
          stroke="var(--color-chart-1)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3, strokeWidth: 0, fill: "var(--color-chart-1)" }}
        />
      </LineChart>
    </ChartContainer>
  )
})
