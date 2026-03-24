import type { VehicleAnalysis } from "@/types/vehicle"

const GEMINI_MODEL = "gemini-2.5-flash"

const buildPrompt = () => {
  return [
    "Bu fotografdaki araci analiz et.",
    "Sadece gecerli JSON dondur.",
    "JSON semasi:",
    "{",
    '  "brand": "string",',
    '  "model": "string",',
    '  "year": "number | null",',
    '  "packageName": "string | null",',
    '  "conditionSummary": "string"',
    "}"
  ].join("\n")
}

const sanitizeJsonResponse = (rawText: string) => {
  const trimmedText = rawText.trim()
  const withoutMarkdown = trimmedText.replace(/^```json\s*/i, "").replace(/```$/i, "")
  return withoutMarkdown.trim()
}

const parseVehicleAnalysis = (rawText: string): VehicleAnalysis => {
  const parsedJson = JSON.parse(sanitizeJsonResponse(rawText)) as Partial<VehicleAnalysis>

  return {
    brand: parsedJson.brand?.trim() || "Bilinmiyor",
    model: parsedJson.model?.trim() || "Bilinmiyor",
    year: typeof parsedJson.year === "number" ? parsedJson.year : null,
    packageName: parsedJson.packageName?.trim() || null,
    conditionSummary: parsedJson.conditionSummary?.trim() || "Kondisyon tespit edilemedi"
  }
}

export const analyzeVehicleImage = async (base64Image: string, mimeType: string) => {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY tanimli degil")
  }

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [
          { text: buildPrompt() },
          {
            inlineData: {
              mimeType,
              data: base64Image
            }
          }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json"
    }
  }

  let response: Response

  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      }
    )
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Baglanti kurulamadi"
    throw new Error(`Gemini baglanti hatasi: ${reason}`)
  }

  if (!response.ok) {
    const errorText = await response.text()
    const isInvalidImageError =
      response.status === 400 &&
      (errorText.includes("Unable to process input image") || errorText.includes("INVALID_ARGUMENT"))
    const isQuotaError =
      response.status === 429 ||
      errorText.includes("RESOURCE_EXHAUSTED") ||
      errorText.toLowerCase().includes("quota")

    if (isInvalidImageError) {
      throw new Error("Gorsel islenemedi. Net bir arac fotografi yukleyip tekrar deneyin.")
    }

    if (isQuotaError) {
      throw new Error("Gemini kotasi dolu veya aktif degil. API planinizi ve faturalandirmayi kontrol edin.")
    }

    throw new Error(`Gemini istegi basarisiz: ${errorText}`)
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string
        }>
      }
    }>
  }

  const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!generatedText) {
    throw new Error("Gemini yanitinda analiz metni bulunamadi")
  }

  return parseVehicleAnalysis(generatedText)
}
