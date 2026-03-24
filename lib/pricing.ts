import type { PriceEstimation, VehicleAnalysis } from "@/types/vehicle"

const getYearMultiplier = (year: number | null) => {
  if (!year) {
    return 1
  }

  if (year >= 2022) {
    return 1.32
  }

  if (year >= 2018) {
    return 1.18
  }

  if (year >= 2014) {
    return 1.05
  }

  if (year >= 2010) {
    return 0.88
  }

  return 0.74
}

const getConditionMultiplier = (conditionSummary: string) => {
  const normalizedText = conditionSummary.toLowerCase()

  if (normalizedText.includes("cok iyi") || normalizedText.includes("excellent")) {
    return 1.15
  }

  if (normalizedText.includes("iyi") || normalizedText.includes("good")) {
    return 1.05
  }

  if (normalizedText.includes("orta") || normalizedText.includes("average")) {
    return 0.95
  }

  return 0.85
}

const getBrandBasePrice = (brand: string) => {
  const normalizedBrand = brand.toLowerCase()

  if (["bmw", "mercedes-benz", "audi", "lexus"].includes(normalizedBrand)) {
    return 1700000
  }

  if (["volkswagen", "toyota", "honda", "ford", "nissan", "hyundai"].includes(normalizedBrand)) {
    return 1100000
  }

  if (["fiat", "renault", "dacia", "opel", "peugeot", "citroen"].includes(normalizedBrand)) {
    return 820000
  }

  return 920000
}

export const estimatePriceRange = (vehicle: VehicleAnalysis): PriceEstimation => {
  const basePrice = getBrandBasePrice(vehicle.brand)
  const yearMultiplier = getYearMultiplier(vehicle.year)
  const conditionMultiplier = getConditionMultiplier(vehicle.conditionSummary)
  const centerPrice = basePrice * yearMultiplier * conditionMultiplier
  const rangeMargin = centerPrice * 0.13

  return {
    minPrice: Math.round(centerPrice - rangeMargin),
    maxPrice: Math.round(centerPrice + rangeMargin),
    confidenceNote:
      "Bu fiyat araligi fotograf tabanli tahmindir. Kesin degerleme icin ekspertiz ve kilometre bilgisi gereklidir."
  }
}
