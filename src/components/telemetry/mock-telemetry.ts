import type { TelemetryRecord } from "@/types"

export function generateTelemetryFeed(): TelemetryRecord[] {
  const records: TelemetryRecord[] = []
  const baseTime = new Date("2026-11-19T13:00:00Z").getTime()
  const intervalMs = 10 * 60 * 1000 // 10 menit

  let soil = 45.8

  for (let i = 25; i >= 1; i--) {
    const seq = 117 + (26 - i)
    const timestampMs = baseTime - (i - 1) * intervalMs
    const time = new Date(timestampMs)
    const hour = time.getHours() + time.getMinutes() / 60

    const isDay = hour >= 6 && hour <= 18
    const temp_c = Number((24.2 + 6.8 * Math.sin(((hour - 6) / 12) * Math.PI) + (Math.sin(seq * 0.4) * 0.3)).toFixed(1))
    const humidity_pct = Number((78 - 24 * Math.sin(((hour - 6) / 12) * Math.PI) + (Math.cos(seq * 0.5) * 0.5)).toFixed(1))
    const light_lux = isDay ? Math.round(18000 * Math.sin(((hour - 6) / 12) * Math.PI) + 450) : 25

    // Evaporasi tanah perlahan
    soil -= 0.35
    if (soil < 33.5 && seq > 130) {
      soil = 52.0 // virtual irrigation
    }

    const soil_pct = Number(soil.toFixed(1))
    const soil_raw = Math.round(1400 + (100 - soil_pct) * 18.5)
    const pump_status = soil_pct < 35.0 ? 1 : 0
    const pump_duration_sec = pump_status === 1 ? 15 : 0

    // Jitter transmisi jaringan awan 800 - 1500 ms
    const jitterMs = Math.round(850 + Math.sin(seq * 1.5) * 400)
    const received_at = new Date(timestampMs + jitterMs).toISOString()

    records.push({
      id: 26 - i,
      device_id: "esp32s3-pot-01",
      record_seq: seq,
      timestamp: time.toISOString(),
      timestamp_quality: "rtc_synced",
      temp_c,
      humidity_pct,
      light_lux,
      soil_raw,
      soil_pct,
      pump_status,
      pump_duration_sec,
      wifi_rssi: -58 - (seq % 4),
      free_heap_bytes: 184520,
      error_code: 0,
      received_at,
    })
  }

  // Reverse agar data terbaru berada paling atas
  return records.reverse()
}
