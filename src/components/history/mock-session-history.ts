export interface ExperimentSession {
  id: string
  title: string
  modelName: string
  modelFamily: "Ridge" | "Huber" | "OLS" | "Baseline"
  hyperparameters: Record<string, string | number | boolean>
  sampleCount: number
  date: string
  commitSha: string
  metrics: {
    r2: number
    rmse: number
    mae: number
    maxError: number
    parityDelta: number
    edgeLatencyUs: number
    memoryBytes: number
  }
  hypothesisStatus: {
    h1Parity: boolean     // Delta y < 1e-4 (Edge vs Cloud float parity)
    h2Efficiency: boolean // Latency < 100 us & SRAM < 1 KB (Edge feasibility)
    h3Accuracy: boolean   // R^2 > 0.95 & RMSE < 3% (Prediction quality)
  }
  statusLabel: "Optimal" | "Valid" | "Suboptimal" | "Failed"
  notes: string
  datasetPartition: string
}

export const EXPERIMENT_SESSIONS: ExperimentSession[] = [
  {
    id: "EXP-2026-0312-01",
    title: "Verifikasi Final Model Utama (Production Edge)",
    modelName: "Ridge Regression (α = 10.0)",
    modelFamily: "Ridge",
    hyperparameters: {
      alpha: 10.0,
      fit_intercept: true,
      solver: "cholesky",
      max_iter: 1000,
    },
    sampleCount: 300,
    date: "2026-03-12 14:30:22",
    commitSha: "1dd9602",
    metrics: {
      r2: 0.9894,
      rmse: 1.66,
      mae: 0.43,
      maxError: 4.12,
      parityDelta: 0.000008,
      edgeLatencyUs: 4.1,
      memoryBytes: 64,
    },
    hypothesisStatus: {
      h1Parity: true,
      h2Efficiency: true,
      h3Accuracy: true,
    },
    statusLabel: "Optimal",
    notes:
      "Model kandidat utama untuk buku skripsi Bab 4. Regularisasi L2 pada α=10.0 meredam multikolinearitas antar lag sensor secara efektif tanpa mengorbankan daya prediksi Kandungan Air dalam Tanah.",
    datasetPartition: "Test Split 30% (Data Retrospektif Edge_IoT_Dataset.xlsx)",
  },
  {
    id: "EXP-2026-0311-04",
    title: "Sensitivitas Regularisasi L2 Rendah",
    modelName: "Ridge Regression (α = 1.0)",
    modelFamily: "Ridge",
    hyperparameters: {
      alpha: 1.0,
      fit_intercept: true,
      solver: "cholesky",
      max_iter: 1000,
    },
    sampleCount: 300,
    date: "2026-03-11 19:15:08",
    commitSha: "7278572",
    metrics: {
      r2: 0.9882,
      rmse: 1.74,
      mae: 0.47,
      maxError: 4.45,
      parityDelta: 0.000009,
      edgeLatencyUs: 4.1,
      memoryBytes: 64,
    },
    hypothesisStatus: {
      h1Parity: true,
      h2Efficiency: true,
      h3Accuracy: true,
    },
    statusLabel: "Valid",
    notes:
      "Pengujian penalti L2 yang lebih longgar. Sedikit peningkatan galat residual pada fluktuasi transien radiasi cahaya tinggi.",
    datasetPartition: "Test Split 30% (Data Retrospektif Edge_IoT_Dataset.xlsx)",
  },
  {
    id: "EXP-2026-0310-02",
    title: "Uji Robustness Terhadap Outlier Sensor",
    modelName: "Huber Regressor (ε = 1.35)",
    modelFamily: "Huber",
    hyperparameters: {
      epsilon: 1.35,
      alpha: 0.0001,
      max_iter: 1000,
    },
    sampleCount: 300,
    date: "2026-03-10 11:05:40",
    commitSha: "a690e12",
    metrics: {
      r2: 0.9871,
      rmse: 1.82,
      mae: 0.49,
      maxError: 4.02,
      parityDelta: 0.000011,
      edgeLatencyUs: 4.2,
      memoryBytes: 64,
    },
    hypothesisStatus: {
      h1Parity: true,
      h2Efficiency: true,
      h3Accuracy: true,
    },
    statusLabel: "Valid",
    notes:
      "Pengujian loss function kombinasi MSE-MAE untuk ketahanan spike sensor. Sangat stabil terhadap noise sesaat, namun RMSE keseluruhan sedikit lebih tinggi dari Ridge α=10.",
    datasetPartition: "Test Split 30% (Data Retrospektif Edge_IoT_Dataset.xlsx)",
  },
  {
    id: "EXP-2026-0308-03",
    title: "Eksperimen Pembanding OLS Tanpa Penalti",
    modelName: "Ordinary Least Squares (OLS)",
    modelFamily: "OLS",
    hyperparameters: {
      fit_intercept: true,
      positive: false,
    },
    sampleCount: 300,
    date: "2026-03-08 16:40:15",
    commitSha: "e811be2",
    metrics: {
      r2: 0.9865,
      rmse: 1.89,
      mae: 0.52,
      maxError: 4.88,
      parityDelta: 0.000008,
      edgeLatencyUs: 4.1,
      memoryBytes: 64,
    },
    hypothesisStatus: {
      h1Parity: true,
      h2Efficiency: true,
      h3Accuracy: true,
    },
    statusLabel: "Valid",
    notes:
      "Baseline regresi linier klasik. Menunjukkan sedikit pembesaran koefisien pada fitur lag kelembaban udara akibat korelasi multivariat.",
    datasetPartition: "Test Split 30% (Data Retrospektif Edge_IoT_Dataset.xlsx)",
  },
  {
    id: "EXP-2026-0228-02",
    title: "Stress Testing Jangka Panjang (Extended Trace)",
    modelName: "Ridge Regression (α = 10.0)",
    modelFamily: "Ridge",
    hyperparameters: {
      alpha: 10.0,
      solver: "cholesky",
    },
    sampleCount: 1000,
    date: "2026-02-28 09:20:00",
    commitSha: "4d01edf",
    metrics: {
      r2: 0.9891,
      rmse: 1.68,
      mae: 0.44,
      maxError: 4.25,
      parityDelta: 0.000010,
      edgeLatencyUs: 4.1,
      memoryBytes: 64,
    },
    hypothesisStatus: {
      h1Parity: true,
      h2Efficiency: true,
      h3Accuracy: true,
    },
    statusLabel: "Optimal",
    notes:
      "Replay trace skala penuh selama rentang siklus 7 hari (1.000 titik inferensi). Menunjukkan konsistensi drift mendekati nol pada inferensi float32 mikrokontroler ESP32-S3.",
    datasetPartition: "Full Trace Extended (1000 Sampel Kontinu)",
  },
  {
    id: "EXP-2026-0225-01",
    title: "Baseline Naive Dummy Regressor (Mean Target)",
    modelName: "Mean Baseline Predictor",
    modelFamily: "Baseline",
    hyperparameters: {
      strategy: "mean",
    },
    sampleCount: 300,
    date: "2026-02-25 10:00:11",
    commitSha: "e2dbf6c",
    metrics: {
      r2: 0.0000,
      rmse: 16.12,
      mae: 13.45,
      maxError: 28.50,
      parityDelta: 0.000001,
      edgeLatencyUs: 0.8,
      memoryBytes: 4,
    },
    hypothesisStatus: {
      h1Parity: true,
      h2Efficiency: true,
      h3Accuracy: false,
    },
    statusLabel: "Failed",
    notes:
      "Model acuan batas bawah (null model). Memprediksi nilai rata-rata konstan tanpa mempertimbangkan fitur lingkungan. Digunakan sebagai pembanding statistik ketiadaan daya prediktif.",
    datasetPartition: "Test Split 30% (Data Retrospektif Edge_IoT_Dataset.xlsx)",
  },
]
