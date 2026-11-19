import { useState } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/layouts/app-sidebar"
import { TopNavbar } from "@/layouts/top-navbar"
import { NAVIGATION_ROUTES, type NavTabId } from "@/config/navigation"
import type { TelemetryRecord } from "@/types"

// Sample dataset mock berbasis format telemetry ESP32-S3
const initialTelemetry: TelemetryRecord[] = [
  {
    id: 1,
    device_id: "esp32s3-pot-01",
    record_seq: 142,
    timestamp: "2026-11-15T21:00:00Z",
    timestamp_quality: "rtc_synced",
    temp_c: 28.4,
    humidity_pct: 65.2,
    light_lux: 1250,
    soil_raw: 2150,
    soil_pct: 48.6,
    pump_status: 0,
    pump_duration_sec: 0,
    wifi_rssi: -58,
    free_heap_bytes: 188928,
    error_code: 0,
    received_at: "2026-11-15T21:00:01Z",
  },
  {
    id: 2,
    device_id: "esp32s3-pot-01",
    record_seq: 141,
    timestamp: "2026-11-15T20:50:00Z",
    timestamp_quality: "rtc_synced",
    temp_c: 28.6,
    humidity_pct: 64.8,
    light_lux: 1420,
    soil_raw: 2162,
    soil_pct: 48.2,
    pump_status: 0,
    pump_duration_sec: 0,
    wifi_rssi: -59,
    free_heap_bytes: 188928,
    error_code: 0,
    received_at: "2026-11-15T20:50:01Z",
  },
  {
    id: 3,
    device_id: "esp32s3-pot-01",
    record_seq: 140,
    timestamp: "2026-11-15T20:40:00Z",
    timestamp_quality: "rtc_synced",
    temp_c: 29.1,
    humidity_pct: 63.5,
    light_lux: 1680,
    soil_raw: 2180,
    soil_pct: 47.5,
    pump_status: 0,
    pump_duration_sec: 0,
    wifi_rssi: -57,
    free_heap_bytes: 188928,
    error_code: 0,
    received_at: "2026-11-15T20:40:01Z",
  },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTabId>("overview")
  const [data] = useState<TelemetryRecord[]>(initialTelemetry)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const latest = data[0]

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 600)
  }

  // Get active route configuration (Open-Closed Principle)
  const currentRoute = NAVIGATION_ROUTES.find((r) => r.id === activeTab)
  const ActivePage = currentRoute?.component

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider defaultOpen={true}>
        {/* Modern Collapsible Sidebar */}
        <AppSidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Main Application Inset */}
        <SidebarInset className="min-h-screen bg-background flex flex-col">
          {/* Sticky Top Navbar */}
          <TopNavbar
            activeTab={activeTab}
            isRefreshing={isRefreshing}
            onRefresh={handleRefresh}
          />

          {/* Dynamic Content Body */}
          <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
            {ActivePage && (
              <ActivePage
                data={data}
                latest={latest}
                onNavigateToTelemetry={() => setActiveTab("telemetri")}
                onNavigateToTestbed={() => setActiveTab("testbed")}
              />
            )}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
