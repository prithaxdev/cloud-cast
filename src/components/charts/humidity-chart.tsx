import * as React from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts"
import { HumidityIcon } from "@hugeicons/core-free-icons"
import type { HourlyPoint } from "@/hooks/use-chart-data"
import type { WeatherUnit } from "@/components/weather-provider"
import { ChartContainer } from "./chart-container"
import { CustomTooltip } from "./custom-tooltip"

type Props = { data: HourlyPoint[]; unit: WeatherUnit }

export default React.memo(function HumidityChart({ data }: Props) {
  return (
    <ChartContainer title="Humidity" icon={HumidityIcon} iconColor="var(--color-chart-4)">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="humidGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-chart-4)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-chart-4)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="2 6" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" axisLine={false} tickLine={false} />
        <YAxis unit="%" tick={{ fontSize: 11 }} domain={[0, 100]} width={40} axisLine={false} tickLine={false} />
        <Tooltip content={CustomTooltip} />
        <ReferenceLine y={40} stroke="var(--color-chart-4)" strokeDasharray="3 3" strokeOpacity={0.4} />
        <ReferenceLine y={60} stroke="var(--color-chart-4)" strokeDasharray="3 3" strokeOpacity={0.4} />
        <Area
          type="monotone"
          dataKey="humidity"
          name="Humidity (%)"
          stroke="var(--color-chart-4)"
          fill="url(#humidGrad)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ChartContainer>
  )
})
