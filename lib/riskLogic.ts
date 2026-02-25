export type FormData = {
  age?: number;
  systolic?: number;
  cholesterol?: number;
  smoker?: boolean;
  diabetic?: boolean;
  [key: string]: unknown;
};

export type RiskLevel = 'low' | 'medium' | 'high';

export type RiskResult = {
  score: number;
  level: RiskLevel;
};

export function calculateRisk(input: FormData): RiskResult {
  let score = 0;

  if (typeof input.age === 'number' && !Number.isNaN(input.age)) {
    score += Math.min(40, Math.max(0, (input.age - 20) * 0.8));
  }

  if (typeof input.systolic === 'number' && !Number.isNaN(input.systolic)) {
    score += Math.min(30, Math.max(0, (input.systolic - 110) * 0.5));
  }

  if (typeof input.cholesterol === 'number' && !Number.isNaN(input.cholesterol)) {
    score += Math.min(20, Math.max(0, (input.cholesterol - 150) * 0.1));
  }

  if (input.smoker) score += 15;
  if (input.diabetic) score += 20;

  score = Math.round(Math.max(0, Math.min(100, score)));

  const level: RiskLevel =
    score >= 60 ? 'high' : score >= 30 ? 'medium' : 'low';

  return { score, level };
}

export default calculateRisk;
