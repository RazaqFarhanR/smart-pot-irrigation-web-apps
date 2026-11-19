export interface IrrigationEvent {
  id: number
  timestamp: string
  trigger_soil_pct: number      // Kandungan Air saat pemicu (%)
  predicted_soil_pct: number    // Nilai proyeksi ŷ(t+1) (%)
  decision_type: "predictive_proactive" | "reactive_delayed"
  virtual_duration_sec: number  // Durasi semprot virtual (detik)
  virtual_volume_ml: number     // Estimasi volume air virtual (mL)
  stress_prevented: boolean     // Mencegah tanaman cabai berada < 35%
  status: "Completed" | "Logged"
}

export interface PolicyComparisonMetric {
  metricName: string
  reactivePolicy: string
  predictivePolicy: string
  improvement: string
  isBetter: boolean
}

// Data historis simulasi kejadian irigasi retrospektif
export const mockIrrigationEvents: IrrigationEvent[] = [
  {
    id: 1,
    timestamp: "2026-11-19 12:40:00",
    trigger_soil_pct: 35.8,
    predicted_soil_pct: 34.2,
    decision_type: "predictive_proactive",
    virtual_duration_sec: 15,
    virtual_volume_ml: 150,
    stress_prevented: true,
    status: "Completed",
  },
  {
    id: 2,
    timestamp: "2026-11-19 08:20:00",
    trigger_soil_pct: 36.1,
    predicted_soil_pct: 34.6,
    decision_type: "predictive_proactive",
    virtual_duration_sec: 15,
    virtual_volume_ml: 150,
    stress_prevented: true,
    status: "Completed",
  },
  {
    id: 3,
    timestamp: "2026-11-19 03:10:00",
    trigger_soil_pct: 33.9,
    predicted_soil_pct: 33.9,
    decision_type: "reactive_delayed",
    virtual_duration_sec: 25,
    virtual_volume_ml: 250,
    stress_prevented: false,
    status: "Completed",
  },
  {
    id: 4,
    timestamp: "2026-11-18 20:50:00",
    trigger_soil_pct: 35.5,
    predicted_soil_pct: 34.1,
    decision_type: "predictive_proactive",
    virtual_duration_sec: 15,
    virtual_volume_ml: 150,
    stress_prevented: true,
    status: "Completed",
  },
  {
    id: 5,
    timestamp: "2026-11-18 15:30:00",
    trigger_soil_pct: 33.4,
    predicted_soil_pct: 33.4,
    decision_type: "reactive_delayed",
    virtual_duration_sec: 25,
    virtual_volume_ml: 250,
    stress_prevented: false,
    status: "Completed",
  },
]

// Matriks evaluasi komparasi kebijakan
export const policyComparisonMetrics: PolicyComparisonMetric[] = [
  {
    metricName: "Konsumsi Air Virtual Total",
    reactivePolicy: "3,300 mL (22 siklus × 150-250 mL)",
    predictivePolicy: "2,100 mL (14 siklus × 150 mL)",
    improvement: "Hemat 26.4%",
    isBetter: true,
  },
  {
    metricName: "Durasi Paparan Stres Kekeringan (<35%)",
    reactivePolicy: "4.8 Jam (Tanah drop hingga 31.5%)",
    predictivePolicy: "0.0 Jam (Ambang dijaga sebelum tembus)",
    improvement: "Eliminasi 100%",
    isBetter: true,
  },
  {
    metricName: "Frekuensi Pemicu Berlebih (Oscillation)",
    reactivePolicy: "Tinggi (Overshoot & pembacaan lambat)",
    predictivePolicy: "Rendah (Penyiraman terencana t+1)",
    improvement: "Turun 36.3%",
    isBetter: true,
  },
  {
    metricName: "Beban Komputasi Keputusan",
    reactivePolicy: "O(1) Komparator Sederhana",
    predictivePolicy: "O(p) Linear Ridge Dot Product",
    improvement: "< 5 µs pada ESP32-S3",
    isBetter: true,
  },
]
