import { WEATHER_API } from "@/config"
import { useWeather } from "@/hooks/use-weather"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import type { WeatherUnit } from "./weather-provider"

export const UnitDropdown = () => {
  const { unit, setUnit } = useWeather()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="secondary" size="icon" aria-label="Toggle unit" />
        }
      >
        {unit === WEATHER_API.DEFAULTS.TEMPERATURE_UNIT ? "°C" : "°F"}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-50">
        <DropdownMenuLabel className="text-muted-foreground">
          Weather Settings
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={unit}
          onValueChange={(value) => setUnit(value as WeatherUnit)}
        >
          <DropdownMenuRadioItem value={WEATHER_API.DEFAULTS.TEMPERATURE_UNIT}>
            °C - Celsius
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value={WEATHER_API.DEFAULTS.TEMPERATURE_UNIT_F}
          >
            °F - Fahrenheit
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
