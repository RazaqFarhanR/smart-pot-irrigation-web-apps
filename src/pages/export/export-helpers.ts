import { generateTraceData, type TraceSample } from "@/pages/testbed/mock-trace-data"
import { generateTelemetryFeed } from "@/pages/telemetry/mock-telemetry"
import type { TelemetryRecord } from "@/types"
import { modelComparisonTable, type ModelComparisonRow } from "@/pages/accuracy/mock-accuracy-data"
import { mockIrrigationEvents, type IrrigationEvent } from "@/pages/irrigation/mock-irrigation-data"

export type ExportDatasetType = "testbed" | "telemetry" | "model-comparison" | "irrigation"
export type ExportFormatType = "csv" | "json" | "latex"

export interface ExportColumnDef {
  id: string
  label: string
  defaultSelected: boolean
}

// Cached sample datasets
const testbedData: TraceSample[] = generateTraceData()
const telemetryData: TelemetryRecord[] = generateTelemetryFeed()

export const DATASET_CONFIG: Record<
  ExportDatasetType,
  {
    name: string
    description: string
    recordCount: number
    columns: ExportColumnDef[]
  }
> = {
  testbed: {
    name: "Hasil Uji Replay Trace Testbed (N=300)",
    description: "Data inferensi Edge ESP32-S3 vs Cloud float64 dan paritas numerik",
    recordCount: testbedData.length,
    columns: [
      { id: "sample_idx", label: "Index Sampel (n)", defaultSelected: true },
      { id: "timestamp", label: "Waktu Transmisi", defaultSelected: true },
      { id: "actual_soil_pct", label: "Kandungan Air dalam Tanah Aktual (%)", defaultSelected: true },
      { id: "pred_edge_pct", label: "Prediksi Edge float32 (%)", defaultSelected: true },
      { id: "pred_cloud_pct", label: "Prediksi Cloud float64 (%)", defaultSelected: true },
      { id: "parity_delta", label: "Paritas Numerik (|Edge - Cloud|)", defaultSelected: true },
      { id: "error_pct", label: "Galat Residual (%)", defaultSelected: true },
      { id: "edge_latency_us", label: "Latensi Inferensi Edge (µs)", defaultSelected: true },
    ],
  },
  telemetry: {
    name: "Log Telemetri Sensor Waktu-Nyata (MQTT)",
    description: "Riwayat telemetri multi-sensor dari topik smartpot/telemetry",
    recordCount: telemetryData.length,
    columns: [
      { id: "record_seq", label: "Sequence No", defaultSelected: true },
      { id: "timestamp", label: "Waktu Pencatatan", defaultSelected: true },
      { id: "soil_pct", label: "Kandungan Air dalam Tanah (%)", defaultSelected: true },
      { id: "temp_c", label: "Suhu Udara (°C)", defaultSelected: true },
      { id: "humidity_pct", label: "Kelembaban Udara (%)", defaultSelected: true },
      { id: "light_lux", label: "Intensitas Cahaya (Lux)", defaultSelected: true },
      { id: "wifi_rssi", label: "Wi-Fi RSSI (dBm)", defaultSelected: false },
      { id: "free_heap_bytes", label: "Free Heap SRAM (Byte)", defaultSelected: false },
    ],
  },
  "model-comparison": {
    name: "Matriks Perbandingan Performa Model (Bab 4)",
    description: "Tabel evaluasi empiris Ridge, Huber, OLS, dan Ensemble untuk naskah skripsi",
    recordCount: modelComparisonTable.length,
    columns: [
      { id: "modelName", label: "Arsitektur Model", defaultSelected: true },
      { id: "type", label: "Kategori Paradigma", defaultSelected: true },
      { id: "r2", label: "Koefisien Determinasi (R²)", defaultSelected: true },
      { id: "rmse", label: "RMSE (%)", defaultSelected: true },
      { id: "mae", label: "MAE (%)", defaultSelected: true },
      { id: "latency", label: "Latensi ESP32-S3", defaultSelected: true },
      { id: "sramUsage", label: "Ukuran Bobot SRAM", defaultSelected: true },
      { id: "extrapolation", label: "Sifat Ekstrapolasi", defaultSelected: true },
    ],
  },
  irrigation: {
    name: "Log Evaluasi Simulasi Kebijakan Irigasi",
    description: "Kejadian penyiraman virtual retrospektif dan efisiensi air (Opsi C+)",
    recordCount: mockIrrigationEvents.length,
    columns: [
      { id: "id", label: "ID Kejadian", defaultSelected: true },
      { id: "timestamp", label: "Waktu Simulasi", defaultSelected: true },
      { id: "decision_type", label: "Kebijakan Evaluasi", defaultSelected: true },
      { id: "trigger_soil_pct", label: "Kandungan Air Pemicu (%)", defaultSelected: true },
      { id: "predicted_soil_pct", label: "Proyeksi ŷ(t+1) (%)", defaultSelected: true },
      { id: "virtual_volume_ml", label: "Volume Air Virtual (mL)", defaultSelected: true },
      { id: "status", label: "Status Mitigasi", defaultSelected: true },
    ],
  },
}

