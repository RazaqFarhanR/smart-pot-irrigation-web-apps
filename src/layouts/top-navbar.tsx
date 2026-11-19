import { RefreshCw } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { NAVIGATION_ROUTES, type NavTabId } from "@/config/navigation"

interface TopNavbarProps {
  activeTab: NavTabId
  isRefreshing: boolean
  onRefresh: () => void
}

export function TopNavbar({ activeTab, isRefreshing, onRefresh }: TopNavbarProps) {
  const currentRoute = NAVIGATION_ROUTES.find((r) => r.id === activeTab)
  const category = currentRoute?.category ?? "Monitoring"
  const title = currentRoute?.label ?? "Overview"

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border/80 bg-background/80 px-4 backdrop-blur-md">
      {/* Left Section: Sidebar Toggle & Breadcrumb */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                {category}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xs font-semibold text-foreground tracking-tight">
                {title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right Section: Breathing Status, Refresh, Theme Toggle */}
      <div className="flex items-center gap-2.5">
        {/* Breathing LED Status Pill (Minimalist Enterprise) */}
        <div className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="tracking-tight">ESP32-S3 Online</span>
          <span className="text-[10px] text-muted-foreground font-mono tabular-nums">1883</span>
        </div>

        {/* Refresh Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-8 gap-1.5 text-xs cursor-pointer border-border/80 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
        >
          <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin text-emerald-600 dark:text-emerald-400" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>

        {/* Interactive Dark/Light Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  )
}
