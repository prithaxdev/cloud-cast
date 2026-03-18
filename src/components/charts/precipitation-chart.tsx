import * as React from "react"
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { CloudAngledRainIcon } from "@hugeicons/core-free-icons"
import type { HourlyPoint } from "@/hooks/use-chart-data"
import type { WeatherUnit } from "@/components/weather-provider"
import { ChartContainer } from "./chart-container"
import { CustomTooltip } from "./custom-tooltip"

type Props = { data: HourlyPoint[]; unit: WeatherUnit }

export default React.memo(function PrecipitationChart({ data }: Props) {
  return (
    <ChartContainer title="Precipitation" icon={CloudAngledRainIcon} iconColor="var(--color-chart-5)">
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="2 6" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" axisLine={false} tickLine={false} />
        <YAxis yAxisId="mm" unit="mm" tick={{ fontSize: 11 }} width={40} axisLine={false} tickLine={false} />
        <YAxis yAxisId="pct" orientation="right" unit="%" tick={{ fontSize: 11 }} domain={[0, 100]} width={35} axisLine={false} tickLine={false} />
        <Tooltip content={CustomTooltip} />
        <Bar
          yAxisId="mm"
          dataKey="precip"
          name="Precip (mm)"
          fill="var(--color-chart-5)"
          fillOpacity={0.8}
          radius={[3, 3, 0, 0]}
        />
        <Line
          yAxisId="pct"
          type="monotone"
          dataKey="precipProb"
          name="Prob (%)"
          stroke="var(--color-chart-1)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </ComposedChart>
    </ChartContainer>
  )
})
