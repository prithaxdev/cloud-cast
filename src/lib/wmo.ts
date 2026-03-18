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
  color: string
}

const WMO_MAP: Record<number, WMOInfo> = {
  0:  { label: "Clear Sky",                   dayIcon: Sun01Icon,                nightIcon: Moon01Icon,              color: "#F59E0B" },
  1:  { label: "Mainly Clear",                dayIcon: Sun01Icon,                nightIcon: Moon01Icon,              color: "#F59E0B" },
  2:  { label: "Partly Cloudy",               dayIcon: SunCloud01Icon,           nightIcon: MoonCloudIcon,           color: "#94A3B8" },
  3:  { label: "Overcast",                    dayIcon: CloudIcon,                nightIcon: CloudIcon,               color: "#64748B" },
  45: { label: "Fog",                         dayIcon: CloudSlowWindIcon,        nightIcon: CloudSlowWindIcon,       color: "#94A3B8" },
  48: { label: "Rime Fog",                    dayIcon: CloudSlowWindIcon,        nightIcon: CloudSlowWindIcon,       color: "#94A3B8" },
  51: { label: "Light Drizzle",               dayIcon: SunCloudLittleRainIcon,   nightIcon: MoonCloudLittleRainIcon, color: "#60A5FA" },
  53: { label: "Moderate Drizzle",            dayIcon: SunCloudMidRainIcon,      nightIcon: MoonCloudMidRainIcon,    color: "#3B82F6" },
  55: { label: "Dense Drizzle",               dayIcon: CloudLittleRainIcon,      nightIcon: CloudLittleRainIcon,     color: "#2563EB" },
  56: { label: "Light Freezing Drizzle",      dayIcon: SunCloudLittleSnowIcon,   nightIcon: MoonCloudLittleSnowIcon, color: "#93C5FD" },
  57: { label: "Heavy Freezing Drizzle",      dayIcon: SunCloudMidSnowIcon,      nightIcon: MoonCloudMidSnowIcon,    color: "#60A5FA" },
  61: { label: "Slight Rain",                 dayIcon: SunCloudAngledRainIcon,   nightIcon: MoonCloudAngledRainIcon, color: "#60A5FA" },
  63: { label: "Moderate Rain",               dayIcon: CloudMidRainIcon,         nightIcon: CloudMidRainIcon,        color: "#3B82F6" },
  65: { label: "Heavy Rain",                  dayIcon: CloudBigRainIcon,         nightIcon: CloudBigRainIcon,        color: "#1D4ED8" },
  66: { label: "Light Freezing Rain",         dayIcon: CloudHailstoneIcon,       nightIcon: CloudHailstoneIcon,      color: "#93C5FD" },
  67: { label: "Heavy Freezing Rain",         dayIcon: CloudHailstoneIcon,       nightIcon: MoonCloudHailstoneIcon,  color: "#60A5FA" },
  71: { label: "Slight Snowfall",             dayIcon: SunCloudLittleSnowIcon,   nightIcon: MoonCloudLittleSnowIcon, color: "#E2E8F0" },
  73: { label: "Moderate Snowfall",           dayIcon: SunCloudMidSnowIcon,      nightIcon: MoonCloudMidSnowIcon,    color: "#CBD5E1" },
  75: { label: "Heavy Snowfall",              dayIcon: SunCloudSnowIcon,         nightIcon: MoonCloudSnowIcon,       color: "#94A3B8" },
  77: { label: "Snow Grains",                 dayIcon: CloudLittleSnowIcon,      nightIcon: CloudLittleSnowIcon,     color: "#E2E8F0" },
  80: { label: "Slight Rain Showers",         dayIcon: SunCloudBigRainIcon,      nightIcon: MoonCloudBigRainIcon,    color: "#60A5FA" },
  81: { label: "Moderate Rain Showers",       dayIcon: CloudAngledRainIcon,      nightIcon: CloudAngledRainIcon,     color: "#3B82F6" },
  82: { label: "Violent Rain Showers",        dayIcon: CloudAngledRainZapIcon,   nightIcon: CloudAngledRainZapIcon,  color: "#1D4ED8" },
  85: { label: "Slight Snow Showers",         dayIcon: SunCloudLittleSnowIcon,   nightIcon: MoonCloudLittleSnowIcon, color: "#E2E8F0" },
  86: { label: "Heavy Snow Showers",          dayIcon: CloudMidSnowIcon,         nightIcon: CloudMidSnowIcon,        color: "#CBD5E1" },
  95: { label: "Thunderstorm",                dayIcon: SunCloudAngledRainZapIcon,nightIcon: MoonAngledRainZapIcon,   color: "#7C3AED" },
  96: { label: "Thunderstorm w/ Hail",        dayIcon: SunCloudAngledZapIcon,    nightIcon: MoonCloudAngledZapIcon,  color: "#6D28D9" },
  99: { label: "Thunderstorm w/ Heavy Hail",  dayIcon: CloudAngledZapIcon,       nightIcon: CloudAngledZapIcon,      color: "#5B21B6" },
}

const FALLBACK = WMO_MAP[3]

export function getWMOInfo(code: WMOCode, isDay: 0 | 1): { label: string; icon: IconSvgElement; color: string } {
  const entry = WMO_MAP[code] ?? FALLBACK
  return {
    label: entry.label,
    icon: isDay ? entry.dayIcon : entry.nightIcon,
    color: entry.color,
  }
}

export type UVLevel = { label: string; color: string }

export function getUVLevel(uvi: number): UVLevel {
  if (uvi <= 2)  return { label: "Low",       color: "#22C55E" }
  if (uvi <= 5)  return { label: "Moderate",  color: "#EAB308" }
  if (uvi <= 7)  return { label: "High",      color: "#F97316" }
  if (uvi <= 10) return { label: "Very High", color: "#EF4444" }
  return             { label: "Extreme",   color: "#A855F7" }
}

export function getUVColor(uvi: number): string {
  return getUVLevel(uvi).color
}

export function windDirection(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
  return dirs[Math.round(deg / 45) % 8]
}
