/**
 * Konstanta Domain Sistem Irigasi Cerdas & Edge ML ESP32-S3
 * Tugas Akhir S1 Informatika Telkom University
 * Peneliti: Razaq Farhan (103012300322)
 */

export const IRRIGATION_CONSTANTS = {
  // 1. Istilah Wajib Akademik (Non-Negotiable Guardrails)
  TARGET_SOIL_TERM: "Kandungan Air dalam Tanah",
  SOIL_UNIT: "%",

  // 2. Ambang Batas Kebijakan Irigasi Retrospektif (Opsi C+)
  THRESHOLD_CRITICAL_PCT: 35.0,
  OPTIMAL_SOIL_BAND: {
    min: 35.0,
    max: 70.0,
  },

  // 3. Efisiensi & Kapasitas Komputasi Edge (ESP32-S3 Xtensa LX7 @ 240 MHz)
  MAX_ALLOWED_EDGE_LATENCY_US: 100.0,
  TYPICAL_EDGE_LATENCY_US: 4.1,
  TYPICAL_CLOUD_RTT_MS: 62.5,
  MAX_MODEL_WEIGHT_BYTES: 1024,
  ACTUAL_MODEL_WEIGHT_BYTES: 64, // 16 bobot float32

  // 4. Spesifikasi Topik MQTT (Broker Port 1883)
  MQTT_TOPICS: {
    TELEMETRY: "smartpot/telemetry",
    OTA_UPDATE: "smartpot/model/update",
    DEVICE_STATUS: "smartpot/device/status",
  },

  // 5. Informasi Peneliti & Institusi
  RESEARCHER: {
    name: "Razaq Farhan",
    nim: "103012300322",
    program: "S1 Informatika",
    faculty: "Fakultas Informatika (FIF)",
    university: "Telkom University",
    year: "2026",
  },
} as const
