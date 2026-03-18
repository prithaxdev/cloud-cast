import * as React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Compass01Icon } from "@hugeicons/core-free-icons"
import type { HourlyPoint } from "@/hooks/use-chart-data"
import type { WeatherUnit } from "@/components/weather-provider"
import { ChartContainer } from "./chart-container"
import { CustomTooltip } from "./custom-tooltip"

type Props = { data: HourlyPoint[]; unit: WeatherUnit }

export default React.memo(function PressureChart({ data }: Props) {
  return (
    <ChartContainer title="Pressure" icon={Compass01Icon} iconColor="var(--color-chart-1)">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="2 6" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" axisLine={false} tickLine={false} />
        <YAxis unit=" hPa" tick={{ fontSize: 11 }} domain={["auto", "auto"]} width={65} axisLine={false} tickLine={false} />
        <Tooltip content={CustomTooltip} />
        <Line
          type="monotone"
          dataKey="pressure"
          name="Pressure (hPa)"
          stroke="var(--color-chart-1)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </LineChart>
    </ChartContainer>
  )
})
