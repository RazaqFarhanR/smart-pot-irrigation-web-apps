import {
  CloudRain,
  Droplets,
  HardDrive,
  Power,
  Sun,
  Thermometer,
  Wifi,
} from "lucide-react"

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
import { MetricCard } from "@/components/shared/metric-card"
import { IRRIGATION_CONSTANTS } from "@/config/constants"
import type { TelemetryRecord } from "@/types"

interface OverviewPageProps {
  data: TelemetryRecord[]
  latest: TelemetryRecord
  onNavigateToTelemetry: () => void
}

export function OverviewPage({ data, latest, onNavigateToTelemetry }: OverviewPageProps) {
  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Overview Sistem &amp; Sensor
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Monitoring telemetri real-time pot tanaman cabai via ESP32-S3
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500 font-mono tabular-nums">
          <span>Update Terakhir:</span>
          <span className="text-neutral-700 dark:text-neutral-300 font-semibold">
            {new Date(latest.timestamp).toLocaleTimeString("id-ID")}
          </span>
        </div>
      </div>

      {/* 2. 4 Sensor Metric Cards (Reusable MetricCard) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Kandungan Air dalam Tanah */}
        <MetricCard
          title={IRRIGATION_CONSTANTS.TARGET_SOIL_TERM}
          value={`${latest.soil_pct}%`}
          subtext={`ADC Raw: ${latest.soil_raw}`}
          icon={Droplets}
          iconColor="text-emerald-600 dark:text-emerald-400"
          badge={{
            label: "Optimal (35-70%)",
            className: "text-emerald-600 border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300",
          }}
        />

        {/* Metric 2: Suhu Lingkungan */}
        <MetricCard
          title="Suhu Lingkungan"
          value={latest.temp_c}
          unit="°C"
          subtext="Sensor suhu DHT22 terkalibrasi"
          icon={Thermometer}
          iconColor="text-orange-500"
        />

        {/* Metric 3: Kelembaban Udara */}
        <MetricCard
          title="Kelembaban Udara"
          value={`${latest.humidity_pct}%`}
          subtext="Sensor kelembaban relatif DHT22"
          icon={CloudRain}
          iconColor="text-sky-500"
        />

        {/* Metric 4: Intensitas Cahaya */}
        <MetricCard
          title="Intensitas Cahaya"
          value={latest.light_lux.toLocaleString("id-ID")}
          unit="Lux"
          subtext="Sensor intensitas cahaya (BH1750)"
          icon={Sun}
          iconColor="text-amber-500"
        />
      </div>

      {/* 3. Hardware Health & Pump Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/80 shadow-xs bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Wifi className="size-3.5 text-sky-500" /> Sinyal Wi-Fi (RSSI)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold text-foreground font-mono tabular-nums">
              {latest.wifi_rssi} dBm
            </div>
            <p className="text-xs text-muted-foreground mt-1">Koneksi stabil ke AP lokal</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <HardDrive className="size-3.5 text-indigo-500" /> Free Heap (SRAM)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold text-foreground font-mono tabular-nums">
              {Math.round(latest.free_heap_bytes / 1024)} KB
            </div>
            <p className="text-xs text-muted-foreground mt-1">Kapasitas heap SRAM normal</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Power className="size-3.5 text-emerald-500" /> Status Pompa (Simulasi Opsi C+)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge
                variant={latest.pump_status === 1 ? "default" : "secondary"}
                className="font-medium"
              >
                {latest.pump_status === 1 ? "Aktif" : "Standby"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-mono tabular-nums">
              Siklus: {latest.pump_duration_sec}s
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 4. Telemetry Stream Preview */}
      <Card className="border-border/80 shadow-xs bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Log Telemetri Terbaru</CardTitle>
            <CardDescription className="text-xs">
              Paket telemetri masuk dari topik MQTT
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onNavigateToTelemetry}
            className="text-xs h-8 cursor-pointer"
          >
            Lihat Semua Telemetri
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/80 overflow-hidden">
            <Table>
              <TableHeader className="bg-neutral-50/80 dark:bg-neutral-900/60">
                <TableRow>
                  <TableHead className="w-16">Seq</TableHead>
                  <TableHead>Waktu Transmisi</TableHead>
                  <TableHead>{IRRIGATION_CONSTANTS.TARGET_SOIL_TERM}</TableHead>
                  <TableHead>Suhu (°C)</TableHead>
                  <TableHead>Kelembaban (%)</TableHead>
                  <TableHead>Cahaya (Lux)</TableHead>
                  <TableHead>Pompa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono tabular-nums text-xs font-medium">#{row.record_seq}</TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono tabular-nums">
                      {new Date(row.timestamp).toLocaleTimeString("id-ID")}
                    </TableCell>
                    <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                      {row.soil_pct}%
                    </TableCell>
                    <TableCell className="text-xs font-mono tabular-nums">{row.temp_c}°C</TableCell>
                    <TableCell className="text-xs font-mono tabular-nums">{row.humidity_pct}%</TableCell>
                    <TableCell className="text-xs font-mono tabular-nums">{row.light_lux} Lux</TableCell>
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
    </div>
  )
}
