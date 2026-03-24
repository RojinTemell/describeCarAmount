export type VehicleAnalysis = {
  brand: string
  model: string
  year: number | null
  packageName: string | null
  conditionSummary: string
}

export type PriceEstimation = {
  minPrice: number
  maxPrice: number
  confidenceNote: string
}

export type AnalysisResult = {
  vehicle: VehicleAnalysis
  pricing: PriceEstimation
}
