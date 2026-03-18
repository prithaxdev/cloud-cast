import { useWeatherContext } from "@/components/weather-provider"

export function useWeather() {
  return useWeatherContext()
}
