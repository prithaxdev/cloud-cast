import type { TooltipContentProps } from "recharts"

export function CustomTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-border bg-popover p-2 text-xs shadow-md">
      <p className="mb-1.5 font-medium text-muted-foreground">{String(label)}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span
            className="size-2 flex-none rounded-full"
            style={{ backgroundColor: entry.color as string }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium">
            {typeof entry.value === "number" ? entry.value.toFixed(1) : entry.value}
            {entry.unit ?? ""}
          </span>
        </div>
      ))}
    </div>
  )
}
