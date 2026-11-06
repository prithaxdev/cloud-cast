import { lazy, Suspense } from "react"
import { TopBar } from "@/components/top-bar"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"

const Dashboard = lazy(() => import("@/components/dashboard/dashboard"))

export function App() {
  return (
    <main className="min-h-svh">
      <TopBar />
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
      </Suspense>
    </main>
  )
}

export default App
