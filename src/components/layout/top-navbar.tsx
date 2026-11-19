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
import type { NavTabId } from "./app-sidebar"

interface TopNavbarProps {
  activeTab: NavTabId
  isRefreshing: boolean
  onRefresh: () => void
}

const tabTitles: Record<NavTabId, { category: string; title: string }> = {
  overview: { category: "Monitoring", title: "Overview" },
  sensor: { category: "Monitoring", title: "Sensor" },
  telemetri: { category: "Monitoring", title: "Telemetri" },
  "deploy-ota": { category: "Model & Pengujian", title: "Deploy OTA" },
  testbed: { category: "Model & Pengujian", title: "Testbed" },
  benchmark: { category: "Model & Pengujian", title: "Benchmark" },
  akurasi: { category: "Model & Pengujian", title: "Akurasi" },
  irigasi: { category: "Model & Pengujian", title: "Irigasi" },
  "riwayat-sesi": { category: "Sistem", title: "Riwayat Sesi" },
  perangkat: { category: "Sistem", title: "Perangkat" },
  "ekspor-data": { category: "Sistem", title: "Ekspor Data" },
}

export function TopNavbar({ activeTab, isRefreshing, onRefresh }: TopNavbarProps) {
  const current = tabTitles[activeTab] ?? { category: "System", title: "Dashboard" }

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
                {current.category}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xs font-semibold text-foreground tracking-tight">
                {current.title}
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

        {/* Segarkan Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-8 gap-1.5 text-xs cursor-pointer border-border/80 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
        >
          <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin text-emerald-600 dark:text-emerald-400" : ""}`} />
          <span className="hidden sm:inline">Segarkan</span>
        </Button>

        {/* Interactive Dark/Light Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  )
}
