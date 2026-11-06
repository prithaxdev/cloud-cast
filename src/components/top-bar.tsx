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
      size="icon"
      title="Use my location"
      aria-label="Use my location"
      disabled={geolocating}
      onClick={geolocate}
    >
      <HugeiconsIcon
        icon={geolocating ? Loading03Icon : Gps01Icon}
        className={geolocating ? "animate-spin" : ""}
      />
    </Button>
  )
}

export const TopBar = () => {
  return (
    <header className="sticky top-0 z-1003 border-b border-border bg-background">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Logo size={24} />

        <SearchDialog />

        <div className="ms-auto flex shrink-0 items-center gap-1">
          <GeolocateButton />
          <ThemeDropdown />
          <UnitDropdown />
        </div>
      </div>
    </header>
  )
}
