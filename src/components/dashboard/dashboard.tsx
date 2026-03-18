import * as React from "react"
import { useWeather } from "@/hooks/use-weather"
import { useChartData } from "@/hooks/use-chart-data"
import { Tabs, TabsList, TabsTrigger, TabsIndicator, TabsPanel } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardSkeleton } from "./dashboard-skeleton"
import { HeroSection } from "./hero-section"
import { DailyStrip } from "./daily-strip"
import { HourlyTab } from "./hourly-tab"
import { ChartsTab } from "./charts-tab"

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
      <div className="mx-auto max-w-4xl px-4 pt-12 text-center text-muted-foreground">
        No weather data available.
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 pb-12 pt-6">
      <HeroSection />
      <React.Suspense fallback={<Skeleton className="h-[220px] rounded-2xl md:h-[256px]" />}>
        <LocationMap />
      </React.Suspense>
      <DailyStrip daily={daily} />
      <Tabs defaultValue="hourly">
        <TabsList className="w-fit">
          <TabsIndicator />
          <TabsTrigger value="hourly">Hourly</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>
        <TabsPanel value="hourly" className="pt-4">
          <HourlyTab data={hourly24} unit={unit} />
        </TabsPanel>
        <TabsPanel value="charts" className="pt-4">
          <ChartsTab data={hourly48} unit={unit} />
        </TabsPanel>
      </Tabs>
    </div>
  )
})

export default Dashboard
