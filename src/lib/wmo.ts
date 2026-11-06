import type { IconSvgElement } from "@hugeicons/react"
import type { WMOCode } from "@/types"
import {
  Sun01Icon,
  Moon01Icon,
  SunCloud01Icon,
  MoonCloudIcon,
  CloudIcon,
  CloudSlowWindIcon,
  MoonCloudLittleRainIcon,
  MoonCloudMidRainIcon,
  MoonCloudBigRainIcon,
  MoonCloudAngledRainIcon,
  MoonCloudAngledZapIcon,
  MoonAngledRainZapIcon,
  MoonCloudHailstoneIcon,
  MoonCloudLittleSnowIcon,
  MoonCloudMidSnowIcon,
  MoonCloudSnowIcon,
  SunCloudLittleRainIcon,
  SunCloudMidRainIcon,
  SunCloudBigRainIcon,
  SunCloudAngledRainIcon,
  SunCloudAngledZapIcon,
  SunCloudAngledRainZapIcon,
  SunCloudLittleSnowIcon,
  SunCloudMidSnowIcon,
  SunCloudSnowIcon,
  CloudLittleRainIcon,
  CloudMidRainIcon,
  CloudBigRainIcon,
  CloudAngledRainIcon,
  CloudAngledRainZapIcon,
  CloudAngledZapIcon,
  CloudHailstoneIcon,
  CloudLittleSnowIcon,
  CloudMidSnowIcon,
} from "@hugeicons/core-free-icons"

export type WMOInfo = {
  label: string
  dayIcon: IconSvgElement
  nightIcon: IconSvgElement
}

const WMO_MAP: Record<number, WMOInfo> = {
  0:  { label: "Clear sky",                   dayIcon: Sun01Icon,                nightIcon: Moon01Icon },
  1:  { label: "Mainly clear",                dayIcon: Sun01Icon,                nightIcon: Moon01Icon },
  2:  { label: "Partly cloudy",               dayIcon: SunCloud01Icon,           nightIcon: MoonCloudIcon },
  3:  { label: "Overcast",                    dayIcon: CloudIcon,                nightIcon: CloudIcon },
  45: { label: "Fog",                         dayIcon: CloudSlowWindIcon,        nightIcon: CloudSlowWindIcon },
  48: { label: "Rime fog",                    dayIcon: CloudSlowWindIcon,        nightIcon: CloudSlowWindIcon },
  51: { label: "Light drizzle",               dayIcon: SunCloudLittleRainIcon,   nightIcon: MoonCloudLittleRainIcon },
  53: { label: "Moderate drizzle",            dayIcon: SunCloudMidRainIcon,      nightIcon: MoonCloudMidRainIcon },
  55: { label: "Dense drizzle",               dayIcon: CloudLittleRainIcon,      nightIcon: CloudLittleRainIcon },
  56: { label: "Light freezing drizzle",      dayIcon: SunCloudLittleSnowIcon,   nightIcon: MoonCloudLittleSnowIcon },
  57: { label: "Heavy freezing drizzle",      dayIcon: SunCloudMidSnowIcon,      nightIcon: MoonCloudMidSnowIcon },
  61: { label: "Light rain",                  dayIcon: SunCloudAngledRainIcon,   nightIcon: MoonCloudAngledRainIcon },
  63: { label: "Moderate rain",               dayIcon: CloudMidRainIcon,         nightIcon: CloudMidRainIcon },
  65: { label: "Heavy rain",                  dayIcon: CloudBigRainIcon,         nightIcon: CloudBigRainIcon },
  66: { label: "Light freezing rain",         dayIcon: CloudHailstoneIcon,       nightIcon: CloudHailstoneIcon },
  67: { label: "Heavy freezing rain",         dayIcon: CloudHailstoneIcon,       nightIcon: MoonCloudHailstoneIcon },
  71: { label: "Light snow",                  dayIcon: SunCloudLittleSnowIcon,   nightIcon: MoonCloudLittleSnowIcon },
  73: { label: "Moderate snow",               dayIcon: SunCloudMidSnowIcon,      nightIcon: MoonCloudMidSnowIcon },
  75: { label: "Heavy snow",                  dayIcon: SunCloudSnowIcon,         nightIcon: MoonCloudSnowIcon },
  77: { label: "Snow grains",                 dayIcon: CloudLittleSnowIcon,      nightIcon: CloudLittleSnowIcon },
  80: { label: "Light showers",               dayIcon: SunCloudBigRainIcon,      nightIcon: MoonCloudBigRainIcon },
  81: { label: "Moderate showers",            dayIcon: CloudAngledRainIcon,      nightIcon: CloudAngledRainIcon },
  82: { label: "Violent showers",             dayIcon: CloudAngledRainZapIcon,   nightIcon: CloudAngledRainZapIcon },
  85: { label: "Light snow showers",          dayIcon: SunCloudLittleSnowIcon,   nightIcon: MoonCloudLittleSnowIcon },
  86: { label: "Heavy snow showers",          dayIcon: CloudMidSnowIcon,         nightIcon: CloudMidSnowIcon },
  95: { label: "Thunderstorm",                dayIcon: SunCloudAngledRainZapIcon,nightIcon: MoonAngledRainZapIcon },
  96: { label: "Thunderstorm with hail",      dayIcon: SunCloudAngledZapIcon,    nightIcon: MoonCloudAngledZapIcon },
  99: { label: "Thunderstorm with heavy hail", dayIcon: CloudAngledZapIcon,       nightIcon: CloudAngledZapIcon },
}

const FALLBACK = WMO_MAP[3]

export function getWMOInfo(code: WMOCode, isDay: 0 | 1): { label: string; icon: IconSvgElement } {
  const entry = WMO_MAP[code] ?? FALLBACK
  return {
    label: entry.label,
    icon: isDay ? entry.dayIcon : entry.nightIcon,
  }
}

export function getUVLevel(uvi: number): string {
  if (uvi <= 2) return "Low"
  if (uvi <= 5) return "Moderate"
  if (uvi <= 7) return "High"
  if (uvi <= 10) return "Very high"
  return "Extreme"
}

export function windDirection(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
  return dirs[Math.round(deg / 45) % 8]
}
