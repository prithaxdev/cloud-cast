import * as React from "react"
import { mountSundial, type SundialHandle } from "@/lib/hairline"

type SunDialProps = {
  sunrise: string // "YYYY-MM-DDTHH:MM", location-local
  sunset: string
  nowMinutes: number // minutes since local midnight
  latitude: number
}

function toMinutes(iso: string) {
  const [h, m] = iso.substring(11, 16).split(":").map(Number)
  return h * 60 + m
}

function toClock(iso: string) {
  const [h, m] = iso.substring(11, 16).split(":").map(Number)
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`
}

function duration(min: number) {
  const h = Math.floor(min / 60)
  const m = Math.round(min % 60)
  return h > 0 ? `${h} h ${String(m).padStart(2, "0")} m` : `${m} m`
}

// The figure's hairline palette, taken from the app's ramp; its one bright
// mark, the hour now, takes the brand orange.
const PALETTE = {
  "--hairline-plate": "var(--card)",
  "--hairline-hi": "var(--brand)",
  "--hairline-edge": "color-mix(in srgb, var(--muted-foreground) 80%, var(--card))",
  "--hairline-mid": "color-mix(in srgb, var(--muted-foreground) 55%, var(--card))",
  "--hairline-lo": "color-mix(in srgb, var(--muted-foreground) 28%, var(--card))",
} as React.CSSProperties

/** The figure's read-out, "14:00" or "05:00 · dark", as the hour it names, or null at rest. */
function readHour(text: string) {
  const m = /^(\d{2}):00/.exec(text)
  return m ? Number(m[1]) : null
}

export function SunDial({ sunrise, sunset, nowMinutes, latitude }: SunDialProps) {
  const stageRef = React.useRef<HTMLDivElement>(null)
  const handleRef = React.useRef<SundialHandle | null>(null)
  const [reading, setReading] = React.useState("rest")
  const rise = toMinutes(sunrise)
  const set = toMinutes(sunset)

  // The dial's geometry depends on the latitude only; the day moves on below
  // without a remount, so a hand on the dial survives the clock ticking.
  const firstDay = React.useEffectEvent(() => ({ rise: rise / 60, set: set / 60, now: nowMinutes / 60 }))
  React.useEffect(() => {
    if (!stageRef.current) return
    const handle = mountSundial(stageRef.current, { lat: latitude, ...firstDay() }, setReading)
    handleRef.current = handle
    return () => {
      handle.destroy()
      handleRef.current = null
    }
  }, [latitude])

  React.useEffect(() => {
    handleRef.current?.update({ rise: rise / 60, set: set / 60, now: nowMinutes / 60 })
  }, [rise, set, nowMinutes])

  const isUp = nowMinutes >= rise && nowMinutes <= set
  const status = isUp
    ? `Sunset in ${duration(set - nowMinutes)}`
    : nowMinutes < rise
      ? `Sunrise in ${duration(rise - nowMinutes)}`
      : `Sun set ${duration(nowMinutes - set)} ago`

  // While a hand is on the dial, the caption names the hour it points at.
  const hour = readHour(reading)
  const pointed =
    hour === null
      ? null
      : {
          time: `${hour % 12 || 12} ${hour >= 12 ? "PM" : "AM"}`,
          light: hour * 60 < rise ? "Before sunrise" : hour * 60 > set ? "After sunset" : "Sun up",
        }

  return (
    <figure className="w-full">
      {/* The stage is drawn 400 × 320; it is scaled past the frame so the dial fills it. */}
      <div className="relative aspect-[5/4] overflow-hidden">
        <div
          ref={stageRef}
          role="img"
          aria-label={`Sundial with the daylight hours lit, ${toClock(sunrise)} to ${toClock(sunset)}. ${status}. Move the pointer around the dial to read another hour.`}
          className="absolute top-[-22%] left-[-20%] w-[140%]"
          style={PALETTE}
        />
      </div>
      <figcaption className="mt-2 grid grid-cols-[auto_1fr_auto] items-end gap-4 text-xs">
        <div>
          <p className="text-muted-foreground">Sunrise</p>
          <p className="mt-0.5 font-mono text-[13px] text-foreground">{toClock(sunrise)}</p>
        </div>
        <div className="text-center">
          <p className="text-[13px] text-subtle-foreground">{pointed ? pointed.time : status}</p>
          <p className="mt-0.5 font-mono text-muted-foreground">
            {pointed ? pointed.light : `${duration(set - rise)} of daylight`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground">Sunset</p>
          <p className="mt-0.5 font-mono text-[13px] text-foreground">{toClock(sunset)}</p>
        </div>
      </figcaption>
    </figure>
  )
}
