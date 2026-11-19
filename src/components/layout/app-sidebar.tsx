import type * as React from "react"
import {
  CheckCircle2,
  Cpu,
  Droplets,
  FileSpreadsheet,
  FlaskConical,
  HardDrive,
  History,
  Layers,
  LayoutDashboard,
  LineChart,
  Radio,
  Sprout,
  Wifi,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

export type NavTabId =
  | "overview"
  | "sensor"
  | "telemetri"
  | "deploy-ota"
  | "testbed"
  | "benchmark"
  | "akurasi"
  | "irigasi"
  | "riwayat-sesi"
  | "perangkat"
  | "ekspor-data"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeTab: NavTabId
  onSelectTab: (tab: NavTabId) => void
}

export function AppSidebar({
  activeTab,
  onSelectTab,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-neutral-200 dark:border-neutral-800">
      {/* 1. Header / Branding */}
      <SidebarHeader className="border-b border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-sidebar-accent cursor-pointer">
              <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-emerald-700 dark:bg-emerald-600 text-white shadow-xs">
                <Sprout className="size-5" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                  Smart Pot Irrigation
                </span>
                <span className="truncate text-[10px] text-muted-foreground font-mono">
                  AgriEdge IoT • ESP32-S3
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* 2. Main Navigation Content */}
      <SidebarContent>
        {/* Grup 1: MONITORING */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Monitoring
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "overview"}
                  tooltip="Overview"
                  onClick={() => onSelectTab("overview")}
                  className="cursor-pointer"
                >
                  <LayoutDashboard className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "sensor"}
                  tooltip="Sensor"
                  onClick={() => onSelectTab("sensor")}
                  className="cursor-pointer"
                >
                  <LineChart className="size-4 text-sky-500" />
                  <span>Sensor</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "telemetri"}
                  tooltip="Telemetri"
                  onClick={() => onSelectTab("telemetri")}
                  className="cursor-pointer"
                >
                  <Radio className="size-4 text-amber-500" />
                  <span>Telemetri</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Grup 2: MODEL & PENGUJIAN */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Model & Pengujian
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "deploy-ota"}
                  tooltip="Deploy OTA"
                  onClick={() => onSelectTab("deploy-ota")}
                  className="cursor-pointer"
                >
                  <Cpu className="size-4 text-violet-500" />
                  <span>Deploy OTA</span>
                  <SidebarMenuBadge className="bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 text-[10px]">
                    OTA
                  </SidebarMenuBadge>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "testbed"}
                  tooltip="Testbed"
                  onClick={() => onSelectTab("testbed")}
                  className="cursor-pointer"
                >
                  <FlaskConical className="size-4 text-indigo-500" />
                  <span>Testbed</span>
                  <SidebarMenuBadge className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 text-[10px]">
                    N=300
                  </SidebarMenuBadge>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "benchmark"}
                  tooltip="Benchmark"
                  onClick={() => onSelectTab("benchmark")}
                  className="cursor-pointer"
                >
                  <Layers className="size-4 text-blue-500" />
                  <span>Benchmark</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "akurasi"}
                  tooltip="Akurasi"
                  onClick={() => onSelectTab("akurasi")}
                  className="cursor-pointer"
                >
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  <span>Akurasi</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "irigasi"}
                  tooltip="Irigasi"
                  onClick={() => onSelectTab("irigasi")}
                  className="cursor-pointer"
                >
                  <Droplets className="size-4 text-teal-500" />
                  <span>Irigasi</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Grup 3: SISTEM */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Sistem
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "riwayat-sesi"}
                  tooltip="Riwayat Sesi"
                  onClick={() => onSelectTab("riwayat-sesi")}
                  className="cursor-pointer"
                >
                  <History className="size-4 text-neutral-500" />
                  <span>Riwayat Sesi</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "perangkat"}
                  tooltip="Perangkat"
                  onClick={() => onSelectTab("perangkat")}
                  className="cursor-pointer"
                >
                  <HardDrive className="size-4 text-sky-500" />
                  <span>Perangkat</span>
                  <SidebarMenuBadge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]">
                    Online
                  </SidebarMenuBadge>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "ekspor-data"}
                  tooltip="Ekspor Data"
                  onClick={() => onSelectTab("ekspor-data")}
                  className="cursor-pointer"
                >
                  <FileSpreadsheet className="size-4 text-emerald-600" />
                  <span>Ekspor Data</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 3. Footer / Status & Profil */}
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="group-data-[collapsible=icon]:hidden space-y-2">
          {/* Quick Connection Status Badge */}
          <div className="rounded-lg border border-border/70 bg-card/60 p-2.5 text-xs">
            <div className="flex items-center justify-between text-neutral-700 dark:text-neutral-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Wifi className="size-3.5 text-emerald-600 dark:text-emerald-400" /> Broker MQTT
              </span>
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground font-mono tabular-nums">
              <span>Port 1883</span>
              <span>RTT 12ms</span>
            </div>
          </div>

          {/* User / Researcher Info */}
          <div className="flex items-center gap-2.5 px-1 py-1">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              RF
            </div>
            <div className="grid flex-1 text-left text-xs leading-none">
              <span className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                Razaq Farhan
              </span>
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate mt-0.5">
                FIF Tel-U • Tugas Akhir
              </span>
            </div>
          </div>
        </div>
      </SidebarFooter>

      {/* Rail toggle for collapsible icon mode */}
      <SidebarRail />
    </Sidebar>
  )
}
