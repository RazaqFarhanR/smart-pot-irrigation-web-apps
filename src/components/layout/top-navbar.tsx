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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-neutral-200 bg-white/80 px-4 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 cursor-pointer" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#" className="text-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-700">
                {current.category}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                {current.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-2.5">
        <Badge
          variant="outline"
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs bg-emerald-50/80 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Device Online
        </Badge>

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-8 gap-1.5 text-xs cursor-pointer"
        >
          <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Segarkan</span>
        </Button>
      </div>
    </header>
  )
}
