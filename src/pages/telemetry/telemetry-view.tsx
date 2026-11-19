import { useMemo, useState } from "react"
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  Database,
  Download,
  Eye,
  FileCode,
  Filter,
  Pause,
  Play,
  Radio,
  Search,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { generateTelemetryFeed } from "./mock-telemetry"
import type { TelemetryRecord } from "@/types"

export function TelemetryView() {
  const [telemetryList] = useState<TelemetryRecord[]>(() => generateTelemetryFeed())
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedRecord, setSelectedRecord] = useState<TelemetryRecord | null>(null)
  const [isLiveStream, setIsLiveStream] = useState<boolean>(true)
  const [copied, setCopied] = useState<boolean>(false)

  // Filter dan pencarian data
  const filteredRecords = useMemo(() => {
    return telemetryList.filter((record) => {
      // Filter status
      if (statusFilter === "critical" && record.soil_pct >= 35.0) return false
      if (statusFilter === "normal" && record.soil_pct < 35.0) return false
      if (statusFilter === "pump_active" && record.pump_status === 0) return false

      // Filter query pencarian
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase()
        const matchSeq = record.record_seq.toString().includes(query)
        const matchDevice = record.device_id.toLowerCase().includes(query)
        const matchSoil = record.soil_pct.toString().includes(query)
        if (!matchSeq && !matchDevice && !matchSoil) return false
      }

      return true
    })
  }, [telemetryList, searchQuery, statusFilter])

  // Hitung metrik statistik paket
  const metrics = useMemo(() => {
    const total = telemetryList.length
    const criticalCount = telemetryList.filter((r) => r.soil_pct < 35.0).length
    const pumpActiveCount = telemetryList.filter((r) => r.pump_status === 1).length
    return {
      total,
      criticalCount,
      pumpActiveCount,
      avgPayloadBytes: 184,
      qos: "QoS 1",
    }
  }, [telemetryList])

  const handleCopyJSON = () => {
    if (!selectedRecord) return
    navigator.clipboard.writeText(JSON.stringify(selectedRecord, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Unduh log telemetri ke CSV
  const handleExportCSV = () => {
    if (filteredRecords.length === 0) return

    const headers = [
      "record_seq",
      "device_id",
      "timestamp",
      "soil_pct",
      "soil_raw",
      "temp_c",
      "humidity_pct",
      "light_lux",
      "pump_status",
      "pump_duration_sec",
      "wifi_rssi",
      "free_heap_bytes",
      "received_at",
    ]

    const csvContent = [
      headers.join(","),
      ...filteredRecords.map((r) =>
        [
          r.record_seq,
          r.device_id,
          r.timestamp,
          r.soil_pct,
          r.soil_raw,
          r.temp_c,
          r.humidity_pct,
          r.light_lux,
          r.pump_status,
          r.pump_duration_sec,
          r.wifi_rssi,
          r.free_heap_bytes,
          r.received_at,
        ].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `telemetry_mqtt_log_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & MQTT Connection Status */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b pb-4 border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Aliran Log Telemetri MQTT
            </h2>
            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300">
              <span className="size-1.5 rounded-full bg-amber-500 animate-pulse mr-1" />
              Live Ingestion
            </Badge>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Paket telemetri mentah yang diterima dari mikrokontroler melalui topik MQTT: <code className="text-neutral-700 dark:text-neutral-300 font-mono text-xs">smartpot/telemetry</code>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono text-xs">
            Broker: 10.0.0.1:1883
          </Badge>
          <Badge variant="secondary" className="font-mono text-xs">
            QoS: 1
          </Badge>
        </div>
      </div>

      {/* 2. Telemetry Statistics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Total Packets */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Total Paket Masuk
            </CardTitle>
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-500">
              <Database className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              {metrics.total} Paket
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Interval transmisi: 10 menit
            </p>
          </CardContent>
        </Card>

        {/* Stat 2: Ingestion Health */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Kesehatan Ingestion
            </CardTitle>
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              100% Berhasil
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Packet Loss: 0.0% • 0 Error Code
            </p>
          </CardContent>
        </Card>

        {/* Stat 3: Payload Size */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Rata-rata Muatan (Payload)
            </CardTitle>
            <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-500">
              <Radio className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              ~{metrics.avgPayloadBytes} Bytes
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              JSON UTF-8 Payload efisien
            </p>
          </CardContent>
        </Card>

        {/* Stat 4: Critical Alerts */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Status Ambang Kritis
            </CardTitle>
            <div className="p-1.5 rounded-md bg-rose-500/10 text-rose-500">
              <AlertTriangle className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
              {metrics.criticalCount} Kali &lt;35%
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Pompa terpicu: {metrics.pumpActiveCount} siklus
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Search Bar, Filters & Action Controls */}
      <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 size-4 text-neutral-400" />
              <Input
                placeholder="Cari Sequence #, Device, atau Nilai..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            {/* Filter and Control Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Filter className="size-3.5 text-neutral-400" />
                <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val)}>
                  <SelectTrigger className="h-9 w-36 text-xs cursor-pointer">
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Data</SelectItem>
                    <SelectItem value="normal">Optimal (≥35%)</SelectItem>
                    <SelectItem value="critical">Kritis (&lt;35%)</SelectItem>
                    <SelectItem value="pump_active">Pompa Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Live Feed Toggle */}
              <Button
                variant={isLiveStream ? "outline" : "secondary"}
                size="sm"
                onClick={() => setIsLiveStream(!isLiveStream)}
                className="h-9 gap-1.5 text-xs cursor-pointer"
              >
                {isLiveStream ? (
                  <>
                    <Pause className="size-3.5 text-amber-500" />
                    <span>Jeda Stream</span>
                  </>
                ) : (
                  <>
                    <Play className="size-3.5 text-emerald-500" />
                    <span>Lanjutkan Stream</span>
                  </>
                )}
              </Button>

              {/* Export CSV */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="h-9 gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 cursor-pointer"
              >
                <Download className="size-3.5" />
                <span>Unduh Log</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* 4. Telemetry Records Table */}
          <div className="rounded-md border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-neutral-50/80 dark:bg-neutral-900/60">
                <TableRow>
                  <TableHead className="w-16">Seq</TableHead>
                  <TableHead>Waktu Terkirim</TableHead>
                  <TableHead>Kandungan Air Tanah</TableHead>
                  <TableHead>Suhu (°C)</TableHead>
                  <TableHead>Kelembaban (%)</TableHead>
                  <TableHead>Cahaya (Lux)</TableHead>
                  <TableHead>Status Pompa</TableHead>
                  <TableHead>Wi-Fi</TableHead>
                  <TableHead className="text-right">Inspeksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-neutral-400 text-xs">
                      Tidak ada paket telemetri yang cocok dengan kriteria pencarian.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => {
                    const isCritical = record.soil_pct < 35.0
                    return (
                      <TableRow
                        key={record.id}
                        className={isCritical ? "bg-amber-50/40 dark:bg-amber-950/20" : ""}
                      >
                        <TableCell className="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                          #{record.record_seq}
                        </TableCell>
                        <TableCell className="text-xs text-neutral-500 font-mono">
                          {new Date(record.timestamp).toLocaleTimeString("id-ID")}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`font-bold ${
                              isCritical ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            {record.soil_pct}%
                          </span>
                        </TableCell>
                        <TableCell className="text-xs">{record.temp_c}°C</TableCell>
                        <TableCell className="text-xs">{record.humidity_pct}%</TableCell>
                        <TableCell className="text-xs">{record.light_lux.toLocaleString("id-ID")} Lux</TableCell>
                        <TableCell>
                          <Badge
                            variant={record.pump_status === 1 ? "default" : "outline"}
                            className={
                              record.pump_status === 1
                                ? "text-[10px] bg-emerald-600 text-white"
                                : "text-[10px] text-neutral-500"
                            }
                          >
                            {record.pump_status === 1 ? "ON (15s)" : "OFF"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-neutral-500">
                          {record.wifi_rssi} dBm
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRecord(record)}
                            className="h-7 px-2 text-xs text-indigo-600 dark:text-indigo-400 cursor-pointer"
                          >
                            <Eye className="size-3.5 mr-1" />
                            <span>Detail</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 5. Modal Dialog: JSON Payload Inspector */}
      <Dialog open={selectedRecord !== null} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="size-5 text-indigo-500" />
                <DialogTitle className="text-base">
                  Inspektor Paket Telemetri #{selectedRecord?.record_seq}
                </DialogTitle>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                {selectedRecord?.device_id}
              </Badge>
            </div>
            <DialogDescription className="text-xs">
              Muatan data mentah JSON yang dikirimkan melalui protokol MQTT v3.1.1
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-4">
              {/* Delivery Metadata */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 block font-medium">Stempel Waktu</span>
                  <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                    {new Date(selectedRecord.timestamp).toLocaleTimeString("id-ID")}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block font-medium">Kualitas Waktu</span>
                  <span className="font-mono font-semibold text-emerald-600">
                    {selectedRecord.timestamp_quality}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block font-medium">Diterima Broker</span>
                  <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                    {new Date(selectedRecord.received_at).toLocaleTimeString("id-ID")}
                  </span>
                </div>
              </div>

              {/* JSON Code Viewer */}
              <div className="relative rounded-lg bg-neutral-900 p-3.5 text-neutral-100 font-mono text-[11px] overflow-x-auto max-h-64 overflow-y-auto leading-relaxed border border-neutral-800">
                <pre>{JSON.stringify(selectedRecord, null, 2)}</pre>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyJSON}
                  className="gap-1.5 text-xs cursor-pointer"
                >
                  {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                  <span>{copied ? "Tersalin ke Clipboard" : "Salin JSON"}</span>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
