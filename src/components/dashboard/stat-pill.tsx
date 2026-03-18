import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"

type StatPillProps = {
  icon: IconSvgElement
  value: string
  label: string
  accentColor?: string
}

export const StatPill = React.memo(function StatPill({ icon, value, label, accentColor }: StatPillProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/80 px-4 py-3 backdrop-blur-sm">
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-lg"
        style={accentColor ? { backgroundColor: `${accentColor}18` } : undefined}
      >
        <HugeiconsIcon
          icon={icon}
          className="size-5"
          style={accentColor ? { color: accentColor } : undefined}
        />
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold tabular-nums">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  )
})
