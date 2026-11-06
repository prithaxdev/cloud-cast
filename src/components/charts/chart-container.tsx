import * as React from "react"
import { ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type ChartContainerProps = {
  title: string
  meta?: React.ReactNode
  height?: number
  className?: string
  children: React.ReactNode
}

export function ChartContainer({ title, meta, height = 160, className, children }: ChartContainerProps) {
  return (
    <Card className={cn("min-w-0", className)}>
      <CardHeader>
        <div className="flex items-baseline justify-between gap-4">
          <CardTitle>{title}</CardTitle>
          {meta && <span className="text-xs text-muted-foreground">{meta}</span>}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {children as React.ReactElement}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
