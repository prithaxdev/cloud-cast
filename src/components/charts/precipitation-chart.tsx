import * as React from "react"
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import type { HourlyPoint } from "@/hooks/use-chart-data"
import type { WeatherUnit } from "@/components/weather-provider"
import { ChartContainer } from "./chart-container"
import { AXIS_TICK } from "./axis"
import { CustomTooltip } from "./custom-tooltip"

type Props = { data: HourlyPoint[]; unit: WeatherUnit; className?: string }

export default React.memo(function PrecipitationChart({ data, className }: Props) {
  return (
    <ChartContainer
      title="Precipitation, next 48 hours"
      height={280}
      className={className}
      meta={
        <span className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-sm bg-chart-1" />
            Amount, mm
          </span>
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-4 rounded-full bg-muted-foreground" />
            Chance, %
          </span>
        </span>
      }
    >
      <ComposedChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={AXIS_TICK} interval="preserveStartEnd" minTickGap={32} axisLine={false} tickLine={false} tickMargin={8} />
        <YAxis yAxisId="mm" tick={AXIS_TICK} width={36} axisLine={false} tickLine={false} />
        <YAxis yAxisId="pct" orientation="right" unit="%" tick={AXIS_TICK} domain={[0, 100]} width={44} axisLine={false} tickLine={false} />
        <Tooltip content={CustomTooltip} cursor={{ fill: "var(--foreground)", fillOpacity: 0.04 }} />
        <Bar yAxisId="mm" dataKey="precip" name="Amount" unit=" mm" fill="var(--color-chart-1)" radius={[2, 2, 0, 0]} />
        <Line
          yAxisId="pct"
          type="monotone"
          dataKey="precipProb"
          name="Chance"
          unit="%"
          stroke="var(--muted-foreground)"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 3, strokeWidth: 0, fill: "var(--muted-foreground)" }}
        />
      </ComposedChart>
    </ChartContainer>
  )
})
