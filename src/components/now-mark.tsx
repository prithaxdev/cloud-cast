import type * as React from "react"
import { cn } from "@/lib/utils"

// The one signature detail: a short orange tick and a mono "Now" that marks
// the present moment wherever the forecast has a timeline.
export function NowMark({
  className,
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-xs text-foreground",
        className
      )}
      style={style}
    >
      <span aria-hidden className="h-3 w-0.5 rounded-full bg-brand" />
      Now
    </span>
  )
}
