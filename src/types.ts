export interface TelemetryRecord {
  id: number;
  device_id: string;
  record_seq: number;
  timestamp: string;
  timestamp_quality: string;
  temp_c: number;
  humidity_pct: number;
  light_lux: number;
  soil_raw: number;
  soil_pct: number; // Kandungan Air dalam Tanah (%)
  pump_status: number;
  pump_duration_sec: number;
  wifi_rssi: number;
  free_heap_bytes: number;
  error_code: number;
  received_at: string;
}

export interface DeviceStatus {
  device_id: string;
  status: 'online' | 'offline';
  firmware_version?: string;
  ip_address?: string;
  last_seen: string;
  wifi_rssi: number;
  free_heap_bytes: number;
}
