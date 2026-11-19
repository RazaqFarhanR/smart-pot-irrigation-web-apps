import { useState, useMemo } from "react"
import {
  History,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpDown,
  Download,
  Info,
  Award,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

import {
  EXPERIMENT_SESSIONS,
  type ExperimentSession,
} from "./mock-session-history"

export function HistoryView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [modelFilter, setModelFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Selected session for detail dialog
  const [selectedSession, setSelectedSession] = useState<ExperimentSession | null>(null)

  // Compare sessions dialog
  const [compareModalOpen, setCompareModalOpen] = useState(false)
  const [sessionAId, setSessionAId] = useState<string>("EXP-2026-0312-01")
  const [sessionBId, setSessionBId] = useState<string>("EXP-2026-0308-03")

  // Filtered sessions
  const filteredSessions = useMemo(() => {
    return EXPERIMENT_SESSIONS.filter((s) => {
      const matchSearch =
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.notes.toLowerCase().includes(searchQuery.toLowerCase())

      const matchModel = modelFilter === "all" || s.modelFamily === modelFilter
      const matchStatus = statusFilter === "all" || s.statusLabel === statusFilter

      return matchSearch && matchModel && matchStatus
    })
  }, [searchQuery, modelFilter, statusFilter])

  // Session A & B for comparison
  const sessionA = useMemo(
    () => EXPERIMENT_SESSIONS.find((s) => s.id === sessionAId) || EXPERIMENT_SESSIONS[0],
    [sessionAId]
  )
  const sessionB = useMemo(
    () => EXPERIMENT_SESSIONS.find((s) => s.id === sessionBId) || EXPERIMENT_SESSIONS[3],
    [sessionBId]
  )

  // Download session summary CSV
  const handleDownloadSessionsCsv = () => {
    const headers = [
      "ID Sesi",
      "Judul Eksperimen",
      "Arsitektur Model",
      "Jumlah Sampel N",
      "R2",
      "RMSE (%)",
      "MAE (%)",
      "Max Error (%)",
      "Latensi Edge (us)",
      "Memori Model (Bytes)",
      "Paritas Delta y",
      "Status Hipotesis",
      "Waktu Sesi",
      "Commit SHA",
    ]

    const rows = EXPERIMENT_SESSIONS.map((s) => [
      s.id,
      `"${s.title.replace(/"/g, '""')}"`,
      `"${s.modelName.replace(/"/g, '""')}"`,
      s.sampleCount,
      s.metrics.r2.toFixed(4),
      s.metrics.rmse.toFixed(2),
      s.metrics.mae.toFixed(2),
      s.metrics.maxError.toFixed(2),
      s.metrics.edgeLatencyUs.toFixed(1),
      s.metrics.memoryBytes,
      s.metrics.parityDelta.toFixed(6),
      s.statusLabel,
      s.date,
      s.commitSha,
    ])

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `riwayat_sesi_eksperimen_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Riwayat Sesi Eksperimen
            </h2>
            <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
              Arsip Riset S1
            </Badge>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Log komparatif pengujian model regresi Kandungan Air dalam Tanah pada mikrokontroler ESP32-S3
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCompareModalOpen(true)}
            className="cursor-pointer gap-1.5"
          >
            <ArrowUpDown className="size-3.5 text-indigo-600" />
            <span>Bandingkan 2 Sesi</span>
          </Button>

          <Button
            size="sm"
            onClick={handleDownloadSessionsCsv}
            className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
          >
            <Download className="size-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* 2. Top Summary Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Sesi */}
        <Card className="border-neutral-200 dark:border-neutral-800 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Total Sesi Eksperimen
            </CardTitle>
            <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <History className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              {EXPERIMENT_SESSIONS.length} Sesi
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Tercatat dalam logbook riset Tugas Akhir
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Model Terbaik */}
        <Card className="border-neutral-200 dark:border-neutral-800 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Model Rekomendasi (Bab 4)
            </CardTitle>
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Award className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              Ridge (α=10.0)
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              R² = 0.9894 • RMSE = 1.66% • MAE = 0.43%
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Rata-rata Latensi Edge */}
        <Card className="border-neutral-200 dark:border-neutral-800 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Rata-rata Latensi ESP32-S3
            </CardTitle>
            <div className="p-1.5 rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Clock className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-mono">
              4.1 µs
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              15.000× lebih cepat dari Cloud (62.5 ms)
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Status Hipotesis H1-H3 */}
        <Card className="border-neutral-200 dark:border-neutral-800 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Status Hipotesis (H1-H3)
            </CardTitle>
            <div className="p-1.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <CheckCircle2 className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              H1 • H2 • H3
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Semua target kuantitatif terpenuhi 100%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Filters and Search Bar */}
      <Card className="border-neutral-200 dark:border-neutral-800 shadow-xs">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
              <Input
                placeholder="Cari ID sesi (EXP-...), nama model, atau catatan riset..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="w-[160px]">
                <Select value={modelFilter} onValueChange={setModelFilter}>
                  <SelectTrigger className="w-full bg-neutral-50 dark:bg-neutral-900">
                    <SelectValue placeholder="Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Arsitektur</SelectItem>
                    <SelectItem value="Ridge">Ridge Regression</SelectItem>
                    <SelectItem value="Huber">Huber Regressor</SelectItem>
                    <SelectItem value="OLS">Ordinary Least Squares</SelectItem>
                    <SelectItem value="Baseline">Baseline</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[150px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full bg-neutral-50 dark:bg-neutral-900">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="Optimal">Optimal</SelectItem>
                    <SelectItem value="Valid">Valid</SelectItem>
                    <SelectItem value="Failed">Failed (Baseline)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(searchQuery || modelFilter !== "all" || statusFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("")
                    setModelFilter("all")
                    setStatusFilter("all")
                  }}
                  className="text-xs text-neutral-500 hover:text-neutral-900 cursor-pointer"
                >
                  Reset Filter
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Table of Experiment Sessions */}
      <Card className="border-neutral-200 dark:border-neutral-800 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                Daftar Sesi Eksekusi Trace Replay & Benchmark
              </CardTitle>
              <CardDescription className="text-xs">
                Menampilkan {filteredSessions.length} dari {EXPERIMENT_SESSIONS.length} sesi eksperimen
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-neutral-200 dark:border-neutral-800 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50/75 dark:bg-neutral-900/50 hover:bg-transparent">
                  <TableHead className="font-semibold text-xs">ID Sesi & Tanggal</TableHead>
                  <TableHead className="font-semibold text-xs">Arsitektur Model</TableHead>
                  <TableHead className="font-semibold text-xs text-center">Sampel N</TableHead>
                  <TableHead className="font-semibold text-xs text-right">R²</TableHead>
                  <TableHead className="font-semibold text-xs text-right">RMSE (%)</TableHead>
                  <TableHead className="font-semibold text-xs text-right">MAE (%)</TableHead>
                  <TableHead className="font-semibold text-xs text-center">Latensi Edge</TableHead>
                  <TableHead className="font-semibold text-xs text-center">Verifikasi H1-H3</TableHead>
                  <TableHead className="font-semibold text-xs text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-32 text-center text-sm text-neutral-500">
                      Tidak ada sesi eksperimen yang sesuai dengan kriteria pencarian.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSessions.map((session) => (
                    <TableRow key={session.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30">
                      {/* ID Sesi & Tanggal */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                            {session.id}
                          </span>
                          <span className="text-[11px] text-neutral-500">
                            {session.date}
                          </span>
                        </div>
                      </TableCell>

                      {/* Model & Hyperparameter */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-neutral-900 dark:text-neutral-200">
                            {session.modelName}
                          </span>
                          <span className="text-[11px] text-neutral-400 font-mono">
                            SHA: {session.commitSha}
                          </span>
                        </div>
                      </TableCell>

                      {/* Sampel N */}
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono text-[11px]">
                          {session.sampleCount}
                        </Badge>
                      </TableCell>

                      {/* R² */}
                      <TableCell className="text-right font-mono text-xs font-semibold">
                        <span className={session.metrics.r2 > 0.98 ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-700"}>
                          {session.metrics.r2.toFixed(4)}
                        </span>
                      </TableCell>

                      {/* RMSE */}
                      <TableCell className="text-right font-mono text-xs">
                        {session.metrics.rmse.toFixed(2)}%
                      </TableCell>

                      {/* MAE */}
                      <TableCell className="text-right font-mono text-xs text-neutral-500">
                        {session.metrics.mae.toFixed(2)}%
                      </TableCell>

                      {/* Latensi Edge */}
                      <TableCell className="text-center font-mono text-xs">
                        <span className="text-sky-600 dark:text-sky-400 font-medium">
                          {session.metrics.edgeLatencyUs.toFixed(1)} µs
                        </span>
                      </TableCell>

                      {/* Verifikasi H1-H3 */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          {session.hypothesisStatus.h1Parity &&
                          session.hypothesisStatus.h2Efficiency &&
                          session.hypothesisStatus.h3Accuracy ? (
                            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
                              Lolos H1-H3
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-[10px]">
                              Gagal H3
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      {/* Tombol Aksi */}
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedSession(session)}
                          className="h-7 px-2.5 text-xs text-neutral-700 hover:text-emerald-600 dark:text-neutral-300 dark:hover:text-emerald-400 cursor-pointer"
                        >
                          <Info className="size-3.5 mr-1" />
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 5. Dialog: Detail Sesi Eksperimen */}
      <Dialog open={!!selectedSession} onOpenChange={(open) => !open && setSelectedSession(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedSession && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {selectedSession.id}
                  </Badge>
                  <Badge
                    className={
                      selectedSession.statusLabel === "Optimal"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : selectedSession.statusLabel === "Valid"
                        ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        : "bg-red-500/10 text-red-600 border-red-500/20"
                    }
                  >
                    {selectedSession.statusLabel}
                  </Badge>
                </div>
                <DialogTitle className="text-xl font-bold mt-1">
                  {selectedSession.title}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Dieksekusi pada {selectedSession.date} • Git Commit SHA: {selectedSession.commitSha}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {/* Info Partisi & Peneliti */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs">
                  <div>
                    <span className="text-neutral-400 block">Peneliti / NIM:</span>
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                      Razaq Farhan (103012300322)
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block">Dataset Sumber:</span>
                    <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate block">
                      {selectedSession.datasetPartition}
                    </span>
                  </div>
                </div>

                {/* Grid 4 Kartu Metrik Evaluasi */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-center">
                    <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">Koef. Determinasi (R²)</span>
                    <span className="text-lg font-bold font-mono text-emerald-600">
                      {selectedSession.metrics.r2.toFixed(4)}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-center">
                    <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">RMSE</span>
                    <span className="text-lg font-bold font-mono text-neutral-900 dark:text-neutral-100">
                      {selectedSession.metrics.rmse.toFixed(2)}%
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-center">
                    <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">MAE</span>
                    <span className="text-lg font-bold font-mono text-neutral-900 dark:text-neutral-100">
                      {selectedSession.metrics.mae.toFixed(2)}%
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-center">
                    <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">Latensi Edge</span>
                    <span className="text-lg font-bold font-mono text-sky-600">
                      {selectedSession.metrics.edgeLatencyUs.toFixed(1)} µs
                    </span>
                  </div>
                </div>

                {/* Spesifikasi Komputasi Edge & Paritas */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Spesifikasi Eksekusi ESP32-S3
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div className="p-2 rounded bg-neutral-100 dark:bg-neutral-900 text-center">
                      <span className="text-neutral-400 text-[10px] block">Paritas Δy</span>
                      <span className="font-semibold text-emerald-600">
                        {selectedSession.metrics.parityDelta.toFixed(6)}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-neutral-100 dark:bg-neutral-900 text-center">
                      <span className="text-neutral-400 text-[10px] block">Model Weights</span>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        {selectedSession.metrics.memoryBytes} Byte
                      </span>
                    </div>
                    <div className="p-2 rounded bg-neutral-100 dark:bg-neutral-900 text-center">
                      <span className="text-neutral-400 text-[10px] block">Kompleksitas</span>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        O(p) = 16 FLOP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verifikasi 3 Pilar Hipotesis Riset */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Verifikasi 3 Pilar Hipotesis (H1, H2, H3)
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between p-2 rounded border border-neutral-200 dark:border-neutral-800">
                      <span><strong>H1: Paritas Numerik</strong> (Edge float32 vs Cloud float64 &lt; 1e-4)</span>
                      {selectedSession.hypothesisStatus.h1Parity ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="size-3.5" /> Lolos Terbukti
                        </span>
                      ) : (
                        <span className="text-red-500 font-semibold flex items-center gap-1">
                          <XCircle className="size-3.5" /> Gagal
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-2 rounded border border-neutral-200 dark:border-neutral-800">
                      <span><strong>H2: Efisiensi Komputasi Edge</strong> (Latensi &lt; 100 µs &amp; Bobot &lt; 1 KB)</span>
                      {selectedSession.hypothesisStatus.h2Efficiency ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="size-3.5" /> Lolos Terbukti
                        </span>
                      ) : (
                        <span className="text-red-500 font-semibold flex items-center gap-1">
                          <XCircle className="size-3.5" /> Gagal
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-2 rounded border border-neutral-200 dark:border-neutral-800">
                      <span><strong>H3: Akurasi Prediksi</strong> (R² &gt; 0.95 &amp; RMSE &lt; 3.0%)</span>
                      {selectedSession.hypothesisStatus.h3Accuracy ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="size-3.5" /> Lolos Terbukti
                        </span>
                      ) : (
                        <span className="text-red-500 font-semibold flex items-center gap-1">
                          <XCircle className="size-3.5" /> Gagal
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Catatan Riset Akademik */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Catatan Riset Peneliti
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 leading-relaxed">
                    {selectedSession.notes}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSession(null)}
                  className="cursor-pointer"
                >
                  Tutup
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 6. Dialog: Head-to-Head Compare Sesi */}
      <Dialog open={compareModalOpen} onOpenChange={setCompareModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <ArrowUpDown className="size-5 text-indigo-600" />
              Bandingkan 2 Sesi Eksperimen (Head-to-Head)
            </DialogTitle>
            <DialogDescription className="text-xs">
              Komparasi metrik dan efisiensi untuk dokumentasi analisis Bab 4 Skripsi
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Session Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-500 block mb-1">
                  Sesi Referensi (A):
                </label>
                <Select value={sessionAId} onValueChange={setSessionAId}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIMENT_SESSIONS.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.id} — {s.modelName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-500 block mb-1">
                  Sesi Pembanding (B):
                </label>
                <Select value={sessionBId} onValueChange={setSessionBId}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIMENT_SESSIONS.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.id} — {s.modelName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Comparison Cards Side-by-Side */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              {/* Card Sesi A */}
              <div className="p-4 rounded-lg border-2 border-emerald-500/30 bg-emerald-50/10 dark:bg-emerald-950/10 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-xs text-emerald-600">
                    Sesi A: {sessionA.id}
                  </Badge>
                  <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">
                    {sessionA.statusLabel}
                  </Badge>
                </div>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  {sessionA.modelName}
                </h4>

                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-400">R²:</span>
                    <span className="font-bold text-emerald-600">{sessionA.metrics.r2.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-400">RMSE:</span>
                    <span>{sessionA.metrics.rmse.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-400">MAE:</span>
                    <span>{sessionA.metrics.mae.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-400">Latensi:</span>
                    <span className="text-sky-600">{sessionA.metrics.edgeLatencyUs.toFixed(1)} µs</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-400">Paritas Δy:</span>
                    <span>{sessionA.metrics.parityDelta.toFixed(6)}</span>
                  </div>
                </div>
              </div>

              {/* Card Sesi B */}
              <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-xs">
                    Sesi B: {sessionB.id}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {sessionB.statusLabel}
                  </Badge>
                </div>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  {sessionB.modelName}
                </h4>

                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-400">R²:</span>
                    <span className="font-bold">{sessionB.metrics.r2.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-400">RMSE:</span>
                    <span>{sessionB.metrics.rmse.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-400">MAE:</span>
                    <span>{sessionB.metrics.mae.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-400">Latensi:</span>
                    <span className="text-sky-600">{sessionB.metrics.edgeLatencyUs.toFixed(1)} µs</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-400">Paritas Δy:</span>
                    <span>{sessionB.metrics.parityDelta.toFixed(6)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delta Analysis Callout */}
            <div className="p-3.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                <Info className="size-3.5 text-indigo-500" />
                Analisis Selisih Komparatif (Delta A terhadap B):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-center">
                  <span className="text-neutral-400 text-[10px] block">Δ R²</span>
                  <span className={sessionA.metrics.r2 >= sessionB.metrics.r2 ? "font-bold text-emerald-600" : "font-bold text-red-500"}>
                    {(sessionA.metrics.r2 - sessionB.metrics.r2) >= 0 ? "+" : ""}
                    {(sessionA.metrics.r2 - sessionB.metrics.r2).toFixed(4)}
                  </span>
                </div>
                <div className="p-2 rounded bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-center">
                  <span className="text-neutral-400 text-[10px] block">Δ RMSE</span>
                  <span className={sessionA.metrics.rmse <= sessionB.metrics.rmse ? "font-bold text-emerald-600" : "font-bold text-red-500"}>
                    {(sessionA.metrics.rmse - sessionB.metrics.rmse) >= 0 ? "+" : ""}
                    {(sessionA.metrics.rmse - sessionB.metrics.rmse).toFixed(2)}%
                  </span>
                </div>
                <div className="p-2 rounded bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-center">
                  <span className="text-neutral-400 text-[10px] block">Δ MAE</span>
                  <span className={sessionA.metrics.mae <= sessionB.metrics.mae ? "font-bold text-emerald-600" : "font-bold text-red-500"}>
                    {(sessionA.metrics.mae - sessionB.metrics.mae) >= 0 ? "+" : ""}
                    {(sessionA.metrics.mae - sessionB.metrics.mae).toFixed(2)}%
                  </span>
                </div>
                <div className="p-2 rounded bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-center">
                  <span className="text-neutral-400 text-[10px] block">Δ Latensi</span>
                  <span className="font-bold text-neutral-700 dark:text-neutral-300">
                    {(sessionA.metrics.edgeLatencyUs - sessionB.metrics.edgeLatencyUs) >= 0 ? "+" : ""}
                    {(sessionA.metrics.edgeLatencyUs - sessionB.metrics.edgeLatencyUs).toFixed(1)} µs
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCompareModalOpen(false)}
              className="cursor-pointer"
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
