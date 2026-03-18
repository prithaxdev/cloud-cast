export const WEATHER_API = {
  DEFAULTS: {
    LAT: 40.2338211,
    LON: -84.4096729,
    TEMPERATURE_UNIT: "celsius" as const,
    TEMPERATURE_UNIT_F: "fahrenheit" as const,
    WIND_SPEED_UNIT: "ms" as const,
    TIMEZONE: "auto" as const,
    SEARCH_RESULT_LIMIT: 5,
  },
} as const

export const MAPBOX = {
  DEFAULTS: {
    CENTER: [WEATHER_API.DEFAULTS.LON, WEATHER_API.DEFAULTS.LAT] as [number, number],
    ZOOM: 12.5,
  },
} as const

export const APP = {
  STORE_KEY: {
    LAT: "cloudcast-lat",
    LON: "cloudcast-lon",
    UNIT: "cloudcast-unit",
    LOCATION: "cloudcast-location",
  },
  UNIT: {
    TEMP: {
      celsius: "°C",
      fahrenheit: "°F",
    },
    WIND: {
      ms: "m/s",
      mph: "mph",
      kmh: "km/h",
    },
  },
} as const
