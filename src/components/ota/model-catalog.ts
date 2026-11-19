export interface FeatureWeight {
  index: number
  name: string
  label: string
  category: "soil" | "climate" | "circadian" | "interaction"
  weight: number
  description: string
}

export interface ModelPreset {
  id: string
  name: string
  algorithm: string
  tag: string
  alpha?: number
  r2: number
  rmse: number
  mae: number
  latency_us: number
  payload_bytes: number
  intercept: number
  description: string
  weights: FeatureWeight[]
}

const baseFeatureDefinitions = [
  { index: 1, name: "soil_lag_1", label: "Kandungan Air Tanah (t-1)", category: "soil" as const, description: "Nilai kelembaban tanah 10 menit sebelumnya" },
  { index: 2, name: "soil_lag_2", label: "Kandungan Air Tanah (t-2)", category: "soil" as const, description: "Nilai kelembaban tanah 20 menit sebelumnya" },
  { index: 3, name: "soil_lag_3", label: "Kandungan Air Tanah (t-3)", category: "soil" as const, description: "Nilai kelembaban tanah 30 menit sebelumnya" },
  { index: 4, name: "soil_roll_mean_3", label: "Rata-rata Bergerak Tanah", category: "soil" as const, description: "Tren rata-rata 3 periode waktu" },
  { index: 5, name: "soil_roll_std_3", label: "Volatilitas Tanah (Std Dev)", category: "soil" as const, description: "Fluktuasi pembacaan sensor tanah" },
  { index: 6, name: "temp_lag_1", label: "Suhu Lingkungan (t-1)", category: "climate" as const, description: "Kondisi termal atmosfer pot" },
  { index: 7, name: "temp_roll_mean_3", label: "Rata-rata Bergerak Suhu", category: "climate" as const, description: "Tren suhu 30 menit terakhir" },
  { index: 8, name: "humidity_lag_1", label: "Kelembaban Udara (t-1)", category: "climate" as const, description: "RH lingkungan tanaman" },
  { index: 9, name: "humidity_roll_mean_3", label: "Rata-rata Bergerak RH", category: "climate" as const, description: "Tren RH mikro 30 menit terakhir" },
  { index: 10, name: "light_lag_1", label: "Intensitas Cahaya (t-1)", category: "climate" as const, description: "Fluks radiasi foton fotosintesis" },
  { index: 11, name: "sin_time", label: "Siklus Sirkadian Sinus", category: "circadian" as const, description: "Proyeksi siklus diurnal siang hari" },
  { index: 12, name: "cos_time", label: "Siklus Sirkadian Kosinus", category: "circadian" as const, description: "Proyeksi siklus fotoperiode malam" },
  { index: 13, name: "vpd_proxy", label: "Interaksi Termal (VPD Proxy)", category: "interaction" as const, description: "Interaksi suhu dan defisit tekanan uap" },
  { index: 14, name: "soil_diff_1", label: "Delta Tanah (t-1 vs t-2)", category: "soil" as const, description: "Laju turunan pengeringan tanah" },
  { index: 15, name: "temp_diff_1", label: "Delta Suhu (t-1 vs t-2)", category: "climate" as const, description: "Laju perubahan gradien suhu" },
  { index: 16, name: "is_daytime", label: "Flag Fotoperiode Siang", category: "circadian" as const, description: "Variabel biner radiasi matahari aktif" },
]

export const modelPresets: ModelPreset[] = [
  {
    id: "ridge_alpha_10",
    name: "Ridge Regression (α = 10.0)",
    algorithm: "Linear Ridge Regression with L2 Penalty",
    tag: "Model Utama (SOTA)",
    alpha: 10.0,
    r2: 0.9894,
    rmse: 1.6604,
    mae: 0.4279,
    latency_us: 4.1,
    payload_bytes: 218,
    intercept: 0.4285,
    description: "Model linier berregularisasi L2 optimal pada dataset ThingSpeak 196075 dengan akurasi tertinggi dan bebas overfitting.",
    weights: baseFeatureDefinitions.map((f, i) => {
      const weights = [
        0.8421, 0.0812, 0.0415, 0.0152, -0.0105,
        -0.0384, -0.0121, 0.0185, 0.0094, -0.0062,
        -0.0215, 0.0142, -0.0188, 0.0245, -0.0084, -0.0112
      ]
      return { ...f, weight: weights[i] }
    }),
  },
  {
    id: "ridge_alpha_1",
    name: "Ridge Regression (α = 1.0)",
    algorithm: "Linear Ridge Regression (Light Regularization)",
    tag: "Regularisasi Ringan",
    alpha: 1.0,
    r2: 0.9891,
    rmse: 1.6821,
    mae: 0.4350,
    latency_us: 4.1,
    payload_bytes: 218,
    intercept: 0.3951,
    description: "Regularisasi L2 lebih longgar, memberikan bobot lebih tinggi pada fitur lag namun sedikit lebih sensitif terhadap fluktuasi derau sensor.",
    weights: baseFeatureDefinitions.map((f, i) => {
      const weights = [
        0.8750, 0.0720, 0.0380, 0.0110, -0.0125,
        -0.0421, -0.0140, 0.0210, 0.0080, -0.0075,
        -0.0240, 0.0160, -0.0205, 0.0280, -0.0095, -0.0130
      ]
      return { ...f, weight: weights[i] }
    }),
  },
  {
    id: "huber_regressor",
    name: "Huber Regressor (ε = 1.35)",
    algorithm: "Robust Linear M-Estimator",
    tag: "Robust Linear",
    r2: 0.9875,
    rmse: 1.7450,
    mae: 0.4190,
    latency_us: 4.2,
    payload_bytes: 224,
    intercept: 0.4510,
    description: "Model linier dengan fungsi loss Huber yang kebal terhadap pencilan (outliers) pada pembacaan sensor kapasitif tanah.",
    weights: baseFeatureDefinitions.map((f, i) => {
      const weights = [
        0.8210, 0.0950, 0.0480, 0.0180, -0.0090,
        -0.0350, -0.0110, 0.0165, 0.0110, -0.0055,
        -0.0195, 0.0130, -0.0170, 0.0220, -0.0075, -0.0100
      ]
      return { ...f, weight: weights[i] }
    }),
  },
  {
    id: "ols_baseline",
    name: "Ordinary Least Squares (OLS)",
    algorithm: "Linear Regression (No Regularization)",
    tag: "Baseline Standar",
    r2: 0.9850,
    rmse: 1.8320,
    mae: 0.4710,
    latency_us: 4.1,
    payload_bytes: 212,
    intercept: 0.5120,
    description: "Model regresi linier klasik tanpa penalti bobot, digunakan sebagai baseline pembanding untuk mengukur signifikansi regularisasi.",
    weights: baseFeatureDefinitions.map((f, i) => {
      const weights = [
        0.9120, 0.0510, 0.0220, 0.0080, -0.0180,
        -0.0520, -0.0190, 0.0280, 0.0050, -0.0090,
        -0.0310, 0.0210, -0.0260, 0.0350, -0.0120, -0.0160
      ]
      return { ...f, weight: weights[i] }
    }),
  },
]
