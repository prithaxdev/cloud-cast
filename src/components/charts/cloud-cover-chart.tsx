import * as React from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { CloudIcon } from "@hugeicons/core-free-icons"
import type { HourlyPoint } from "@/hooks/use-chart-data"
import type { WeatherUnit } from "@/components/weather-provider"
import { ChartContainer } from "./chart-container"
import { CustomTooltip } from "./custom-tooltip"

type Props = { data: HourlyPoint[]; unit: WeatherUnit }

export default React.memo(function CloudCoverChart({ data }: Props) {
  return (
    <ChartContainer title="Cloud Cover" icon={CloudIcon} iconColor="var(--color-chart-2)">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="2 6" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" axisLine={false} tickLine={false} />
        <YAxis unit="%" tick={{ fontSize: 11 }} domain={[0, 100]} width={40} axisLine={false} tickLine={false} />
        <Tooltip content={CustomTooltip} />
        <Area
          type="monotone"
          dataKey="cloudCover"
          name="Cloud Cover (%)"
          stroke="var(--color-chart-2)"
          fill="url(#cloudGrad)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ChartContainer>
  )
})
