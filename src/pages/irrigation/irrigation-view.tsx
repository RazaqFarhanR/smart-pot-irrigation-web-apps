import {
  CheckCircle2,
  Clock,
  Droplets,
  Gauge,
  Info,
  Layers,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  mockIrrigationEvents,
  policyComparisonMetrics,
} from "./mock-irrigation-data"

export function IrrigationView() {
  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b pb-4 border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Simulasi Kebijakan Irigasi Retrospektif
            </h2>
            <Badge variant="outline" className="text-xs bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300">
              Opsi C+ (Simulasi Matematis)
            </Badge>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Evaluasi keputusan aktuasi prediktif berbasis ambang batas kandungan air tanah tanpa risiko perangkat keras relay fisik
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono text-xs">
            Ambang Kritis: 35.0%
          </Badge>
          <Badge variant="secondary" className="font-mono text-xs">
            Zona Target: 35% - 70%
          </Badge>
        </div>
      </div>

      {/* 2. Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Penghematan Air Virtual */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Penghematan Air Virtual
            </CardTitle>
            <div className="p-1.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Droplets className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-teal-600 dark:text-teal-400">
              26.4%
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Efisiensi air teoritis vs kontrol reaktif
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Eliminasi Stres Kekeringan */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Pencegahan Stres Kekeringan
            </CardTitle>
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              100%
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Durasi &lt;35% berkurang dari 4.8 jam menjadi 0 jam
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Siklus Penyiraman Proaktif */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Siklus Aktuasi Virtual
            </CardTitle>
            <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-500">
              <Gauge className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
              14 Siklus
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Turun dari 22 siklus kontrol reaktif konvensional
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Ambang Batas Terkalibrasi */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Ambang Pemicu Irigasi
            </CardTitle>
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-500">
              <Zap className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              35.0%
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Batas minimum kandungan air tanah cabai
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Matriks Komparasi Kebijakan (Tabel Evaluasi Skripsi) */}
      <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Layers className="size-4 text-teal-600 dark:text-teal-400" />
            Komparasi Efektivitas Kebijakan Irigasi (Reaktif vs Prediktif)
          </CardTitle>
          <CardDescription className="text-xs">
            Perbandingan komparatif antara kontrol ambang batas reaktif konvensional vs kebijakan prediktif on-device
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-neutral-50/80 dark:bg-neutral-900/60">
                <TableRow>
                  <TableHead className="w-1/4">Parameter Evaluasi</TableHead>
                  <TableHead className="w-1/3">Kebijakan Reaktif Konvensional</TableHead>
                  <TableHead className="w-1/3">Kebijakan Prediktif On-Device (Opsi C+)</TableHead>
                  <TableHead className="text-right">Dampak / Peningkatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policyComparisonMetrics.map((row, idx) => (
                  <TableRow key={idx} className={idx % 2 === 0 ? "bg-neutral-50/30 dark:bg-neutral-950/20" : ""}>
                    <TableCell className="font-medium text-xs text-neutral-900 dark:text-neutral-100">
                      {row.metricName}
                    </TableCell>
                    <TableCell className="text-xs text-neutral-600 dark:text-neutral-400">
                      {row.reactivePolicy}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {row.predictivePolicy}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="text-[10px] text-teal-700 border-teal-200 bg-teal-50/50 dark:bg-teal-950/40 dark:text-teal-300">
                        {row.improvement}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 4. Tabel Log Simulasi Kejadian Irigasi Virtual */}
      <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Clock className="size-4 text-indigo-500" />
            Log Riwayat Kejadian Keputusan Irigasi Virtual
          </CardTitle>
          <CardDescription className="text-xs">
            Catatan keputusan irigasi yang dipicu berdasarkan proyeksi kandungan air pada langkah berikutnya ($t+1$)
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-neutral-50/80 dark:bg-neutral-900/60">
                <TableRow>
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead>Stempel Waktu</TableHead>
                  <TableHead>Kandungan Air Saat Pemicu</TableHead>
                  <TableHead>Proyeksi ŷ(t+1)</TableHead>
                  <TableHead>Tipe Keputusan</TableHead>
                  <TableHead>Durasi Virtual</TableHead>
                  <TableHead>Volume Air Virtual</TableHead>
                  <TableHead className="text-right">Status Stres</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockIrrigationEvents.map((event) => {
                  const isPredictive = event.decision_type === "predictive_proactive"
                  return (
                    <TableRow key={event.id}>
                      <TableCell className="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                        #{event.id}
                      </TableCell>
                      <TableCell className="text-xs text-neutral-500 font-mono">
                        {event.timestamp}
                      </TableCell>
                      <TableCell className="text-xs font-semibold">
                        {event.trigger_soil_pct}%
                      </TableCell>
                      <TableCell className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {event.predicted_soil_pct}%
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            isPredictive
                              ? "text-[10px] text-emerald-700 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-300"
                              : "text-[10px] text-amber-700 border-amber-300 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-300"
                          }
                        >
                          {isPredictive ? "Proaktif (Prediktif)" : "Reaktif (Terlambat)"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-neutral-600 dark:text-neutral-400">
                        {event.virtual_duration_sec} detik
                      </TableCell>
                      <TableCell className="font-mono text-xs font-semibold text-teal-600 dark:text-teal-400">
                        {event.virtual_volume_ml} mL
                      </TableCell>
                      <TableCell className="text-right">
                        {event.stress_prevented ? (
                          <Badge className="text-[10px] bg-emerald-600 text-white gap-1 py-0">
                            <CheckCircle2 className="size-3" />
                            Stres Terhindari
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-[10px] gap-1 py-0">
                            <ShieldAlert className="size-3" />
                            Drop &lt;35%
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 5. Thesis Guardrail Compliance Banner */}
      <Card className="border-teal-200/80 bg-teal-50/30 dark:border-teal-900/60 dark:bg-teal-950/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300 shrink-0">
              <Info className="size-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                Kepatuhan Batasan Masalah Tugas Akhir (Non-Negotiable Guardrails)
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Sesuai batasan formal penelitian yang disetujui dosen pembimbing, sistem pot pintar <strong>TIDAK merakit atau menguji perangkat keras pompa, saklar relay, atau katup solenoid fisik bertegangan tinggi</strong>.
                Evaluasi kebijakan irigasi dieksekusi <strong>murni melalui simulasi retrospektif berbasis data historis</strong> untuk menganalisis akurasi keputusan proaktif, estimasi penghematan air teoritis, dan pencegahan tanaman berada di bawah ambang batas kritis $35.0\%$.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
