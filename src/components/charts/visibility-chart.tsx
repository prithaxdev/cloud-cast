import * as React from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { EyeIcon } from "@hugeicons/core-free-icons"
import type { HourlyPoint } from "@/hooks/use-chart-data"
import type { WeatherUnit } from "@/components/weather-provider"
import { ChartContainer } from "./chart-container"
import { CustomTooltip } from "./custom-tooltip"

type Props = { data: HourlyPoint[]; unit: WeatherUnit }

export default React.memo(function VisibilityChart({ data }: Props) {
  return (
    <ChartContainer title="Visibility" icon={EyeIcon} iconColor="var(--color-chart-3)">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="visGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-chart-3)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="var(--color-chart-3)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="2 6" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" axisLine={false} tickLine={false} />
        <YAxis unit=" km" tick={{ fontSize: 11 }} domain={["auto", "auto"]} width={45} axisLine={false} tickLine={false} />
        <Tooltip content={CustomTooltip} />
        <Area
          type="monotone"
          dataKey="visibility"
          name="Visibility (km)"
          stroke="var(--color-chart-3)"
          fill="url(#visGrad)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ChartContainer>
  )
})
