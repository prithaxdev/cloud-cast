import * as React from "react"
import type { HourlyPoint } from "@/hooks/use-chart-data"
import type { WeatherUnit } from "@/components/weather-provider"
import { Skeleton } from "@/components/ui/skeleton"

const PrecipitationChart = React.lazy(() => import("@/components/charts/precipitation-chart"))
const WindChart = React.lazy(() => import("@/components/charts/wind-chart"))
const HumidityChart = React.lazy(() => import("@/components/charts/humidity-chart"))
const CloudCoverChart = React.lazy(() => import("@/components/charts/cloud-cover-chart"))
const PressureChart = React.lazy(() => import("@/components/charts/pressure-chart"))
const UVIndexChart = React.lazy(() => import("@/components/charts/uv-index-chart"))
const VisibilityChart = React.lazy(() => import("@/components/charts/visibility-chart"))

function ChartSkeleton({ className = "h-60" }: { className?: string }) {
  return <Skeleton className={`w-full rounded-2xl ${className}`} />
}

type ChartsTabProps = { data: HourlyPoint[]; unit: WeatherUnit }

// Precipitation leads at full width; the other six sit smaller beneath it.
export const ChartsTab = React.memo(function ChartsTab({ data, unit }: ChartsTabProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <React.Suspense fallback={<ChartSkeleton className="h-96 sm:col-span-2 lg:col-span-3" />}>
        <PrecipitationChart data={data} unit={unit} className="sm:col-span-2 lg:col-span-3" />
      </React.Suspense>
      <React.Suspense fallback={<ChartSkeleton />}>
        <WindChart data={data} unit={unit} />
      </React.Suspense>
      <React.Suspense fallback={<ChartSkeleton />}>
        <HumidityChart data={data} unit={unit} />
      </React.Suspense>
      <React.Suspense fallback={<ChartSkeleton />}>
        <CloudCoverChart data={data} unit={unit} />
      </React.Suspense>
      <React.Suspense fallback={<ChartSkeleton />}>
        <PressureChart data={data} unit={unit} />
      </React.Suspense>
      <React.Suspense fallback={<ChartSkeleton />}>
        <UVIndexChart data={data} unit={unit} />
      </React.Suspense>
      <React.Suspense fallback={<ChartSkeleton />}>
        <VisibilityChart data={data} unit={unit} />
      </React.Suspense>
    </div>
  )
})
