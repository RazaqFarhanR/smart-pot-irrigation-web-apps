export interface TraceSample {
  sample_idx: number
  timestamp: string
  actual_soil_pct: number      // Kandungan Air dalam Tanah Aktual (%)
  pred_edge_pct: number        // Prediksi On-Device ESP32-S3 (Float32)
  pred_cloud_pct: number       // Prediksi Cloud Server (Float64)
  parity_delta: number         // |pred_edge - pred_cloud|
  edge_latency_us: number      // Latensi lokal (mikrodetik, µs)
  cloud_rtt_ms: number         // Latensi Round-Trip Time Cloud (milidetik, ms)
  temp_c: number               // Suhu lingkungan (°C)
  humidity_pct: number         // Kelembaban udara (%)
  light_lux: number            // Intensitas cahaya (Lux)
  irrigation_alert: boolean    // Ambang batas < 35.0%
}

// Menghasilkan 300 titik data uji trace-driven yang realistis berbasis karakteristik ThingSpeak 196075
export function generateTraceData(): TraceSample[] {
  const data: TraceSample[] = []
  const startTime = new Date("2026-11-18T08:00:00Z").getTime()

  // Base state kandungan air awal
  let currentSoil = 52.4

  for (let i = 1; i <= 300; i++) {
    const timestamp = new Date(startTime + (i - 1) * 10 * 60 * 1000).toISOString()
    const hour = (8 + Math.floor(((i - 1) * 10) / 60)) % 24

    // Pola sirkadian lingkungan
    const isDay = hour >= 6 && hour <= 18
    const temp_c = Number((24 + 7 * Math.sin(((hour - 6) / 12) * Math.PI) + (Math.sin(i * 0.3) * 0.4)).toFixed(1))
    const humidity_pct = Number((82 - 28 * Math.sin(((hour - 6) / 12) * Math.PI) + (Math.cos(i * 0.4) * 0.8)).toFixed(1))
    const light_lux = isDay
      ? Math.round(15000 * Math.sin(((hour - 6) / 12) * Math.PI) + (Math.sin(i * 0.7) * 800) + 200)
      : Math.round(20 + Math.random() * 15)

    // Pengeringan tanah dinamis (evapotranspirasi lebih cepat di siang hari)
    const evapRate = isDay ? 0.08 + (temp_c - 24) * 0.008 : 0.02
    currentSoil = Math.max(31.5, currentSoil - evapRate + (Math.sin(i * 0.5) * 0.015))

    // Simulasi irigasi otomatis jika menyentuh ambang < 35% pada titik tertentu
    if (currentSoil < 34.0 && i > 120 && i < 180) {
      currentSoil = 48.5 // virtual refill
    }

    const actual_soil_pct = Number(currentSoil.toFixed(2))

    // Model Ridge Regression: galat residual sangat rendah (R² ~ 0.989)
    const noise = Math.sin(i * 1.1) * 0.28 + Math.cos(i * 0.7) * 0.15
    const pred_cloud_pct = Number((actual_soil_pct + noise * 0.5).toFixed(4))
    
    // Float 32-bit di mikrokontroler memiliki deviasi pembulatan mikro dibandingkan float 64-bit Python
    const float32RoundingError = Number((Math.sin(i * 2.3) * 0.0004).toFixed(4))
    const pred_edge_pct = Number((pred_cloud_pct + float32RoundingError).toFixed(2))

    const parity_delta = Number(Math.abs(pred_edge_pct - pred_cloud_pct).toFixed(4))

    // Latensi komparatif: Edge (< 5 µs) vs Cloud RTT (45 - 120 ms)
    const edge_latency_us = Number((4.1 + Math.sin(i * 0.8) * 0.3).toFixed(1))
    const cloud_rtt_ms = Number((62.5 + Math.cos(i * 0.4) * 18.0 + (i % 35 === 0 ? 45.0 : 0)).toFixed(1)) // spike sesekali

    data.push({
      sample_idx: i,
      timestamp,
      actual_soil_pct,
      pred_edge_pct,
      pred_cloud_pct,
      parity_delta,
      edge_latency_us,
      cloud_rtt_ms,
      temp_c,
      humidity_pct,
      light_lux,
      irrigation_alert: actual_soil_pct < 35.0,
    })
  }

  return data
}
