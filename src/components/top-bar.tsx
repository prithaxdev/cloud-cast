import { useWeather } from "@/hooks/use-weather"
import { HugeiconsIcon } from "@hugeicons/react"
import { Gps01Icon, Loading03Icon } from "@hugeicons/core-free-icons"
import { Logo } from "@/assets/Logo"
import { SearchDialog } from "./search-dialog"
import { ThemeDropdown } from "./theme-dropdown"
import { UnitDropdown } from "./unit-dropdown"
import { Button } from "./ui/button"

function GeolocateButton() {
  const { geolocate, geolocating } = useWeather()
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      title="Use my location"
      disabled={geolocating}
      onClick={geolocate}
    >
      <HugeiconsIcon
        icon={geolocating ? Loading03Icon : Gps01Icon}
        className={geolocating ? "animate-spin text-primary" : ""}
      />
    </Button>
  )
}

export const TopBar = () => {
  return (
    <div className="h-19 lg:h-22">
      <header className="fixed top-3 right-3 left-3 z-1003 flex h-16 items-center justify-between gap-4 rounded-2xl border border-border/50 bg-card/80 px-4 backdrop-blur-xl lg:top-4 lg:right-auto lg:left-1/2 lg:w-full lg:max-w-4xl lg:-translate-x-1/2">
        <Logo />

        <SearchDialog />

        <div className="flex shrink-0 items-center gap-0.5">
          <GeolocateButton />
          <ThemeDropdown />
          <UnitDropdown />
        </div>
      </header>
    </div>
  )
}
