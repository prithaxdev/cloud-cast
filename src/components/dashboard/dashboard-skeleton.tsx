import { Skeleton } from "@/components/ui/skeleton"
import { WeatherInsightsSkeleton } from "./weather-insights"
import { ActivityWindowsSkeleton } from "./activity-windows"

export function DashboardSkeleton() {
  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-4 pt-6 pb-16 sm:px-6 lg:grid-cols-12 lg:px-8">
      <Skeleton className="h-[480px] rounded-2xl lg:col-span-8" />
      <div className="flex flex-col gap-4 lg:col-span-4">
        <WeatherInsightsSkeleton count={2} />
        <Skeleton className="h-60 rounded-2xl lg:h-auto lg:flex-1" />
      </div>
      <Skeleton className="h-96 rounded-2xl lg:col-span-5" />
      <ActivityWindowsSkeleton className="lg:col-span-7" />
      <div className="mt-4 space-y-4 lg:col-span-12">
        <Skeleton className="h-10 w-44 rounded-lg" />
        <Skeleton className="h-[480px] w-full rounded-2xl" />
      </div>
    </div>
  )
}
