import { useState } from "react"
import {
  CloudRain,
  Droplets,
  HardDrive,
  Info,
  Power,
  Sun,
  Thermometer,
  Wifi,
} from "lucide-react"

import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar, type NavTabId } from "@/components/layout/app-sidebar"
import { TopNavbar } from "@/components/layout/top-navbar"
import { SensorView } from "@/components/sensors/sensor-view"
import { TestbedView } from "@/components/testbed/testbed-view"
import { DeployOtaView } from "@/components/ota/deploy-ota-view"
import { DeviceView } from "@/components/device/device-view"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { TelemetryRecord } from "./types"

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
    soil_raw: 1820,
    soil_pct: 42.8,
    pump_status: 0,
    pump_duration_sec: 0,
    wifi_rssi: -58,
    free_heap_bytes: 184520,
    error_code: 0,
    received_at: "2026-11-15T21:00:02Z",
  },
  {
    id: 2,
    device_id: "esp32s3-pot-01",
    record_seq: 141,
    timestamp: "2026-11-15T20:50:00Z",
    timestamp_quality: "rtc_synced",
    temp_c: 28.7,
    humidity_pct: 64.8,
    light_lux: 1380,
    soil_raw: 1845,
    soil_pct: 41.9,
    pump_status: 0,
    pump_duration_sec: 0,
    wifi_rssi: -59,
    free_heap_bytes: 184520,
    error_code: 0,
    received_at: "2026-11-15T20:50:02Z",
  },
  {
    id: 3,
    device_id: "esp32s3-pot-01",
    record_seq: 140,
    timestamp: "2026-11-15T20:40:00Z",
    timestamp_quality: "rtc_synced",
    temp_c: 29.1,
    humidity_pct: 63.5,
    light_lux: 1540,
    soil_raw: 1870,
    soil_pct: 40.5,
    pump_status: 0,
    pump_duration_sec: 0,
    wifi_rssi: -60,
    free_heap_bytes: 184712,
    error_code: 0,
    received_at: "2026-11-15T20:40:02Z",
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

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider defaultOpen={true}>
        {/* Modern Collapsible Sidebar */}
        <AppSidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Main Application Inset */}
        <SidebarInset className="min-h-screen bg-neutral-50/60 dark:bg-neutral-950 flex flex-col">
          {/* Sticky Top Navbar */}
          <TopNavbar
            activeTab={activeTab}
            isRefreshing={isRefreshing}
            onRefresh={handleRefresh}
          />

          {/* Dynamic Content Body */}
          <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
            {/* View 1: Overview */}
            {activeTab === "overview" && (
              <>
                {/* Header Banner */}
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                      Overview Sistem & Sensor
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Pemantauan telemetri waktu-nyata pot tanaman cabai via ESP32-S3
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500 font-mono">
                    <span>Transmisi Terakhir:</span>
                    <span className="text-neutral-700 dark:text-neutral-300 font-semibold">
                      {new Date(latest.timestamp).toLocaleTimeString("id-ID")}
                    </span>
                  </div>
                </div>

                {/* 4 Sensor Metric Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Metric 1: Kandungan Air dalam Tanah */}
                  <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                        Kandungan Air dalam Tanah
                      </CardTitle>
                      <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <Droplets className="size-4" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                        {latest.soil_pct}%
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs text-neutral-500">
                        <span>ADC Raw: {latest.soil_raw}</span>
                        <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-200 bg-emerald-50/50">
                          Optimal (35-70%)
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Metric 2: Suhu Lingkungan */}
                  <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                        Suhu Lingkungan
                      </CardTitle>
                      <div className="p-1.5 rounded-md bg-orange-500/10 text-orange-500">
                        <Thermometer className="size-4" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                        {latest.temp_c} °C
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">
                        Sensor termal mikroklimat terkalibrasi
                      </p>
                    </CardContent>
                  </Card>

                  {/* Metric 3: Kelembaban Udara */}
                  <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                        Kelembaban Udara
                      </CardTitle>
                      <div className="p-1.5 rounded-md bg-sky-500/10 text-sky-500">
                        <CloudRain className="size-4" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                        {latest.humidity_pct}%
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">
                        Kelembaban relatif atmosfer mikro
                      </p>
                    </CardContent>
                  </Card>

                  {/* Metric 4: Intensitas Cahaya */}
                  <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                        Intensitas Cahaya
                      </CardTitle>
                      <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-500">
                        <Sun className="size-4" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                        {latest.light_lux.toLocaleString("id-ID")} Lux
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">
                        Fluks radiasi fotosintesis (BH1750)
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Hardware Health & Pump Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Wifi className="size-3.5 text-sky-500" /> Sinyal Wi-Fi (RSSI)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                        {latest.wifi_rssi} dBm
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">Koneksi stabil ke AP lokal</p>
                    </CardContent>
                  </Card>

                  <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                        <HardDrive className="size-3.5 text-indigo-500" /> Memori Bebas (SRAM)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                        {Math.round(latest.free_heap_bytes / 1024)} KB
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">Heap ESP32-S3 terjaga aman</p>
                    </CardContent>
                  </Card>

                  <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Power className="size-3.5 text-emerald-500" /> Status Aktuator Pompa
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={latest.pump_status === 1 ? "default" : "secondary"}
                          className="font-medium"
                        >
                          {latest.pump_status === 1 ? "Aktif Menyiram" : "Standby (Mati)"}
                        </Badge>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">
                        Siklus: {latest.pump_duration_sec}s
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Telemetry Stream Preview */}
                <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-semibold">Log Telemetri Terbaru</CardTitle>
                      <CardDescription className="text-xs">
                        Paket data telemetri yang diterima via MQTT Ingestion Pipeline
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("telemetri")}
                      className="text-xs h-8 cursor-pointer"
                    >
                      Buka Tab Telemetri
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                      <Table>
                        <TableHeader className="bg-neutral-50/80 dark:bg-neutral-900/60">
                          <TableRow>
                            <TableHead className="w-16">Seq</TableHead>
                            <TableHead>Waktu Transmisi</TableHead>
                            <TableHead>Kandungan Air Tanah</TableHead>
                            <TableHead>Suhu (°C)</TableHead>
                            <TableHead>Kelembaban (%)</TableHead>
                            <TableHead>Cahaya (Lux)</TableHead>
                            <TableHead>Pompa</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell className="font-mono text-xs font-medium">#{row.record_seq}</TableCell>
                              <TableCell className="text-xs text-neutral-500">
                                {new Date(row.timestamp).toLocaleTimeString("id-ID")}
                              </TableCell>
                              <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {row.soil_pct}%
                              </TableCell>
                              <TableCell className="text-xs">{row.temp_c}°C</TableCell>
                              <TableCell className="text-xs">{row.humidity_pct}%</TableCell>
                              <TableCell className="text-xs">{row.light_lux} Lux</TableCell>
                              <TableCell>
                                <Badge
                                  variant={row.pump_status === 1 ? "default" : "outline"}
                                  className="text-[10px] py-0"
                                >
                                  {row.pump_status === 1 ? "ON" : "OFF"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* View 2: Deploy OTA Tab */}
            {activeTab === "deploy-ota" && (
              <DeployOtaView onNavigateToTestbed={() => setActiveTab("testbed")} />
            )}

            {/* View 3: Akurasi Tab */}
            {activeTab === "akurasi" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Evaluasi Akurasi & Paritas Model</h2>
                  <p className="text-sm text-neutral-500">
                    Verifikasi presisi numerik antara inferensi lokal mikrokontroler (float 32-bit) dan komputasi awan (float 64-bit).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-neutral-200 shadow-xs dark:border-neutral-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs text-neutral-400 uppercase tracking-wider">
                        Koefisien Determinasi (R²)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-emerald-600">0.9894</div>
                      <p className="text-xs text-neutral-500 mt-1">Ridge Regression (α = 10.0)</p>
                    </CardContent>
                  </Card>

                  <Card className="border-neutral-200 shadow-xs dark:border-neutral-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs text-neutral-400 uppercase tracking-wider">
                        Root Mean Squared Error (RMSE)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-indigo-600">1.66%</div>
                      <p className="text-xs text-neutral-500 mt-1">MAE: 0.4279% pada data uji</p>
                    </CardContent>
                  </Card>

                  <Card className="border-neutral-200 shadow-xs dark:border-neutral-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs text-neutral-400 uppercase tracking-wider">
                        Paritas Komputasi (Δy)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-teal-600">&lt; 10⁻⁵</div>
                      <p className="text-xs text-neutral-500 mt-1">Deviasi pembulatan IEEE-754 teruji aman</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* View 4: Testbed & Benchmark */}
            {(activeTab === "testbed" || activeTab === "benchmark") && (
              <TestbedView />
            )}

            {/* View 5: Sensor View */}
            {activeTab === "sensor" && (
              <SensorView />
            )}

            {/* View 6: Device View */}
            {activeTab === "perangkat" && (
              <DeviceView />
            )}

            {/* Other Tabs Placeholder */}
            {(activeTab === "telemetri" ||
              activeTab === "irigasi" ||
              activeTab === "riwayat-sesi" ||
              activeTab === "ekspor-data") && (
              <Card className="p-8 text-center border-dashed border-2 border-neutral-200 dark:border-neutral-800">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="p-3 bg-neutral-100 rounded-full dark:bg-neutral-900 text-neutral-500">
                    <Info className="size-6" />
                  </div>
                  <h3 className="text-lg font-semibold capitalize">Modul {activeTab} Siap Diimplementasikan</h3>
                  <p className="text-sm text-neutral-500 max-w-md">
                    Tab navigasi sudah aktif dan terhubung. Anda dapat kembali ke{" "}
                    <button
                      onClick={() => setActiveTab("overview")}
                      className="text-emerald-600 font-semibold underline underline-offset-4 cursor-pointer"
                    >
                      Overview
                    </button>{" "}
                    kapan saja.
                  </p>
                </div>
              </Card>
            )}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
