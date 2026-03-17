import { useTheme, type Theme } from "@/components/theme-provider"
import { HugeiconsIcon } from "@hugeicons/react"
import { Computer, Moon01Icon, Sun01Icon } from "@hugeicons/core-free-icons"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

const options: { value: Theme; label: string; icon: typeof Sun01Icon }[] = [
  { value: "light", label: "Light", icon: Sun01Icon },
  { value: "dark", label: "Dark", icon: Moon01Icon },
  { value: "system", label: "System", icon: Computer },
]

const themeIcon = {
  light: Sun01Icon,
  dark: Moon01Icon,
  system: Computer,
} satisfies Record<Theme, typeof Sun01Icon>

export const ThemeDropdown = () => {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Toggle theme" />
        }
      >
        <HugeiconsIcon icon={themeIcon[theme]} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map(({ value, label, icon }) => (
          <DropdownMenuItem
            key={value}
            className={
              theme === value ? "bg-accent text-accent-foreground" : ""
            }
            onClick={() => setTheme(value)}
          >
            <HugeiconsIcon icon={icon} />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
