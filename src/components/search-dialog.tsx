import { useGeocoding } from "@/hooks/use-geocoding"
import { useWeather } from "@/hooks/use-weather"
import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { MapPin, SearchIcon } from "@hugeicons/core-free-icons"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { Kbd, KbdGroup } from "./ui/kbd"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "./ui/item"

export const SearchDialog = () => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const { results, loading } = useGeocoding(search)
  const { setLocation } = useWeather()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            aria-label="Search places"
            className="max-lg:size-8 lg:h-8 lg:w-64 lg:justify-start lg:gap-2 lg:border-border lg:bg-secondary lg:px-3 lg:font-normal lg:text-muted-foreground lg:hover:text-foreground"
          />
        }
      >
        <HugeiconsIcon icon={SearchIcon} />
        <div className="flex flex-1 items-center justify-between max-lg:hidden">
          Search
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </div>
      </DialogTrigger>
      <DialogContent className="gap-0 bg-card p-0" showCloseButton={false}>
        <DialogHeader className="sr-only">
          <DialogTitle>Search places</DialogTitle>
          <DialogDescription>
            Find a forecast by city or country
          </DialogDescription>
        </DialogHeader>
        <InputGroup className="rounded-b-none border-x-0! border-t-0! border-b border-border! bg-transparent! ring-0!">
          <InputGroupInput
            placeholder="City or country"
            value={search}
            onInput={(e) => setSearch(e.currentTarget.value)}
          />
          <InputGroupAddon>
            <HugeiconsIcon icon={SearchIcon} />
          </InputGroupAddon>
        </InputGroup>
        <ItemGroup className="min-h-80 p-2">
          {!loading && !results.length && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              {search ? "No places found" : "Type a city or country"}
            </p>
          )}
          {results.map((result) => (
            <Item
              key={result.name + result.latitude + result.longitude}
              size="sm"
              className="relative p-2"
            >
              <ItemContent>
                <ItemTitle>{result.name}</ItemTitle>
                <ItemDescription>
                  {result.state ? result.state + ", " : ""}
                  {result.country}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <DialogClose
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="after:absolute after:inset-0"
                      onClick={() => {
                        setLocation(result)
                        setSearch("")
                        setOpen(false)
                      }}
                    />
                  }
                >
                  <HugeiconsIcon icon={MapPin} />
                </DialogClose>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </DialogContent>
    </Dialog>
  )
}
