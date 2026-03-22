import { Skeleton } from "@/components/ui/skeleton"
import { WeatherInsightsSkeleton } from "./weather-insights"

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 pb-12 pt-6">
      {/* Hero */}
      <Skeleton className="h-52 w-full rounded-2xl" />
      {/* Insights */}
      <WeatherInsightsSkeleton count={2} />
      {/* Map */}
      <Skeleton className="h-[220px] w-full rounded-2xl md:h-[256px]" />
      {/* Daily strip */}
      <div className="flex gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-28 flex-1 rounded-xl" />
        ))}
      </div>
      {/* Tab bar + content */}
      <div className="space-y-4">
        <Skeleton className="h-9 w-44 rounded-lg" />
        <div className="flex gap-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-16 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  )
}
