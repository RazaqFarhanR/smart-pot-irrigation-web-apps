import { useState, useMemo } from "react"
import {
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  FileCode,
  Table as TableIcon,
  Filter,
  Layers,
  Sparkles,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  DATASET_CONFIG,
  getExportData,
  generateCsv,
  generateJson,
  generateLatexTable,
  type ExportDatasetType,
  type ExportFormatType,
} from "./export-helpers"

export function ExportView() {
  const [selectedDataset, setSelectedDataset] = useState<ExportDatasetType>("testbed")
  const [selectedFormat, setSelectedFormat] = useState<ExportFormatType>("csv")
  const [sampleLimit, setSampleLimit] = useState<number>(300)
  const [copied, setCopied] = useState<boolean>(false)

  // Current dataset schema
  const datasetInfo = DATASET_CONFIG[selectedDataset]

  // Selected columns state (defaults to defaultSelected)
  const [selectedColumns, setSelectedColumns] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    datasetInfo.columns.forEach((c) => {
      init[c.id] = c.defaultSelected
    })
    return init
  })

  // Handle dataset change: reset columns
  const handleDatasetChange = (val: ExportDatasetType) => {
    setSelectedDataset(val)
    const newConfig = DATASET_CONFIG[val]
    const init: Record<string, boolean> = {}
    newConfig.columns.forEach((c) => {
      init[c.id] = c.defaultSelected
    })
    setSelectedColumns(init)
  }

  // Active column IDs
  const activeColIds = useMemo(() => {
    return datasetInfo.columns.filter((c) => selectedColumns[c.id]).map((c) => c.id)
  }, [datasetInfo, selectedColumns])

  // Processed data
  const processedData = useMemo(() => {
    return getExportData(selectedDataset, sampleLimit)
  }, [selectedDataset, sampleLimit])

  // Generated output string based on format
  const generatedOutput = useMemo(() => {
    if (selectedFormat === "csv") {
      return generateCsv(processedData, activeColIds, datasetInfo.columns)
    }
    if (selectedFormat === "json") {
      return generateJson(processedData, activeColIds)
    }
    if (selectedFormat === "latex") {
      return generateLatexTable(processedData, activeColIds, datasetInfo.columns, datasetInfo.name)
    }
    return ""
  }, [processedData, activeColIds, datasetInfo, selectedFormat])

  // Toggle single column
  const toggleColumn = (colId: string) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [colId]: !prev[colId],
    }))
  }

  // Select all or deselect all
  const handleSelectAll = (select: boolean) => {
    const updated: Record<string, boolean> = {}
    datasetInfo.columns.forEach((c) => {
      updated[c.id] = select
    })
    setSelectedColumns(updated)
  }

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Handle download file
  const handleDownload = () => {
    let mimeType = "text/plain"
    let extension = "txt"

    if (selectedFormat === "csv") {
      mimeType = "text/csv;charset=utf-8;"
      extension = "csv"
    } else if (selectedFormat === "json") {
      mimeType = "application/json;charset=utf-8;"
      extension = "json"
    } else if (selectedFormat === "latex") {
      mimeType = "text/x-tex;charset=utf-8;"
      extension = "tex"
    }

    const blob = new Blob([generatedOutput], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `ekspor_${selectedDataset}_${new Date().toISOString().slice(0, 10)}.${extension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Ekspor Data &amp; Generator Tabel
            </h2>
            <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
              Bab 4 Skripsi Ready
            </Badge>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Ekstraksi dataset telemetri, hasil inferensi edge, dan kode tabel LaTeX untuk naskah Tugas Akhir
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="cursor-pointer gap-1.5"
            disabled={activeColIds.length === 0}
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-medium">Tersalin ke Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5 text-neutral-600" />
                <span>Salin Teks</span>
              </>
            )}
          </Button>

          <Button
            size="sm"
            onClick={handleDownload}
            className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
            disabled={activeColIds.length === 0}
          >
            <Download className="size-3.5" />
            <span>Unduh File .{selectedFormat === "latex" ? "tex" : selectedFormat}</span>
          </Button>
        </div>
      </div>

      {/* 2. Configuration Panel (Grid 3 Kolom) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Kolom 1: Pemilihan Dataset */}
        <Card className="border-neutral-200 dark:border-neutral-800 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
              <Layers className="size-3.5 text-emerald-600" />
              1. Pilih Dataset Sumber
            </CardTitle>
            <CardDescription className="text-xs">
              Pilih data yang ingin diekstraksi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {(Object.keys(DATASET_CONFIG) as ExportDatasetType[]).map((key) => {
              const cfg = DATASET_CONFIG[key]
              const isSelected = selectedDataset === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleDatasetChange(key)}
                  className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xs"
                      : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-neutral-900 dark:text-neutral-100">
                      {cfg.name}
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {cfg.recordCount} Baris
                    </Badge>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2">
                    {cfg.description}
                  </p>
                </button>
              )
            })}
          </CardContent>
        </Card>

        {/* Kolom 2: Format & Limit Sampel */}
        <Card className="border-neutral-200 dark:border-neutral-800 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
              <FileSpreadsheet className="size-3.5 text-blue-600" />
              2. Format &amp; Batas Sampel
            </CardTitle>
            <CardDescription className="text-xs">
              Pilih ekstensi file dan limit baris
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Format Selector */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block">
                Format Berkas Keluaran:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={selectedFormat === "csv" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFormat("csv")}
                  className={
                    selectedFormat === "csv"
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs cursor-pointer"
                      : "font-mono text-xs cursor-pointer"
                  }
                >
                  .CSV
                </Button>
                <Button
                  type="button"
                  variant={selectedFormat === "json" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFormat("json")}
                  className={
                    selectedFormat === "json"
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs cursor-pointer"
                      : "font-mono text-xs cursor-pointer"
                  }
                >
                  .JSON
                </Button>
                <Button
                  type="button"
                  variant={selectedFormat === "latex" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFormat("latex")}
                  className={
                    selectedFormat === "latex"
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs cursor-pointer"
                      : "font-mono text-xs cursor-pointer"
                  }
                >
                  LaTeX (.tex)
                </Button>
              </div>
            </div>

            {/* Sample Limit Selector */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block">
                Batas Jumlah Sampel:
              </label>
              <Select
                value={sampleLimit.toString()}
                onValueChange={(val) => setSampleLimit(Number(val))}
              >
                <SelectTrigger className="w-full text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="300">Semua Baris (Maks. 300 Sampel)</SelectItem>
                  <SelectItem value="100">100 Baris Pertama</SelectItem>
                  <SelectItem value="50">50 Baris Pertama</SelectItem>
                  <SelectItem value="20">20 Baris Pertama</SelectItem>
                  <SelectItem value="10">10 Baris Pertama (Tabel Ringkas)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* LaTeX Highlight Banner */}
            {selectedFormat === "latex" && (
              <div className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 text-xs space-y-1">
                <span className="font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                  <Sparkles className="size-3.5" />
                  Format LaTeX Booktabs
                </span>
                <p className="text-[11px] text-indigo-900/80 dark:text-indigo-200 leading-relaxed">
                  Menghasilkan tabel standar buku skripsi dengan caption otomatis dan escape karakter matematis.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Kolom 3: Pemilihan Kolom / Fitur */}
        <Card className="border-neutral-200 dark:border-neutral-800 shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <Filter className="size-3.5 text-violet-600" />
                3. Kolom &amp; Atribut
              </CardTitle>
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleSelectAll(true)}
                  className="text-emerald-600 hover:underline cursor-pointer"
                >
                  Semua
                </button>
                <span className="text-neutral-300">|</span>
                <button
                  type="button"
                  onClick={() => handleSelectAll(false)}
                  className="text-neutral-500 hover:underline cursor-pointer"
                >
                  Hapus
                </button>
              </div>
            </div>
            <CardDescription className="text-xs">
              {activeColIds.length} dari {datasetInfo.columns.length} kolom dipilih
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
            {datasetInfo.columns.map((col) => {
              const isChecked = !!selectedColumns[col.id]
              return (
                <label
                  key={col.id}
                  className={`flex items-center gap-2 p-2 rounded-md text-xs cursor-pointer transition-colors ${
                    isChecked
                      ? "bg-neutral-100 dark:bg-neutral-900 font-medium text-neutral-900 dark:text-neutral-100"
                      : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleColumn(col.id)}
                    className="size-3.5 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="truncate">{col.label}</span>
                </label>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* 3. Live Preview Tabs */}
      <Card className="border-neutral-200 dark:border-neutral-800 shadow-xs">
        <Tabs defaultValue="table" className="w-full">
          <CardHeader className="pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-base font-semibold">
                  Pratinjau Keluaran Data
                </CardTitle>
                <CardDescription className="text-xs">
                  {processedData.length} baris data disiapkan untuk ekspor ({selectedFormat.toUpperCase()})
                </CardDescription>
              </div>
              <TabsList className="grid w-full sm:w-[260px] grid-cols-2">
                <TabsTrigger value="table" className="text-xs cursor-pointer gap-1.5">
                  <TableIcon className="size-3.5" />
                  Pratinjau Tabel
                </TabsTrigger>
                <TabsTrigger value="raw" className="text-xs cursor-pointer gap-1.5">
                  <FileCode className="size-3.5" />
                  Kode Mentah
                </TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            {/* Tab 1: Pratinjau Tabel */}
            <TabsContent value="table" className="m-0">
              {activeColIds.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-500">
                  Pilih setidaknya 1 kolom di panel konfigurasi atas untuk menampilkan pratinjau tabel.
                </div>
              ) : (
                <div className="rounded-md border border-neutral-200 dark:border-neutral-800 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-neutral-50/75 dark:bg-neutral-900/50 hover:bg-transparent">
                        {activeColIds.map((colId) => {
                          const col = datasetInfo.columns.find((c) => c.id === colId)
                          return (
                            <TableHead key={colId} className="font-semibold text-xs whitespace-nowrap">
                              {col?.label || colId}
                            </TableHead>
                          )
                        })}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {processedData.slice(0, 8).map((row, idx) => (
                        <TableRow key={idx} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30">
                          {activeColIds.map((colId) => {
                            const val = row[colId]
                            return (
                              <TableCell key={colId} className="font-mono text-xs whitespace-nowrap">
                                {typeof val === "number" && !Number.isInteger(val)
                                  ? val.toFixed(2)
                                  : String(val ?? "-")}
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {processedData.length > 8 && (
                    <div className="p-2 text-center text-[11px] text-neutral-400 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/30">
                      Menampilkan 8 baris pertama dari total {processedData.length} baris data yang siap diunduh.
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Tab 2: Kode Mentah (Raw Output) */}
            <TabsContent value="raw" className="m-0">
              <div className="relative">
                <pre className="p-4 rounded-lg bg-neutral-900 text-neutral-100 font-mono text-xs overflow-x-auto max-h-[380px] leading-relaxed">
                  <code>{generatedOutput}</code>
                </pre>
                <div className="absolute top-2 right-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCopy}
                    className="h-7 text-xs gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                    <span>{copied ? "Tersalin" : "Salin"}</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}
