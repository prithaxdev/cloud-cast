import { Logo } from "@/assets/Logo"
import { SearchDialog } from "./search-dialog"

export const TopBar = () => {
  return (
    <div className="h-12 lg:my-4">
      <header className="fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-between gap-5 border-b bg-background/50 px-4 backdrop-blur-lg lg:top-4 lg:right-4 lg:left-4 lg:mx-auto lg:w-auto lg:max-w-384 lg:rounded-2xl lg:border">
        <Logo />
        <SearchDialog />
        <div className="flex gap-2"></div>
      </header>
    </div>
  )
}
