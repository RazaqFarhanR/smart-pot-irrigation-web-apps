import { useMemo, useState } from "react"
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Cpu,
  FileCode,
  HardDrive,
  Layers,
  RefreshCw,
  Send,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { modelPresets } from "./model-catalog"

interface DeployOtaViewProps {
  onNavigateToTestbed?: () => void
}

type DeploymentTarget = "dual" | "edge_only" | "cloud_only"

export function DeployOtaView({ onNavigateToTestbed }: DeployOtaViewProps) {
  const [selectedModelId, setSelectedModelId] = useState<string>("ridge_alpha_10")
  const [target, setTarget] = useState<DeploymentTarget>("dual")
  const [deployState, setDeployState] = useState<"idle" | "sending" | "success">("idle")
  const [copied, setCopied] = useState<boolean>(false)

  const activeModel = useMemo(() => {
    return modelPresets.find((m) => m.id === selectedModelId) ?? modelPresets[0]
  }, [selectedModelId])

  // Payload JSON yang dikirim melalui MQTT
  const mqttPayload = useMemo(() => {
    return {
      protocol: "SMARTPOT_MODEL_OTA_V1",
      session_id: `OTA_${activeModel.id.toUpperCase()}_${Date.now().toString().slice(-6)}`,
      target,
      model_id: activeModel.id,
      algorithm: activeModel.algorithm,
      feature_count: activeModel.weights.length,
      intercept: activeModel.intercept,
      coefficients: activeModel.weights.map((w) => ({
        index: w.index,
        name: w.name,
        w: w.weight,
      })),
      timestamp: new Date().toISOString(),
    }
  }, [activeModel, target])

  const payloadString = JSON.stringify(mqttPayload, null, 2)

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(payloadString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTriggerOTA = () => {
    setDeployState("sending")
    // Simulasi pengiriman paket MQTT dan penerimaan ACK dalam 600ms
    setTimeout(() => {
      setDeployState("success")
    }, 600)
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b pb-4 border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Deploy Model OTA (Over-The-Air)
            </h2>
            <Badge variant="outline" className="text-xs bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300">
              MQTT Parameter OTA
            </Badge>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Pembaruan bobot linear model di ESP32-S3 secara nirkabel tanpa *re-flashing* firmware biner
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono text-xs">
            Topic: smartpot/device/model/update
          </Badge>
        </div>
      </div>

      {/* 2. Model Catalog Selection Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
            1. Pilih Model Prediksi dari Katalog
          </h3>
          <span className="text-xs text-neutral-400 font-mono">
            {modelPresets.length} Model Tersedia
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {modelPresets.map((model) => {
            const isSelected = model.id === selectedModelId
            return (
              <div
                key={model.id}
                onClick={() => {
                  setSelectedModelId(model.id)
                  setDeployState("idle")
                }}
                className={`relative flex flex-col justify-between rounded-xl border p-4 cursor-pointer transition-all ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50/20 shadow-xs ring-1 ring-emerald-500 dark:bg-emerald-950/20"
                    : "border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant={isSelected ? "default" : "outline"}
                      className={`text-[10px] ${
                        isSelected
                          ? "bg-emerald-600 text-white"
                          : "text-neutral-600 border-neutral-300 dark:text-neutral-400"
                      }`}
                    >
                      {model.tag}
                    </Badge>
                    {isSelected && (
                      <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {model.name}
                  </h4>
                  <p className="mt-1 text-xs text-neutral-500 line-clamp-2">
                    {model.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400">R²: <strong className="text-emerald-600 font-semibold">{model.r2}</strong></span>
                  <span className="text-neutral-400">RMSE: <strong className="text-indigo-600 font-semibold">{model.rmse}%</strong></span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 3. Detailed Model Card & 16 Causal Feature Inspector */}
      <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold">
                  2. Inspektor 16 Koefisien Bobot Kausal
                </CardTitle>
                <Badge variant="outline" className="font-mono text-xs">
                  {activeModel.weights.length} Fitur + 1 Intersep
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Vektor bobot linear w dan intersep b yang diinjeksi ke FPU ESP32-S3 untuk inferensi O(p)
              </CardDescription>
            </div>

            {/* Intercept Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs">
              <span className="text-neutral-500 font-medium">Intersep (Bias b):</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {activeModel.intercept > 0 ? `+${activeModel.intercept}` : activeModel.intercept}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {activeModel.weights.map((feat) => {
              const isPositive = feat.weight >= 0
              return (
                <div
                  key={feat.index}
                  className="rounded-lg border border-neutral-200/80 bg-neutral-50/50 p-2.5 text-xs dark:border-neutral-800 dark:bg-neutral-950/40"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-neutral-400 font-semibold">
                      w_{feat.index}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[9px] px-1 py-0 ${
                        feat.category === "soil"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40"
                          : feat.category === "climate"
                          ? "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40"
                          : feat.category === "circadian"
                          ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40"
                          : "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40"
                      }`}
                    >
                      {feat.category}
                    </Badge>
                  </div>

                  <div className="font-medium text-neutral-800 dark:text-neutral-200 truncate" title={feat.label}>
                    {feat.label}
                  </div>

                  <div className="mt-1 flex items-center justify-between pt-1 border-t border-neutral-100 dark:border-neutral-800 font-mono">
                    <span className="text-[10px] text-neutral-400">Nilai Bobot:</span>
                    <span
                      className={`font-bold ${
                        isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {isPositive ? `+${feat.weight.toFixed(4)}` : feat.weight.toFixed(4)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 4. Deployment Target, MQTT Payload Preview & Action Console */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Deployment Configuration */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              3. Konfigurasi Deployment & Target Node
            </CardTitle>
            <CardDescription className="text-xs">
              Pilih node penerima pembaruan model melalui broker Mosquitto
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Target Radio Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                Pilih Target Deployment:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={target === "dual" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTarget("dual")}
                  className="text-xs h-16 flex-col gap-1 cursor-pointer"
                >
                  <Layers className="size-4" />
                  <span>Dual Deployment</span>
                  <span className="text-[9px] opacity-75 font-normal">Edge + Cloud</span>
                </Button>

                <Button
                  variant={target === "edge_only" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTarget("edge_only")}
                  className="text-xs h-16 flex-col gap-1 cursor-pointer"
                >
                  <Cpu className="size-4" />
                  <span>ESP32-S3 Saja</span>
                  <span className="text-[9px] opacity-75 font-normal">On-Device SRAM</span>
                </Button>

                <Button
                  variant={target === "cloud_only" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTarget("cloud_only")}
                  className="text-xs h-16 flex-col gap-1 cursor-pointer"
                >
                  <HardDrive className="size-4" />
                  <span>Cloud Saja</span>
                  <span className="text-[9px] opacity-75 font-normal">Python Worker</span>
                </Button>
              </div>
            </div>

            {/* Specifications Summary */}
            <div className="rounded-lg bg-neutral-50 dark:bg-neutral-950 p-3 border border-neutral-100 dark:border-neutral-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Ukuran Muatan (Payload):</span>
                <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                  {activeModel.payload_bytes} Bytes
                </span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Alokasi Memori ESP32-S3:</span>
                <span className="font-mono font-semibold text-emerald-600">
                  64 Bytes (Float32 Array)
                </span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Estimasi Latensi Inferensi:</span>
                <span className="font-mono font-semibold text-indigo-600">
                  {activeModel.latency_us} µs
                </span>
              </div>
            </div>

            {/* Action Button & Status Feedback */}
            <div className="space-y-2 pt-2">
              <Button
                variant={deployState === "success" ? "outline" : "default"}
                size="lg"
                onClick={handleTriggerOTA}
                disabled={deployState === "sending"}
                className={`w-full gap-2 cursor-pointer font-semibold ${
                  deployState === "success"
                    ? "border-emerald-500 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                {deployState === "sending" ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    <span>Mentransmisikan Bobot via MQTT...</span>
                  </>
                ) : deployState === "success" ? (
                  <>
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    <span>Model Berhasil Terpasang di Node! (ACK 0.04s)</span>
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    <span>Deploy Model ke Node via MQTT</span>
                  </>
                )}
              </Button>

              {/* Call-to-action ke Testbed jika deploy sukses */}
              {deployState === "success" && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={onNavigateToTestbed}
                  className="w-full gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs cursor-pointer animate-in fade-in"
                >
                  <span>Buka Tab Testbed untuk Menguji Model Ini (N=300)</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right: MQTT Payload Preview */}
        <Card className="border-neutral-200 shadow-xs dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="size-4 text-neutral-500" />
                <CardTitle className="text-base font-semibold">
                  Inspektor Paket MQTT (Payload JSON)
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyJSON}
                className="h-7 gap-1 text-xs text-neutral-500 cursor-pointer"
              >
                {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                <span>{copied ? "Tersalin!" : "Salin JSON"}</span>
              </Button>
            </div>
            <CardDescription className="text-xs">
              Struktur paket transmisi JSON berukuran ~220 byte yang diterbitkan ke broker
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg bg-neutral-900 p-3.5 text-neutral-100 font-mono text-[11px] overflow-x-auto max-h-80 overflow-y-auto leading-relaxed border border-neutral-800">
              <pre>{payloadString}</pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