export function getExportData(
  dataset: ExportDatasetType,
  sampleLimit: number
): Record<string, string | number | boolean>[] {
  let rawData: Record<string, string | number | boolean>[] = []

  if (dataset === "testbed") {
    rawData = testbedData.map((t: TraceSample) => ({
      sample_idx: t.sample_idx,
      timestamp: t.timestamp,
      actual_soil_pct: t.actual_soil_pct,
      pred_edge_pct: t.pred_edge_pct,
      pred_cloud_pct: t.pred_cloud_pct,
      parity_delta: t.parity_delta,
      error_pct: Number((t.pred_edge_pct - t.actual_soil_pct).toFixed(2)),
      edge_latency_us: t.edge_latency_us,
    }))
  } else if (dataset === "telemetry") {
    rawData = telemetryData.map((t: TelemetryRecord) => ({
      record_seq: t.record_seq,
      timestamp: t.timestamp,
      soil_pct: t.soil_pct,
      temp_c: t.temp_c,
      humidity_pct: t.humidity_pct,
      light_lux: t.light_lux,
      wifi_rssi: t.wifi_rssi,
      free_heap_bytes: t.free_heap_bytes,
    }))
  } else if (dataset === "model-comparison") {
    rawData = modelComparisonTable.map((m: ModelComparisonRow) => ({
      modelName: m.modelName,
      type: m.type,
      r2: m.r2,
      rmse: m.rmse,
      mae: m.mae,
      latency: m.latency,
      sramUsage: m.sramUsage,
      extrapolation: m.extrapolation,
    }))
  } else if (dataset === "irrigation") {
    rawData = mockIrrigationEvents.map((e: IrrigationEvent) => ({
      id: e.id,
      timestamp: e.timestamp,
      decision_type: e.decision_type === "predictive_proactive" ? "Prediktif (ML)" : "Reaktif Ambang Batas",
      trigger_soil_pct: e.trigger_soil_pct,
      predicted_soil_pct: e.predicted_soil_pct,
      virtual_volume_ml: e.virtual_volume_ml,
      status: e.status,
    }))
  }

  const limited = sampleLimit > 0 ? rawData.slice(0, sampleLimit) : rawData
  return limited
}

// Generate CSV string
export function generateCsv(
  data: Record<string, string | number | boolean>[],
  selectedColumnIds: string[],
  columnDefs: ExportColumnDef[]
): string {
  const colMap = new Map(columnDefs.map((c) => [c.id, c.label]))
  const headers = selectedColumnIds.map((id) => `"${colMap.get(id) || id}"`)

  const rows = data.map((row) =>
    selectedColumnIds
      .map((id) => {
        const val = row[id]
        if (typeof val === "string") {
          return `"${val.replace(/"/g, '""')}"`
        }
        return val !== undefined ? String(val) : ""
      })
      .join(",")
  )

  return [headers.join(","), ...rows].join("\n")
}

// Generate JSON string
export function generateJson(
  data: Record<string, string | number | boolean>[],
  selectedColumnIds: string[]
): string {
  const filtered = data.map((row) => {
    const item: Record<string, string | number | boolean> = {}
    selectedColumnIds.forEach((id) => {
      if (row[id] !== undefined) {
        item[id] = row[id]
      }
    })
    return item
  })

  return JSON.stringify(filtered, null, 2)
}

// Generate LaTeX Booktabs Table
export function generateLatexTable(
  data: Record<string, string | number | boolean>[],
  selectedColumnIds: string[],
  columnDefs: ExportColumnDef[],
  datasetName: string
): string {
  const colMap = new Map(columnDefs.map((c) => [c.id, c.label]))
  const colHeaders = selectedColumnIds.map((id) => colMap.get(id) || id)
  const colAlign = selectedColumnIds
    .map((_, i) => (i === 0 ? "l" : "r"))
    .join("")

  const headerRow = colHeaders
    .map((h) => `\\textbf{${h.replace(/%/g, "\\%").replace(/_/g, "\\_")}}`)
    .join(" & ") + " \\\\"

  const bodyRows = data
    .slice(0, 15) // Max 15 baris untuk representasi tabel naskah
    .map((row) =>
      selectedColumnIds
        .map((id) => {
          const val = row[id]
          if (typeof val === "number") {
            return Number.isInteger(val) ? val.toString() : val.toFixed(2)
          }
          if (typeof val === "string") {
            return val.replace(/%/g, "\\%").replace(/_/g, "\\_")
          }
          return String(val)
        })
        .join(" & ") + " \\\\"
    )
    .join("\n")

  return `% Kode Tabel LaTeX untuk Bab 4 Skripsi / Tugas Akhir
% Peneliti: Razaq Farhan (103012300322) - S1 Informatika Telkom University
\\begin{table}[htbp]
\\centering
\\caption{Hasil Pengujian Komparatif ${datasetName}}
\\label{tab:${datasetName.toLowerCase().replace(/[^a-z0-9]/g, "_")}}
\\begin{tabular}{${colAlign}}
\\toprule
${headerRow}
\\midrule
${bodyRows}
\\bottomrule
\\end{tabular}
\\end{table}`
}
