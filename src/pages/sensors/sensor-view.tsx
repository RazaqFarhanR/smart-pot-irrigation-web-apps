import { useMemo, useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"
import {
  CloudRain,
  Droplets,
  Info,
  Sun,
  Thermometer,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { generateSensorHistory, type SensorDataPoint } from "./mock-sensor-data"

type TimeRange = "1h" | "6h" | "24h"

const chartConfig = {
  soil_pct: {
    label: "Kandungan Air dalam Tanah (%)",
    color: "#10b981", // emerald-500
  },
  temp_c: {
    label: "Suhu (°C)",
    color: "#f97316", // orange-500
  },
  humidity_pct: {
    label: "Kelembaban Udara (%)",
    color: "#0284c7", // sky-600
  },
  light_lux: {
    label: "Intensitas Cahaya (Lux)",
    color: "#eab308", // yellow-500
  },
} satisfies ChartConfig

export function SensorView() {
  const allData = useMemo(() => generateSensorHistory(), [])
  const [timeRange, setTimeRange] = useState<TimeRange>("24h")

  // Filter data berdasarkan rentang waktu yang dipilih
  const filteredData = useMemo(() => {
    if (timeRange === "1h") {
      return allData.slice(-6) // 6 titik * 10 menit = 1 jam
    }
    if (timeRange === "6h") {
      return allData.slice(-36) // 36 titik * 10 menit = 6 jam
    }
    return allData // 144 titik = 24 jam
  }, [allData, timeRange])

  const latestPoint: SensorDataPoint = filteredData[filteredData.length - 1]

  // Metrik ringkasan
  const summary = useMemo(() => {
    if (filteredData.length === 0) return { minSoil: 0, maxSoil: 0, avgTemp: 0, avgHumidity: 0 }
    let sumSoil = 0
    let sumTemp = 0
    let sumHum = 0
    let minSoil = filteredData[0].soil_pct
    let maxSoil = filteredData[0].soil_pct

    for (const d of filteredData) {
      sumSoil += d.soil_pct
      sumTemp += d.temp_c
      sumHum += d.humidity_pct
      if (d.soil_pct < minSoil) minSoil = d.soil_pct
      if (d.soil_pct > maxSoil) maxSoil = d.soil_pct
    }

    const n = filteredData.length
    return {
      minSoil,
      maxSoil,
      avgSoil: Number((sumSoil / n).toFixed(1)),
      avgTemp: Number((sumTemp / n).toFixed(1)),
      avgHumidity: Number((sumHum / n).toFixed(1)),
    }
  }, [filteredData])

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Filter Rentang Waktu */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b pb-4 border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Tren & Grafik Sensor Interaktif
            </h2>
            <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300">
              Sampling 10 Menit
            </Badge>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Dinamika fisik Kandungan Air dalam Tanah dan mikroklimat pot tanaman cabai
          </p>
        </div>

        {/* Time-Range Selector Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-lg">
          <Button
            variant={timeRange === "1h" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTimeRange("1h")}
            className="h-7 text-xs px-3 cursor-pointer"
          >
            1 Jam
          </Button>
          <Button
            variant={timeRange === "6h" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTimeRange("6h")}
            className="h-7 text-xs px-3 cursor-pointer"
          >
            6 Jam
          </Button>
          <Button
            variant={timeRange === "24h" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTimeRange("24h")}
            className="h-7 text-xs px-3 cursor-pointer"
          >
            24 Jam
          </Button>
        </div>
      </div>

      {/* 2. Quick Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Status Kandungan Air dalam Tanah Terkini */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Kandungan Air dalam Tanah
            </CardTitle>
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Droplets className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                {latestPoint?.soil_pct}%
              </div>
              <Badge
                variant="outline"
                className={
                  latestPoint?.soil_pct < 35.0
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }
              >
                {latestPoint?.soil_pct < 35.0 ? "Kritis (<35%)" : "Optimal (35-70%)"}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Rentang Min/Max: {summary.minSoil}% s.d. {summary.maxSoil}%
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Suhu Rata-rata */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Suhu Lingkungan (Rata-rata)
            </CardTitle>
            <div className="p-1.5 rounded-md bg-orange-500/10 text-orange-500">
              <Thermometer className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              {summary.avgTemp} °C
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Saat ini: <strong className="text-neutral-700 dark:text-neutral-300">{latestPoint?.temp_c} °C</strong>
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Kelembaban Udara */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Kelembaban Relatif (RH)
            </CardTitle>
            <div className="p-1.5 rounded-md bg-sky-500/10 text-sky-500">
              <CloudRain className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              {summary.avgHumidity}%
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Saat ini: <strong className="text-neutral-700 dark:text-neutral-300">{latestPoint?.humidity_pct}%</strong>
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Radiasi Cahaya Terakhir */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Intensitas Cahaya Terakhir
            </CardTitle>
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-500">
              <Sun className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              {latestPoint?.light_lux.toLocaleString("id-ID")} Lux
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Sensor intensitas cahaya digital (BH1750)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Grafik Utama: Kandungan Air dalam Tanah (%) */}
      <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Droplets className="size-4 text-emerald-600 dark:text-emerald-400" />
                Tren Kandungan Air dalam Tanah & Ambang Batas Irigasi
              </CardTitle>
              <CardDescription className="text-xs">
                Kurva evapotranspirasi kontinu terhadap ambang batas kritis 35.0%
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-emerald-500 inline-block" />
                <span className="text-neutral-600 dark:text-neutral-400">Kandungan Air (%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 border-t-2 border-dashed border-red-500 inline-block" />
                <span className="text-red-600 dark:text-red-400 font-medium">Ambang 35%</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <ChartContainer config={chartConfig} className="h-72 w-full">
            <AreaChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="soilGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150, 150, 150, 0.15)" />
              <XAxis
                dataKey="formattedTime"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={11}
              />
              <YAxis
                domain={[25, 75]}
                tickLine={false}
                axisLine={false}
                fontSize={11}
                tickFormatter={(val) => `${val}%`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => `Pukul ${label}`}
                  />
                }
              />
              {/* Shaded Optimal Zone: 35% to 70% */}
              <ReferenceArea
                y1={35}
                y2={70}
                fill="#10b981"
                fillOpacity={0.04}
              />
              {/* Critical Irrigation Threshold Line: 35.0% */}
              <ReferenceLine
                y={35}
                stroke="#ef4444"
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />
              <Area
                type="monotone"
                dataKey="soil_pct"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#soilGradient)"
                name="Kandungan Air dalam Tanah"
              />
            </AreaChart>
          </ChartContainer>

          <div className="mt-3 rounded-md bg-neutral-50 dark:bg-neutral-950/60 p-2.5 border border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Info className="size-3.5 text-emerald-500" />
              Area teduh hijau adalah <strong>Zona Optimal</strong> (35% s.d. 70%). Jika kurva menyentuh garis merah putus-putus, irigasi virtual dipicu.
            </span>
            <span className="font-mono text-[11px] text-neutral-400">
              Total {filteredData.length} data point
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 4. Dua Grafik Komparatif Mikroklimat: Suhu & Kelembaban Udara + Cahaya */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Grafik 2: Suhu vs Kelembaban Udara */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Thermometer className="size-4 text-orange-500" />
                  Suhu Udara &amp; Kelembaban Relatif (RH)
                </CardTitle>
                <CardDescription className="text-xs">
                  Fluktuasi suhu lingkungan (°C) dan kelembaban udara (%)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <LineChart
                data={filteredData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150, 150, 150, 0.15)" />
                <XAxis
                  dataKey="formattedTime"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                />
                <YAxis
                  yAxisId="left"
                  domain={[15, 45]}
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  tickFormatter={(val) => `${val}°C`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[30, 100]}
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  tickFormatter={(val) => `${val}%`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temp_c"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                  name="Suhu (°C)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="humidity_pct"
                  stroke="#0284c7"
                  strokeWidth={2}
                  dot={false}
                  name="Kelembaban (%)"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Grafik 3: Siklus Sirkadian Intensitas Cahaya (Lux) */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Sun className="size-4 text-amber-500" />
                  Siklus Radiasi Foton & Cahaya (Lux)
                </CardTitle>
                <CardDescription className="text-xs">
                  Fluks cahaya foton sensor BH1750 (Puncak tengah hari)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <AreaChart
                data={filteredData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="lightGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150, 150, 150, 0.15)" />
                <XAxis
                  dataKey="formattedTime"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  tickFormatter={(val) => `${Math.round(val / 1000)}k`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="light_lux"
                  stroke="#eab308"
                  strokeWidth={2}
                  fill="url(#lightGradient)"
                  name="Intensitas Cahaya"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
