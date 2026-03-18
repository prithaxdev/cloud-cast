import * as React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts"
import { Sun03Icon } from "@hugeicons/core-free-icons"
import type { HourlyPoint } from "@/hooks/use-chart-data"
import type { WeatherUnit } from "@/components/weather-provider"
import { getUVColor } from "@/lib/wmo"
import { ChartContainer } from "./chart-container"
import { CustomTooltip } from "./custom-tooltip"

type Props = { data: HourlyPoint[]; unit: WeatherUnit }

export default React.memo(function UVIndexChart({ data }: Props) {
  return (
    <ChartContainer title="UV Index" icon={Sun03Icon} iconColor="#F59E0B">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="2 6" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" axisLine={false} tickLine={false} />
        <YAxis domain={[0, 12]} tick={{ fontSize: 11 }} width={30} axisLine={false} tickLine={false} />
        <Tooltip content={CustomTooltip} />
        <Bar dataKey="uvIndex" name="UV Index" radius={[3, 3, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={getUVColor(entry.uvIndex)} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
})
