"use client"

import { useMemo, useState } from "react"
import type { AnalysisResult } from "@/types/vehicle"

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024

const formatTurkishLira = (value: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(value)

const fileToBase64 = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer()
  const bytes = new Uint8Array(arrayBuffer)
  let binary = ""

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return window.btoa(binary)
}

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Gorsel onizleme verisi olusturulamadi"))
        return
      }

      resolve(reader.result)
    }

    reader.onerror = () => {
      reject(new Error("Gorsel okunamadi"))
    }

    reader.readAsDataURL(file)
  })

const UploadAnalyzeForm = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [manualYear, setManualYear] = useState("")
  const [manualPackage, setManualPackage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const acceptedTypesLabel = useMemo(() => "JPG, PNG, WEBP - max 8MB", [])

  const resetAnalysis = () => {
    setResult(null)
    setErrorMessage(null)
  }

  const validateFile = (file: File) => {
    const isImageByMime = file.type.startsWith("image/")
    const isImageByExtension = /\.(heic|heif|jpg|jpeg|png|webp|gif|bmp|avif)$/i.test(file.name)

    if (!isImageByMime && !isImageByExtension) {
      return "Lutfen gecerli bir gorsel dosyasi yukleyin"
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return "Dosya boyutu 8MB sinirini asmamali"
    }

    return null
  }

  const handleSetFile = async (file: File) => {
    const validationError = validateFile(file)

    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    try {
      const dataUrl = await fileToDataUrl(file)
      setSelectedFile(file)
      setPreviewUrl(dataUrl)
      resetAnalysis()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gorsel onizlemesi olusturulamadi")
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    void handleSetFile(file)
  }

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (!file) {
      return
    }

    void handleSetFile(file)
  }

  const handleAnalyzeClick = async () => {
    if (!selectedFile) {
      setErrorMessage("Lutfen once bir fotograf secin")
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const imageBase64 = await fileToBase64(selectedFile)
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          imageBase64,
          mimeType: selectedFile.type,
          manualYear: manualYear.trim() ? Number(manualYear) : null,
          manualPackage: manualPackage.trim() || null
        })
      })

      if (!response.ok) {
        const errorPayload = (await response.json()) as { error?: string }
        throw new Error(errorPayload.error || "Analiz basarisiz oldu")
      }

      const analysisResult = (await response.json()) as AnalysisResult
      setResult(analysisResult)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Analiz sirasinda hata olustu")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearClick = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setResult(null)
    setErrorMessage(null)
  }

  return (
    <section className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">Aracini fotografla, degerini ogren</h2>
        <p className="text-sm text-slate-600">
          Tek bir fotograf yukle. AI, marka-model-yil bilgisi ve tahmini fiyat araligini olustursun.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {!previewUrl ? (
          <label
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            className="flex min-h-64 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-slate-500 hover:bg-slate-100"
            tabIndex={0}
            aria-label="Arac fotografinizi surukleyip birakabileceginiz alan"
            onKeyDown={(event) => {
              if (event.key !== "Enter" && event.key !== " ") {
                return
              }

              const input = document.getElementById("vehicle-image-input")
              input?.click()
            }}
          >
            <span className="text-base font-semibold text-slate-900">Surukle birak veya tiklayarak sec</span>
            <span className="text-xs text-slate-500">{acceptedTypesLabel}</span>
            <input
              id="vehicle-image-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="relative h-72 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            <img
              src={previewUrl}
              alt="Yuklenen arac fotografi onizlemesi"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={handleClearClick}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-lg font-semibold text-white transition hover:bg-black"
              aria-label="Yuklenen fotografi sil"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-600">Yil (opsiyonel)</span>
            <input
              type="number"
              inputMode="numeric"
              min={1970}
              max={new Date().getFullYear() + 1}
              value={manualYear}
              onChange={(event) => setManualYear(event.target.value)}
              placeholder="Orn: 2020"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-600">Paket (opsiyonel)</span>
            <input
              type="text"
              value={manualPackage}
              onChange={(event) => setManualPackage(event.target.value)}
              placeholder="Orn: Comfortline"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleAnalyzeClick}
            disabled={isLoading}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Analiz ediliyor..." : "AI ile analiz et"}
          </button>
          {!previewUrl ? null : (
            <button
              type="button"
              onClick={handleClearClick}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Fotografi temizle
            </button>
          )}
        </div>

        {errorMessage ? (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{errorMessage}</p>
        ) : null}
      </div>

      {result ? (
        <article className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Tahmin Sonucu</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
            <p>
              <strong>Marka:</strong> {result.vehicle.brand}
            </p>
            <p>
              <strong>Model:</strong> {result.vehicle.model}
            </p>
            <p>
              <strong>Yil:</strong> {result.vehicle.year ?? "Bilinmiyor"}
            </p>
            <p>
              <strong>Paket:</strong> {result.vehicle.packageName ?? "Belirlenemedi"}
            </p>
          </div>
          <p className="mt-3 text-sm text-slate-700">
            <strong>Kondisyon:</strong> {result.vehicle.conditionSummary}
          </p>
          <p className="mt-5 text-base font-semibold text-slate-900">
            {formatTurkishLira(result.pricing.minPrice)} - {formatTurkishLira(result.pricing.maxPrice)}
          </p>
          <p className="mt-1 text-xs text-slate-500">{result.pricing.confidenceNote}</p>
        </article>
      ) : null}
    </section>
  )
}

export default UploadAnalyzeForm
