import * as React from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { ThermometerIcon } from "@hugeicons/core-free-icons"
import type { HourlyPoint } from "@/hooks/use-chart-data"
import type { WeatherUnit } from "@/components/weather-provider"
import { ChartContainer } from "./chart-container"
import { CustomTooltip } from "./custom-tooltip"

type Props = { data: HourlyPoint[]; unit: WeatherUnit }

export default React.memo(function TemperatureChart({ data, unit }: Props) {
  const tempUnit = unit === "celsius" ? "°C" : "°F"
  return (
    <ChartContainer title="Temperature" icon={ThermometerIcon} iconColor="var(--color-chart-1)">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="feelsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.2} />
            <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="2 6" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" axisLine={false} tickLine={false} />
        <YAxis unit={tempUnit} tick={{ fontSize: 11 }} domain={["auto", "auto"]} width={45} axisLine={false} tickLine={false} />
        <Tooltip content={CustomTooltip} />
        <Area
          type="monotone"
          dataKey="temp"
          name={`Temp (${tempUnit})`}
          stroke="var(--color-chart-1)"
          fill="url(#tempGrad)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
        <Area
          type="monotone"
          dataKey="feelsLike"
          name={`Feels Like (${tempUnit})`}
          stroke="var(--color-chart-2)"
          fill="url(#feelsGrad)"
          strokeWidth={1.5}
          strokeDasharray="4 2"
          dot={false}
          activeDot={{ r: 3, strokeWidth: 0 }}
        />
      </AreaChart>
    </ChartContainer>
  )
})
