import * as React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { FastWindIcon } from "@hugeicons/core-free-icons"
import type { HourlyPoint } from "@/hooks/use-chart-data"
import type { WeatherUnit } from "@/components/weather-provider"
import { ChartContainer } from "./chart-container"
import { CustomTooltip } from "./custom-tooltip"

type Props = { data: HourlyPoint[]; unit: WeatherUnit }

export default React.memo(function WindChart({ data, unit }: Props) {
  const windUnit = unit === "celsius" ? "km/h" : "mph"
  return (
    <ChartContainer title="Wind Speed" icon={FastWindIcon} iconColor="var(--color-chart-3)">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="2 6" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" axisLine={false} tickLine={false} />
        <YAxis unit={windUnit} tick={{ fontSize: 11 }} domain={["auto", "auto"]} width={50} axisLine={false} tickLine={false} />
        <Tooltip content={CustomTooltip} />
        <Line
          type="monotone"
          dataKey="windSpeed"
          name={`Speed (${windUnit})`}
          stroke="var(--color-chart-3)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
        <Line
          type="monotone"
          dataKey="windGust"
          name={`Gust (${windUnit})`}
          stroke="var(--color-chart-4)"
          strokeWidth={1.5}
          strokeDasharray="4 2"
          dot={false}
          activeDot={{ r: 3, strokeWidth: 0 }}
        />
      </LineChart>
    </ChartContainer>
  )
})
