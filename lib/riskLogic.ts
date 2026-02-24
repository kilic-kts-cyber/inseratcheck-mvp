// lib/riskLogic.ts
// Regelbasierte Risikobewertung – Score 0–100

export type RiskLevel = 'Niedrig' | 'Erhöht' | 'Hoch';

export interface FormData {
  advertLink: string;
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

// ─────────────────────────────────────────────
// Basisfragen (immer)
// ─────────────────────────────────────────────

const BASE_QUESTIONS: string[] = [
  'Können Sie mir die FIN bzw. VIN mitteilen?',
  'Wann wurde der letzte größere Service durchgeführt?',
  'Wurde der Zahnriemen oder – falls vorhanden – die Steuerkette geprüft bzw. erneuert?',
  'Ist das Fahrzeug unfallfrei?',
];

// ─────────────────────────────────────────────
// Hauptfunktion
// ─────────────────────────────────────────────

export function calculateRisk(data: FormData): RiskResult {
  let score = 0;
  const hints: string[] = [];
  const questions: string[] = [...BASE_QUESTIONS];

  // Händler-Gewährleistung nur bei Händler
  if (data.sellerType === 'haendler') {
    questions.push(
      'Welche gesetzliche Gewährleistung oder Händlergarantie wird gewährt?'
    );
  }

  // Besitzdauer (Privat)
  if (data.sellerType === 'privat') {
    if (data.ownershipDuration === '<3') {
      score += 10;
      hints.push('Sehr kurze Besitzdauer – mögliches Weiterverkaufsrisiko.');
      questions.push('Warum wird das Fahrzeug nach so kurzer Besitzdauer verkauft?');
    }
    if (data.ownershipDuration === 'unklar') {
      score += 5;
      hints.push('Besitzdauer unklar – bitte nachfragen.');
      questions.push('Wie lange besitzen Sie das Fahrzeug bereits?');
    }
  }

  // Unfall
  if (data.accidentFree === 'nein') {
    score += 20;
    hints.push('Unfall bekannt – Reparaturnachweise und Gutachten prüfen.');
    questions.push('Welche Teile wurden instand gesetzt und liegt ein Gutachten vor?');
  }

  if (data.accidentFree === 'unklar') {
    score += 8;
    hints.push('Unfallfreiheit nicht eindeutig – Lackprüfung empfohlen.');
  }

  // Service
  if (data.serviceHistory === 'nein') {
    score += 15;
    hints.push('Keine Servicehistorie – Wartung nicht nachvollziehbar.');
    questions.push('Gibt es Rechnungen oder Wartungsnachweise?');
  }

  if (data.serviceHistory === 'unklar') {
    score += 8;
    hints.push('Servicehistorie unklar – bitte prüfen.');
  }

  // HU
  const huDate = parseHuDate(data.huValidUntil);
  if (!huDate) {
    score += 5;
    hints.push('HU-Datum unklar – Ablaufdatum prüfen.');
    questions.push('Wann läuft die aktuelle Hauptuntersuchung ab?');
  } else {
    const mLeft = monthsUntil(huDate);
    if (mLeft <= 0) {
      score += 20;
      hints.push(`HU abgelaufen (${fmtDate(huDate)}) – neue HU erforderlich.`);
      questions.push('Wann wird die HU erneuert und wer trägt die Kosten?');
    } else if (mLeft <= 3) {
      score += 8;
      hints.push(`HU läuft bald ab (${fmtDate(huDate)}).`);
    }
  }

  // Import
  if (data.firstRegistration === 'non-eu') {
    score += 20;
    hints.push('Nicht-EU-Import – erhöhte Prüfpflicht.');
    questions.push('Liegt vollständige Importdokumentation vor?');
  }

  if (data.firstRegistration === 'unklar') {
    score += 5;
    hints.push('Erstauslieferungsland unklar.');
  }

  // Nachlackierung
  if (data.repaintsDocumented === 'nein') {
    score += 5;
    hints.push('Nachlackierungen nicht dokumentiert.');
  }

  if (data.repaintsDocumented === 'unklar') {
    score += 5;
    hints.push('Nachlackierungsstatus unklar.');
  }

  // Preisbewertung
  const yr = parseInt(data.year, 10);
  const pr = parseNum(data.price);
  const km = parseNum(data.mileage);

  if (!isNaN(yr) && !isNaN(pr) && !isNaN(km)) {
    const age = new Date().getFullYear() - yr;
    const minExpected = Math.max(2000, 20000 - age * 1500 - km * 0.05);
    if (pr < minExpected * 0.7) {
      score += 15;
      hints.push('Preis auffällig niedrig – mögliche versteckte Mängel.');
      questions.push('Warum liegt der Preis deutlich unter dem Marktniveau?');
    }
  }

  // Score begrenzen
  score = Math.min(score, 100);

  const level: RiskLevel =
    score < 25 ? 'Niedrig' :
    score < 60 ? 'Erhöht' :
    'Hoch';

  // Mindesthinweise
  if (hints.length < 2) {
    hints.push('Dokumente vor Ort sorgfältig prüfen.');
  }

  return {
    score,
    level,
    hints: Array.from(new Set(hints)),
    questions: Array.from(new Set(questions)),
  };
}

// ─────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────

function parseHuDate(val: string): Date | null {
  if (!val || /unklar/i.test(val)) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

function monthsUntil(d: Date): number {
  const now = new Date();
  return (
    (d.getFullYear() - now.getFullYear()) * 12 +
    (d.getMonth() - now.getMonth())
  );
}

function fmtDate(d: Date): string {
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function parseNum(s: string): number {
  return parseFloat((s || '').replace(/[^\d.]/g, ''));
}
