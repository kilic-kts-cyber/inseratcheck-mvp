// lib/riskLogic.ts

export type RiskLevel = 'Niedrig' | 'Erhöht' | 'Hoch';

export interface FormData {
  advertLink: string;
  advertText?: string;
  brand: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  sellerType: 'privat' | 'haendler' | '';
  firstRegistration: 'de' | 'eu' | 'non-eu' | 'unklar' | '';
  serviceHistory: 'ja' | 'nein' | 'unklar' | '';
  lastServiceEntry: string;
  lastServiceWork: string;
  accidentFree: 'ja' | 'nein' | 'unklar' | '';
  repaintsDocumented: 'ja' | 'nein' | 'unklar' | '';
  huValidUntil: string;
  ownershipDuration: '<3' | '3-12' | '1plus' | 'unklar' | '';
}

export interface RiskResult {
  score: number;
  level: RiskLevel;
  hints: string[];
  questions: string[];
}

const BASE_QUESTIONS = [
  'Können Sie mir bitte die FIN/VIN mitteilen?',
  'Wann wurde der letzte größere Service durchgeführt?',
  'Wurde Zahnriemen oder Steuerkette erneuert?',
  'Ist das Fahrzeug unfallfrei?',
];

export function calculateRisk(data: FormData): RiskResult {

  let score = 0;
  const hints: string[] = [];
  const questions: string[] = [...BASE_QUESTIONS];

  const km = parseNum(data.mileage);

  // 🔴 EXTREME KILOMETER
  if (km > 400000) {
    score += 40;
    hints.push('Extrem hohe Laufleistung – wirtschaftliches Risiko sehr hoch.');
  }

  if (km > 1000000) {
    score = 100;
    hints.push('Kilometerstand unrealistisch hoch – möglicher Eingabefehler oder Manipulation.');
  }

  // 🔥 KONKRETE FREITEXT-ANALYSE
  if (data.advertText) {

    const text = data.advertText.toLowerCase();

    if (text.includes('springt nicht an')) {
      score += 50;
      hints.push('Motorproblem erwähnt („springt nicht an“). Fahrzeug aktuell nicht fahrbereit.');
      questions.push('Warum springt das Fahrzeug nicht an und welche Diagnose liegt vor?');
    }

    if (text.includes('ausgegangen')) {
      score += 30;
      hints.push('Motor während der Fahrt ausgegangen – möglicher schwerer Defekt.');
    }

    if (text.includes('motorschaden')) {
      score += 60;
      hints.push('Motorschaden im Inserat erwähnt.');
      questions.push('Liegt ein Kostenvoranschlag oder Gutachten zum Motorschaden vor?');
    }

    if (text.includes('getriebeschaden')) {
      score += 60;
      hints.push('Getriebeschaden im Inserat erwähnt.');
    }

    if (text.includes('bastlerfahrzeug')) {
      score += 30;
      hints.push('Fahrzeug als Bastlerfahrzeug deklariert.');
    }

    if (text.includes('nur export')) {
      score += 20;
      hints.push('Nur Exportverkauf – Gewährleistung evtl. ausgeschlossen.');
    }
  }

  score = Math.min(score, 100);

  const level: RiskLevel =
    score < 25 ? 'Niedrig' :
    score < 60 ? 'Erhöht' :
    'Hoch';

  if (hints.length === 0) {
    hints.push('Keine besonderen Auffälligkeiten erkannt.');
  }

  return {
    score,
    level,
    hints,
    questions,
  };
}

function parseNum(s: string): number {
  return parseFloat((s || '').replace(/[^\d.]/g, ''));
}
