import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  Award,
  CheckCircle2,
  Cpu,
  Layers,
  LineChart as LineChartIcon,
  ShieldCheck,
  Sparkles,
  TrendingUp,
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
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  generateScatterData,
  modelComparisonTable,
  residualDistribution,
} from "./mock-accuracy-data"

const scatterChartConfig = {
  predicted: {
    label: "Nilai Prediksi (%)",
    color: "#10b981",
  },
} satisfies ChartConfig

const residualChartConfig = {
  count: {
    label: "Frekuensi Sampel",
    color: "#6366f1",
  },
} satisfies ChartConfig

export function AccuracyView() {
  const scatterData = useMemo(() => generateScatterData(), [])

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b pb-4 border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Evaluasi Akurasi & Paritas Model
            </h2>
            <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300">
              <CheckCircle2 className="size-3 mr-1 inline" />
              Hipotesis H1 Terbukti (R² ≥ 0.85)
            </Badge>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Pembuktian empiris akurasi model regresi linier kausal berbobot ringan (*Ridge Regression*) pada data uji tak-terlihat (*ThingSpeak 196075*)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono text-xs">
            Model: Ridge (α = 10.0)
          </Badge>
          <Badge variant="secondary" className="font-mono text-xs">
            Zero Look-Ahead Bias
          </Badge>
        </div>
      </div>

      {/* 2. Key Statistical Accuracy Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: R2 Score */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Koefisien Determinasi (R²)
            </CardTitle>
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Award className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              0.9894
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Pagu proposal: <strong className="text-neutral-700 dark:text-neutral-300">≥ 0.8500</strong> (Sangat Superior)
            </p>
          </CardContent>
        </Card>

        {/* Card 2: RMSE */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Root Mean Squared Error
            </CardTitle>
            <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-500">
              <LineChartIcon className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
              1.66%
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Deviasi kuadrat rata-rata terhadap aktual
            </p>
          </CardContent>
        </Card>

        {/* Card 3: MAE */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Mean Absolute Error
            </CardTitle>
            <div className="p-1.5 rounded-md bg-sky-500/10 text-sky-500">
              <TrendingUp className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-sky-600 dark:text-sky-400">
              0.43%
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Rerata selisih absolut pada domain uji
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Parity Delta */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Paritas Float32 vs 64 (Δy)
            </CardTitle>
            <div className="p-1.5 rounded-md bg-teal-500/10 text-teal-500">
              <ShieldCheck className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-teal-600 dark:text-teal-400">
              &lt; 10⁻⁵
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Presisi FPU 32-bit mikrokontroler aman
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Two Primary Diagnostic Charts: Scatter Plot & Residual Histogram */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Scatter Plot Aktual vs Prediksi */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Sparkles className="size-4 text-emerald-600" />
                  Scatter Plot Aktual vs Prediksi (y vs ŷ)
                </CardTitle>
                <CardDescription className="text-xs">
                  Garis putus-putus merah menandakan keselarasan sempurna (y = x, R² = 1.0)
                </CardDescription>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                100 Sampel Uji
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <ChartContainer config={scatterChartConfig} className="h-72 w-full">
              <ScatterChart
                margin={{ top: 10, right: 15, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(150, 150, 150, 0.15)" />
                <XAxis
                  type="number"
                  dataKey="actual"
                  name="Nilai Aktual"
                  unit="%"
                  domain={[30, 70]}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="number"
                  dataKey="predicted"
                  name="Nilai Prediksi"
                  unit="%"
                  domain={[30, 70]}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ payload }) => {
                    if (!payload || payload.length === 0) return null
                    const data = payload[0].payload
                    return (
                      <div className="rounded-lg border border-neutral-200 bg-white p-2.5 shadow-md dark:border-neutral-800 dark:bg-neutral-950 text-xs space-y-1">
                        <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                          Sampel #{data.index}
                        </div>
                        <div className="flex justify-between gap-4 text-neutral-600 dark:text-neutral-400">
                          <span>Aktual:</span>
                          <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{data.actual}%</span>
                        </div>
                        <div className="flex justify-between gap-4 text-neutral-600 dark:text-neutral-400">
                          <span>Prediksi:</span>
                          <span className="font-mono font-bold text-emerald-600">{data.predicted}%</span>
                        </div>
                        <div className="flex justify-between gap-4 text-neutral-600 dark:text-neutral-400 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                          <span>Residu (e):</span>
                          <span className="font-mono text-indigo-600">{data.residual}%</span>
                        </div>
                      </div>
                    )
                  }}
                />
                {/* Diagonal Reference Line (y = x) */}
                <ReferenceLine
                  segment={[
                    { x: 30, y: 30 },
                    { x: 70, y: 70 },
                  ]}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                />
                <Scatter
                  data={scatterData}
                  fill="#10b981"
                  fillOpacity={0.7}
                />
              </ScatterChart>
            </ChartContainer>

            <div className="mt-3 rounded-md bg-neutral-50 dark:bg-neutral-950/60 p-2.5 border border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500">
              Titik data berkumpul sangat rapat pada garis diagonal $45^\circ$, membuktikan daya prediksi linear kausal yang presisi tanpa dispersi galat acak.
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Histogram Sebaran Galat Residual */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Layers className="size-4 text-indigo-600" />
                  Distribusi Galat Residual (e = y - ŷ)
                </CardTitle>
                <CardDescription className="text-xs">
                  Verifikasi asumsi normalitas galat regresi terpusat pada 0.0%
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300">
                Gaussian Shape
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <ChartContainer config={residualChartConfig} className="h-72 w-full">
              <BarChart
                data={residualDistribution}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150, 150, 150, 0.15)" />
                <XAxis
                  dataKey="binRange"
                  tickLine={false}
                  axisLine={false}
                  fontSize={10}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={35}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  tickFormatter={(val) => `${val}`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="count"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  name="Jumlah Titik Sampel"
                />
              </BarChart>
            </ChartContainer>

            <div className="mt-3 rounded-md bg-neutral-50 dark:bg-neutral-950/60 p-2.5 border border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500">
              Sebaran residual simetris terpusat di interval $\pm 0.4\%$, mengonfirmasi bahwa model bebas dari *systemic bias* (tidak cenderung *over-predict* maupun *under-predict*).
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Matriks Komparasi Model (Data Bab 4) */}
      <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Cpu className="size-4 text-emerald-600" />
            Matriks Komparasi Performa Model (Tabel Bab 4 Skripsi)
          </CardTitle>
          <CardDescription className="text-xs">
            Evaluasi keunggulan komparatif model linier berregularisasi Ridge atas model OLS dan Ensemble Trees
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-neutral-50/80 dark:bg-neutral-900/60">
                <TableRow>
                  <TableHead>Nama Model</TableHead>
                  <TableHead>Tipe Algoritma</TableHead>
                  <TableHead className="font-semibold">R² Score</TableHead>
                  <TableHead>RMSE (%)</TableHead>
                  <TableHead>MAE (%)</TableHead>
                  <TableHead>Latensi Inferensi</TableHead>
                  <TableHead>Konsumsi SRAM</TableHead>
                  <TableHead>Kemampuan Ekstrapolasi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modelComparisonTable.map((row, idx) => (
                  <TableRow
                    key={idx}
                    className={row.isPrimary ? "bg-emerald-50/30 dark:bg-emerald-950/20 font-medium" : ""}
                  >
                    <TableCell className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                      {row.modelName}
                      {row.isPrimary && (
                        <Badge className="text-[9px] bg-emerald-600 text-white py-0">
                          Terpilih
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-neutral-500">{row.type}</TableCell>
                    <TableCell className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {row.r2}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{row.rmse}%</TableCell>
                    <TableCell className="font-mono text-xs">{row.mae}%</TableCell>
                    <TableCell className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {row.latency}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{row.sramUsage}</TableCell>
                    <TableCell>
                      <Badge
                        variant={row.isPrimary ? "default" : "outline"}
                        className={
                          row.isPrimary
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 text-[10px]"
                            : row.extrapolation.includes("Penalti")
                            ? "bg-rose-50 text-rose-700 border-rose-200 text-[10px]"
                            : "text-[10px]"
                        }
                      >
                        {row.extrapolation}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Academic Insight Callout */}
          <div className="mt-4 p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950/40 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
              💡 Kesimpulan Evaluasi Komparatif (Novelty Pilar 1):
            </span>
            Meskipun model pohon (*Ensemble Tree / CatBoost*) populer di data tabular, model tersebut mengalami degradasi (*leaf-clamping collapse*) saat terjadi pergeseran rezim cuaca di luar domain latih dan membebani memori SRAM ESP32-S3 hingga &gt; 1 MB. Sebaliknya, **Ridge Regression** mempertahankan proyeksi hiper-bidang kontinu dengan kompleksitas komputasional O(p) instan (4.1 µs), memori 64 Byte, dan akurasi tertinggi (R² = 0.9894).
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
