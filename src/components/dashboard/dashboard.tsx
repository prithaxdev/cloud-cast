import * as React from "react"
import { useWeather } from "@/hooks/use-weather"
import { useChartData } from "@/hooks/use-chart-data"
import { Tabs, TabsList, TabsTrigger, TabsIndicator, TabsPanel } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardSkeleton } from "./dashboard-skeleton"
import { HeroSection } from "./hero-section"
import { WeatherInsights } from "./weather-insights"
import { DailyStrip } from "./daily-strip"
import { HourlyTab } from "./hourly-tab"
import { ChartsTab } from "./charts-tab"
import { ActivityWindows } from "./activity-windows"

const LocationMap = React.lazy(() =>
  import("./location-map").then((m) => ({ default: m.LocationMap }))
)

const Dashboard = React.memo(function Dashboard() {
  const { weather, loading, unit } = useWeather()
  const { hourly24, hourly48, daily } = useChartData(weather)

  if (loading && !weather) {
    return <DashboardSkeleton />
  }

  if (!weather) {
    return (
      <div className="mx-auto max-w-7xl px-4 pt-12 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
        No weather data available
      </div>
    )
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl animate-in grid-cols-1 gap-4 px-4 pt-6 pb-16 duration-500 ease-out fade-in slide-in-from-bottom-2 motion-reduce:animate-none sm:px-6 lg:grid-cols-12 lg:px-8">
      <HeroSection className="lg:col-span-8" />
      <div className="flex flex-col gap-4 lg:col-span-4">
        <WeatherInsights />
        <React.Suspense fallback={<Skeleton className="h-60 rounded-2xl lg:flex-1" />}>
          <LocationMap className="h-60 lg:h-auto lg:min-h-60 lg:flex-1" />
        </React.Suspense>
      </div>
      <DailyStrip daily={daily} unit={unit} className="lg:col-span-5" />
      <ActivityWindows className="lg:col-span-7" />
      <Tabs defaultValue="hourly" className="mt-4 gap-4 lg:col-span-12">
        <TabsList className="w-fit">
          <TabsIndicator />
          <TabsTrigger value="hourly">Hourly</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>
        <TabsPanel value="hourly">
          <HourlyTab data={hourly24} unit={unit} />
        </TabsPanel>
        <TabsPanel value="charts">
          <ChartsTab data={hourly48} unit={unit} />
        </TabsPanel>
      </Tabs>
    </div>
  )
})

export default Dashboard
