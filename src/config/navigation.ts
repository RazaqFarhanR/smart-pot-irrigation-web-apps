import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  LineChart,
  Radio,
  Cpu,
  FlaskConical,
  Layers,
  CheckCircle2,
  Droplets,
  History,
  HardDrive,
  FileSpreadsheet,
} from "lucide-react"
import type { ComponentType } from "react"

import { OverviewPage } from "@/pages/overview"
import { SensorPage } from "@/pages/sensors"
import { TelemetryPage } from "@/pages/telemetry"
import { DeployOtaPage } from "@/pages/deploy-ota"
import { TestbedPage } from "@/pages/testbed"
import { AccuracyPage } from "@/pages/accuracy"
import { IrrigationPage } from "@/pages/irrigation"
import { HistoryPage } from "@/pages/history"
import { DevicePage } from "@/pages/device"
import { ExportPage } from "@/pages/export"

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

export type NavCategory = "Monitoring" | "Model & Pengujian" | "Sistem"

export interface NavRouteBadge {
  text: string
  className?: string
}

export interface NavRouteItem {
  id: NavTabId
  label: string
  category: NavCategory
  icon: LucideIcon
  iconColor: string
  badge?: NavRouteBadge
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>
}

export const NAVIGATION_ROUTES: NavRouteItem[] = [
  // Grup 1: MONITORING
  {
    id: "overview",
    label: "Overview",
    category: "Monitoring",
    icon: LayoutDashboard,
    iconColor: "text-emerald-600 dark:text-emerald-400",
    component: OverviewPage,
  },
  {
    id: "sensor",
    label: "Sensor",
    category: "Monitoring",
    icon: LineChart,
    iconColor: "text-sky-500",
    component: SensorPage,
  },
  {
    id: "telemetri",
    label: "Telemetri",
    category: "Monitoring",
    icon: Radio,
    iconColor: "text-amber-500",
    component: TelemetryPage,
  },

  // Grup 2: MODEL & PENGUJIAN
  {
    id: "deploy-ota",
    label: "Deploy OTA",
    category: "Model & Pengujian",
    icon: Cpu,
    iconColor: "text-violet-500",
    badge: {
      text: "OTA",
      className: "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 text-[10px]",
    },
    component: DeployOtaPage,
  },
  {
    id: "testbed",
    label: "Testbed",
    category: "Model & Pengujian",
    icon: FlaskConical,
    iconColor: "text-indigo-500",
    badge: {
      text: "N=300",
      className: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 text-[10px]",
    },
    component: TestbedPage,
  },
  {
    id: "benchmark",
    label: "Benchmark",
    category: "Model & Pengujian",
    icon: Layers,
    iconColor: "text-blue-500",
    component: TestbedPage,
  },
  {
    id: "akurasi",
    label: "Akurasi",
    category: "Model & Pengujian",
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
    component: AccuracyPage,
  },
  {
    id: "irigasi",
    label: "Irigasi",
    category: "Model & Pengujian",
    icon: Droplets,
    iconColor: "text-teal-500",
    component: IrrigationPage,
  },

  // Grup 3: SISTEM
  {
    id: "riwayat-sesi",
    label: "Riwayat Sesi",
    category: "Sistem",
    icon: History,
    iconColor: "text-neutral-500",
    component: HistoryPage,
  },
  {
    id: "perangkat",
    label: "Perangkat",
    category: "Sistem",
    icon: HardDrive,
    iconColor: "text-sky-500",
    badge: {
      text: "Online",
      className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]",
    },
    component: DevicePage,
  },
  {
    id: "ekspor-data",
    label: "Ekspor Data",
    category: "Sistem",
    icon: FileSpreadsheet,
    iconColor: "text-emerald-600",
    component: ExportPage,
  },
]

export const CATEGORIES: NavCategory[] = [
  "Monitoring",
  "Model & Pengujian",
  "Sistem",
]
