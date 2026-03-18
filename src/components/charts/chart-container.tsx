import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import { ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type ChartContainerProps = {
  title: string
  icon?: IconSvgElement
  iconColor?: string
  badge?: React.ReactNode
  height?: number
  children: React.ReactNode
}

export function ChartContainer({ title, icon, iconColor, badge, height = 220, children }: ChartContainerProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && (
              <div
                className="flex size-7 items-center justify-center rounded-lg"
                style={{ backgroundColor: iconColor ? `${iconColor}18` : undefined }}
              >
                <HugeiconsIcon
                  icon={icon}
                  className="size-4"
                  style={{ color: iconColor }}
                />
              </div>
            )}
            <CardTitle>{title}</CardTitle>
          </div>
          {badge}
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
