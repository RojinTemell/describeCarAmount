import { NextRequest, NextResponse } from "next/server"
import { analyzeVehicleImage } from "@/lib/gemini"
import { estimatePriceRange } from "@/lib/pricing"
import type { AnalysisResult } from "@/types/vehicle"

type AnalyzeRequestBody = {
  imageBase64?: string
  mimeType?: string
  manualYear?: number | null
  manualPackage?: string | null
}

export const runtime = "nodejs"

export const POST = async (request: NextRequest) => {
  try {
    const body = (await request.json()) as AnalyzeRequestBody

    if (!body.imageBase64 || !body.mimeType) {
      return NextResponse.json({ error: "Gecerli resim verisi gerekli" }, { status: 400 })
    }

    const vehicleFromAi = await analyzeVehicleImage(body.imageBase64, body.mimeType)
    const vehicle = {
      ...vehicleFromAi,
      year: typeof body.manualYear === "number" && Number.isFinite(body.manualYear) ? body.manualYear : vehicleFromAi.year,
      packageName: body.manualPackage?.trim() ? body.manualPackage.trim() : vehicleFromAi.packageName
    }
    const pricing = estimatePriceRange(vehicle)
    const result: AnalysisResult = { vehicle, pricing }

    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Bilinmeyen hata"
    return NextResponse.json(
      {
        error: message || "Analiz su anda tamamlanamadi"
      },
      { status: 500 }
    )
  }
}
