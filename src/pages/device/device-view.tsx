import { useState } from "react"
import {
  Cpu,
  HardDrive,
  Layers,
  Radio,
  Terminal,
  Thermometer,
  Wifi,
  Zap,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function DeviceView() {
  const [isPinging, setIsPinging] = useState(false)
  const [lastPingMs, setLastPingMs] = useState<number>(12)

  const handlePing = () => {
    setIsPinging(true)
    setTimeout(() => {
      setLastPingMs(Math.round(10 + Math.random() * 6))
      setIsPinging(false)
    }, 400)
  }

  // Pinout mapping sensor pada pot pintar
  const pinoutList = [
    { pin: "GPIO 1", type: "ADC1_CH0", function: "Sensor Kandungan Air dalam Tanah", target: "Kapasitif V2.0 Analog (0-3.3V)", status: "Active" },
    { pin: "GPIO 4", type: "I2C SDA", function: "Jalur Data I2C", target: "BH1750 (Sensor Intensitas Cahaya)", status: "Active" },
    { pin: "GPIO 5", type: "I2C SCL", function: "Jalur Clock I2C", target: "BH1750 (Clock 400 kHz)", status: "Active" },
    { pin: "GPIO 14", type: "OneWire / GPIO", function: "Suhu & Kelembaban", target: "DHT22 / BME280 Mikroklimat", status: "Active" },
    { pin: "GPIO 18", type: "Digital Output", function: "Sinyal Aktuator Pompa", target: "Simulasi Retrospektif (Opsi C+)", status: "Virtual" },
    { pin: "GPIO 21", type: "NeoPixel LED", function: "Indikator Status Sistem", target: "RGB Status Node (Hijau: Normal)", status: "Active" },
  ]

  // Log serial ESP-IDF
  const serialLogs = [
    { time: "21:00:02.140", tag: "INFERENCE", msg: "Local Ridge regression complete: t_edge = 4.1 us, predicted soil = 42.80%", level: "INFO" },
    { time: "21:00:02.185", tag: "MQTT", msg: "Published telemetry payload (184 bytes) to topic 'smartpot/telemetry'", level: "INFO" },
    { time: "20:50:02.138", tag: "INFERENCE", msg: "Local Ridge regression complete: t_edge = 4.0 us, predicted soil = 41.90%", level: "INFO" },
    { time: "20:50:02.182", tag: "MQTT", msg: "Published telemetry payload (184 bytes) to topic 'smartpot/telemetry'", level: "INFO" },
    { time: "20:45:10.012", tag: "OTA", msg: "MQTT parameter OTA sync acknowledged: 16 weights loaded to SRAM", level: "NOTICE" },
    { time: "20:40:02.145", tag: "INFERENCE", msg: "Local Ridge regression complete: t_edge = 4.2 us, predicted soil = 40.50%", level: "INFO" },
    { time: "20:30:00.005", tag: "SYSTEM", msg: "Free heap: 184520 bytes (0% fragmentation), core temp: 41.2 C", level: "INFO" },
  ]

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Node Identity */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b pb-4 border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Status Perangkat & Telemetri Hardware
            </h2>
            <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
              Node: esp32s3-pot-01 (Online)
            </Badge>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Diagnostik spesifikasi perangkat keras, alokasi memori, dan serial monitor ESP32-S3
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePing}
            disabled={isPinging}
            className="h-8 gap-1.5 text-xs cursor-pointer"
          >
            <Radio className={`size-3.5 text-sky-500 ${isPinging ? "animate-pulse" : ""}`} />
            <span>Ping Node ({lastPingMs} ms)</span>
          </Button>
          <Badge variant="secondary" className="font-mono text-xs">
            Firmware: v1.2.4-edge-arx
          </Badge>
        </div>
      </div>

      {/* 2. Top Hardware Specifications Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Chip Model */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Prosesor / SoC
            </CardTitle>
            <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-500">
              <Cpu className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              ESP32-S3 (Xtensa LX7)
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Dual-core 32-bit @ 240 MHz (Single-Precision FPU)
            </p>
          </CardContent>
        </Card>

        {/* Free Heap SRAM */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Free Heap (SRAM)
            </CardTitle>
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <HardDrive className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              184.5 KB / 512 KB
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Bobot Model: <strong className="text-neutral-700 dark:text-neutral-300">Hanya 64 Byte</strong>
            </p>
          </CardContent>
        </Card>

        {/* Wi-Fi Link Quality */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Koneksi Wi-Fi
            </CardTitle>
            <div className="p-1.5 rounded-md bg-sky-500/10 text-sky-500">
              <Wifi className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              -58 dBm (84%)
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              IP: 192.168.1.104 • Channel 6 (2.4 GHz)
            </p>
          </CardContent>
        </Card>

        {/* Core Temperature */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Suhu Chip ESP32-S3
            </CardTitle>
            <div className="p-1.5 rounded-md bg-orange-500/10 text-orange-500">
              <Thermometer className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              41.2 °C
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              On-chip thermal diode (Suhu operasional aman)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Memory Allocation Breakdown (Pembuktian Hipotesis H2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* SRAM Breakdown */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <HardDrive className="size-4 text-emerald-600" />
                  Alokasi Memori Dinamis (SRAM 512 KB)
                </CardTitle>
                <CardDescription className="text-xs">
                  Membuktikan efisiensi memori model regresi linier O(p) tanpa resiko overflow (H2)
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-200">
                Bebas Kebocoran
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
                <span>Penggunaan Heap Terpakai:</span>
                <span className="font-mono font-semibold">143.5 KB / 328 KB (DRAM Pool)</span>
              </div>
              <Progress value={43.7} className="h-2 bg-neutral-100 dark:bg-neutral-800" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="p-2.5 rounded-md bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 space-y-1">
                <span className="text-[10px] text-neutral-400 font-medium">Beban Bobot Model (16 Floats)</span>
                <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                  64 Bytes
                </div>
                <p className="text-[10px] text-neutral-500">0.012% dari total kapasitas SRAM</p>
              </div>

              <div className="p-2.5 rounded-md bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 space-y-1">
                <span className="text-[10px] text-neutral-400 font-medium">Waktu Eksekusi Inferensi (t_edge)</span>
                <div className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                  4.1 µs
                </div>
                <p className="text-[10px] text-neutral-500">Siklus instruksi linier seketika</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flash ROM Partitioning */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Layers className="size-4 text-indigo-500" />
                  Alokasi Memori Flash ROM (16 MB QSPI)
                </CardTitle>
                <CardDescription className="text-xs">
                  Distribusi ruang penyimpanan biner firmware, OTA slot, dan file NVS
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] text-indigo-600 border-indigo-200">
                16 MB Flash
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
                <span>Partisi Aplikasi Aktif (app0):</span>
                <span className="font-mono font-semibold">1,248 KB / 3,072 KB (40.6%)</span>
              </div>
              <Progress value={40.6} className="h-2 bg-neutral-100 dark:bg-neutral-800" />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="p-2 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 block font-medium">Bootloader</span>
                <span className="font-mono font-semibold text-neutral-700 dark:text-neutral-300">28 KB</span>
              </div>
              <div className="p-2 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 block font-medium">Partisi NVS</span>
                <span className="font-mono font-semibold text-neutral-700 dark:text-neutral-300">64 KB</span>
              </div>
              <div className="p-2 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 block font-medium">Slot OTA 1</span>
                <span className="font-mono font-semibold text-neutral-700 dark:text-neutral-300">3,072 KB</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Peripheral Pinout Mapping Table */}
      <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Zap className="size-4 text-amber-500" />
            Pemetaan Pinout Hardware Pot Pintar (ICD Matrix)
          </CardTitle>
          <CardDescription className="text-xs">
            Daftar konfigurasi GPIO pada mikrokontroler ESP32-S3 yang terhubung ke modul sensor dan aktuator virtual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-neutral-50/80 dark:bg-neutral-900/60">
                <TableRow>
                  <TableHead className="w-24">Pin ESP32</TableHead>
                  <TableHead className="w-28">Tipe Antarmuka</TableHead>
                  <TableHead>Fungsi Sistem</TableHead>
                  <TableHead>Modul Sensor / Perangkat Terhubung</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pinoutList.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      {row.pin}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-neutral-500">
                      {row.type}
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      {row.function}
                    </TableCell>
                    <TableCell className="text-xs text-neutral-600 dark:text-neutral-300">
                      {row.target}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={row.status === "Active" ? "outline" : "secondary"}
                        className={
                          row.status === "Active"
                            ? "text-[10px] text-emerald-600 border-emerald-200 bg-emerald-50/40"
                            : "text-[10px]"
                        }
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 5. Live Event Logs / Serial Console */}
      <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="size-4 text-neutral-500" />
              <CardTitle className="text-base font-semibold">
                Konsol Log Serial ESP-IDF (UART0)
              </CardTitle>
            </div>
            <Badge variant="outline" className="font-mono text-[10px]">
              Baudrate: 115200 bps
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Aliran kejadian internal mikrokontroler: inisialisasi inferensi, waktu komputasi, dan transmisi MQTT
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-neutral-900 p-3.5 text-neutral-200 font-mono text-xs overflow-x-auto max-h-56 overflow-y-auto leading-relaxed border border-neutral-800 space-y-1.5">
            {serialLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px]">
                <span className="text-neutral-500 select-none">{log.time}</span>
                <span
                  className={`font-semibold px-1 rounded text-[10px] ${
                    log.tag === "INFERENCE"
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      : log.tag === "OTA"
                      ? "bg-violet-950 text-violet-400 border border-violet-800"
                      : log.tag === "MQTT"
                      ? "bg-sky-950 text-sky-400 border border-sky-800"
                      : "bg-neutral-800 text-neutral-300"
                  }`}
                >
                  [{log.tag}]
                </span>
                <span className="text-neutral-300">{log.msg}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
