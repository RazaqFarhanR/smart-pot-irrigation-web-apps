export interface SensorDataPoint {
  timestamp: string
  formattedTime: string
  soil_pct: number         // Kandungan Air dalam Tanah (%)
  temp_c: number           // Suhu Lingkungan (°C)
  humidity_pct: number     // Kelembaban Udara (%)
  light_lux: number        // Intensitas Cahaya (Lux)
  soil_raw: number         // Nilai ADC Sensor Tanah
  status: "optimal" | "warning" | "dry"
}

// Menghasilkan data historis kontinu (hingga 144 titik data untuk 24 jam dengan interval 10 menit)
export function generateSensorHistory(): SensorDataPoint[] {
  const points: SensorDataPoint[] = []
  const now = new Date()
  const intervalMs = 10 * 60 * 1000 // 10 menit

  // Mulai dari 24 jam yang lalu (144 titik)
  const startTime = now.getTime() - 143 * intervalMs

  let currentSoil = 58.2

  for (let i = 0; i < 144; i++) {
    const time = new Date(startTime + i * intervalMs)
    const hour = time.getHours() + time.getMinutes() / 60

    const isDay = hour >= 6 && hour <= 18
    // Suhu berfluktuasi antara 23°C (subuh) hingga 32.5°C (siang hari)
    const temp_c = Number(
      (23.5 + 8.5 * Math.sin(((hour - 6) / 12) * Math.PI) + (Math.sin(i * 0.4) * 0.3)).toFixed(1)
    )

    // Kelembaban udara berkebalikan dengan suhu (85% subuh -> 48% siang)
    const humidity_pct = Number(
      (84 - 34 * Math.sin(((hour - 6) / 12) * Math.PI) + (Math.cos(i * 0.5) * 0.7)).toFixed(1)
    )

    // Cahaya matahari puncak di tengah hari (hingga 42.000 lux)
    const light_lux = isDay
      ? Math.round(38000 * Math.sin(((hour - 6) / 12) * Math.PI) + (Math.sin(i * 0.8) * 1200))
      : Math.round(15 + Math.random() * 20)

    // Laju pengeringan tanah (evapotranspirasi lebih tinggi saat panas terik)
    const evapRate = isDay ? 0.12 + (temp_c - 24) * 0.015 : 0.03
    currentSoil -= evapRate

    // Rehidrasi / simulasi penyiraman saat mendekati 34%
    if (currentSoil < 34.2 && i < 110) {
      currentSoil = 56.0
    }

    const soil_pct = Number(currentSoil.toFixed(1))
    const soil_raw = Math.round(1400 + (100 - soil_pct) * 18.5)

    let status: "optimal" | "warning" | "dry" = "optimal"
    if (soil_pct < 35.0) {
      status = "dry"
    } else if (soil_pct < 40.0) {
      status = "warning"
    }

    points.push({
      timestamp: time.toISOString(),
      formattedTime: time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      soil_pct,
      temp_c,
      humidity_pct,
      light_lux,
      soil_raw,
      status,
    })
  }

  return points
}
