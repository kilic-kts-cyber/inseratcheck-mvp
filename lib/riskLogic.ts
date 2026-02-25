export type RiskLevel = 'Niedrig' | 'Mittel' | 'Hoch'

export type FormData = {
  advertLink: string
  price: string
  mileage: string
  description: string
}

export function calculateRisk(data: FormData) {
  let score = 0

  const text = data.description.toLowerCase()

  if (text.includes('unfall')) score += 30
  if (text.includes('motorschaden')) score += 40
  if (text.includes('ölverlust')) score += 20
  if (text.includes('klackern')) score += 20
  if (text.includes('keine garantie')) score += 10

  let level: RiskLevel = 'Niedrig'

  if (score >= 40) level = 'Hoch'
  else if (score >= 20) level = 'Mittel'

  return {
    score,
    level
  }
}
