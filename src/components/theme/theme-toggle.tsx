import { Moon, Sun, Laptop } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "./theme-provider"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-8 cursor-pointer rounded-md border-neutral-200/80 bg-background/50 hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900 transition-colors"
          title="Ubah Mode Tampilan (Terang / Gelap / Sistem)"
        >
          {resolvedTheme === "dark" ? (
            <Moon className="size-4 text-emerald-400 transition-all" />
          ) : (
            <Sun className="size-4 text-amber-500 transition-all" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="text-xs min-w-[130px]">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`gap-2 cursor-pointer ${theme === "light" ? "font-semibold text-emerald-600 dark:text-emerald-400" : ""}`}
        >
          <Sun className="size-3.5 text-amber-500" />
          <span>Terang (Light)</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`gap-2 cursor-pointer ${theme === "dark" ? "font-semibold text-emerald-600 dark:text-emerald-400" : ""}`}
        >
          <Moon className="size-3.5 text-emerald-400" />
          <span>Gelap (Dark)</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`gap-2 cursor-pointer ${theme === "system" ? "font-semibold text-emerald-600 dark:text-emerald-400" : ""}`}
        >
          <Laptop className="size-3.5 text-neutral-400" />
          <span>Sistem (Auto)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
