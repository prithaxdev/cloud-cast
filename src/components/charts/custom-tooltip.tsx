import type { TooltipContentProps } from "recharts"

// Gradient strokes come through as "url(#id)", which a swatch can't show
function swatch(color: string | undefined) {
  return !color || color.startsWith("url(") ? "var(--foreground)" : color
}

export function CustomTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="min-w-36 rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-[0_8px_24px_rgb(0_0_0/0.12)]">
      <p className="mb-1 font-mono text-muted-foreground">{String(label)}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <span
            className="size-2 flex-none rounded-full"
            style={{ backgroundColor: swatch(entry.color as string | undefined) }}
          />
          <span className="text-subtle-foreground">{entry.name}</span>
          <span className="ms-auto ps-3 font-medium tabular-nums">
            {typeof entry.value === "number"
              ? Number.isInteger(entry.value)
                ? entry.value
                : entry.value.toFixed(1)
              : entry.value}
            {entry.unit ?? ""}
          </span>
        </div>
      ))}
    </div>
  )
}
