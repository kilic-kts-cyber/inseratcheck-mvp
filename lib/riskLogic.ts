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
  sellerType: string;
  firstRegistration: string;
  serviceHistory: string;
  lastServiceEntry: string;
  lastServiceWork: string;
  accidentFree: string;
  repaintsDocumented: string;
  huValidUntil: string;
  ownershipDuration: string;
}

export interface RiskResult {
  score: number;
  level: RiskLevel;
  hints: string[];
  questions: string[];
}

export function calculateRisk(data: FormData): RiskResult {

  let score = 0;
  const hints: string[] = [];

  const questions: string[] = [
    'Können Sie mir bitte die FIN/VIN mitteilen, damit ich mir das Fahrzeugdatenblatt ziehen kann?',
    'Wie viele Vorbesitzer hatte das Fahrzeug?',
    'Ist das Fahrzeug vollständig scheckheftgepflegt?',
    'Wann wurde der letzte größere Service durchgeführt (Datum, Kilometerstand und Umfang)?',
    'Wurde der Zahnriemen bzw. – falls vorhanden – die Steuerkette geprüft oder erneuert?',
    'Ist das Fahrzeug unfallfrei?',
    'Gibt es ein aktuelles Werkstatt- oder Zustandsprotokoll?',
  ];

  const text = (data.advertText || '').toLowerCase();

  // 🔴 KRITISCHE MOTOR-TRIGGER
  const hasNotStarting = text.includes('springt nicht an');
  const hasEngineStopped = text.includes('ausgegangen');
  const hasEngineDamage = text.includes('motorschaden');

  if (hasNotStarting) {
    score = 80; // sofort hoch
    hints.push('Motorproblem erwähnt („springt nicht an“). Fahrzeug nicht fahrbereit.');
    questions.push('Warum springt das Fahrzeug nicht an und welche Diagnose liegt vor?');
  }

  if (hasEngineStopped) {
    score = Math.max(score, 70);
    hints.push('Motor während der Fahrt ausgegangen – möglicher schwerer Defekt.');
  }

  if (hasEngineDamage) {
    score = 95;
    hints.push('Motorschaden im Inserat erwähnt.');
    questions.push('Liegt ein Kostenvoranschlag oder Gutachten zum Motorschaden vor?');
  }

  // 🔴 Extrem hohe Kilometer
  const km = parseNum(data.mileage);
  if (km > 1000000) {
    score = 100;
    hints.push('Kilometerstand unrealistisch hoch – möglicher Eingabefehler oder Manipulation.');
  }

  // Falls nichts gefunden
  if (score === 0) {
    hints.push('Keine besonderen Auffälligkeiten erkannt – technische Prüfung dennoch empfohlen.');
  }

  score = Math.min(score, 100);

  const level: RiskLevel =
    score < 25 ? 'Niedrig' :
    score < 60 ? 'Erhöht' :
    'Hoch';

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
