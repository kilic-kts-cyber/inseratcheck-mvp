// lib/riskLogic.ts
// Regelbasierte Risikobewertung – Score 0–100

export type RiskLevel = 'Niedrig' | 'Erhöht' | 'Hoch';

export interface FormData {
  advertLink: string;
  advertText?: string;   // ← NEU (Freitextanalyse)
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
// Basisfragen
// ─────────────────────────────────────────────
const BASE_QUESTIONS: string[] = [
  'Können Sie mir bitte die FIN bzw. VIN mitteilen, damit ich das Fahrzeugdatenblatt prüfen kann?',
  'Wann wurde der letzte größere Service durchgeführt und welchen Umfang hatte er (Datum und Kilometerstand)?',
  'Wurde der Zahnriemen oder – falls vorhanden – die Steuerkette geprüft bzw. erneuert? Falls ja, wann?',
  'Ist das Fahrzeug unfallfrei?',
];

// ─────────────────────────────────────────────
// Hauptfunktion
// ─────────────────────────────────────────────
export function calculateRisk(data: FormData): RiskResult {

  let score = 0;
  const hints: string[] = [];
  const questions: string[] = [...BASE_QUESTIONS];

  // Händler
  if (data.sellerType === 'haendler') {
    questions.push('Welche gesetzliche Gewährleistung wird gewährt und besteht zusätzlich eine Händlergarantie?');
  }

  // Besitzdauer
  if (data.sellerType === 'privat') {
    if (data.ownershipDuration === '<3') {
      score += 10;
      hints.push('Besitzdauer sehr kurz – Verkaufsgrund klären.');
      questions.push('Warum wird das Fahrzeug nach so kurzer Besitzdauer verkauft?');
    } else if (data.ownershipDuration === 'unklar') {
      score += 5;
      hints.push('Besitzdauer nicht eindeutig – bitte nachfragen.');
    }
  }

  // Unfall
  if (data.accidentFree === 'nein') {
    score += 20;
    hints.push('Unfall dokumentiert – Reparaturumfang und Gutachten prüfen.');
    questions.push('Welche Teile wurden instand gesetzt und liegt ein Gutachten/Reparaturnachweis vor?');
  } else if (data.accidentFree === 'unklar') {
    score += 8;
    hints.push('Unfallstatus nicht eindeutig – unabhängige Prüfung empfohlen.');
  }

  // Service
  if (data.serviceHistory === 'nein') {
    score += 15;
    hints.push('Keine nachvollziehbare Servicehistorie – Wartungszustand nicht überprüfbar.');
    questions.push('Gibt es Rechnungen oder Wartungsnachweise?');
  } else if (data.serviceHistory === 'unklar') {
    score += 8;
    hints.push('Servicehistorie nicht eindeutig dokumentiert – Nachweise prüfen.');
  }

  // HU
  const huDate = parseHuDate(data.huValidUntil);
  if (!huDate) {
    score += 5;
    hints.push('HU-Datum nicht eindeutig – Ablaufdatum klären.');
    questions.push('Wann läuft die aktuelle Hauptuntersuchung ab?');
  } else {
    const mLeft = monthsUntil(huDate);
    if (mLeft <= 0) {
      score += 20;
      hints.push(`HU abgelaufen (${fmtDate(huDate)}) – Erneuerung vor Kauf klären.`);
      questions.push('Wann wird die HU erneuert und wer trägt die Kosten?');
    } else if (mLeft <= 3) {
      score += 8;
      hints.push(`HU läuft bald ab (${fmtDate(huDate)}).`);
    }
  }

  // Import
  if (data.firstRegistration === 'non-eu') {
    score += 20;
    hints.push('Nicht-EU-Import – Dokumentation und technische Spezifikationen prüfen.');
    questions.push('Liegt vollständige Importdokumentation vor?');
  } else if (data.firstRegistration === 'unklar') {
    score += 5;
    hints.push('Erstauslieferungsland nicht eindeutig dokumentiert.');
  }

  // Nachlackierung
  if (data.repaintsDocumented === 'nein') {
    score += 5;
    hints.push('Nachlackierungen nicht dokumentiert – mögliche Vorschäden prüfen.');
  } else if (data.repaintsDocumented === 'unklar') {
    score += 5;
    hints.push('Nachlackierungsstatus nicht eindeutig – Sichtprüfung empfohlen.');
  }

  // Preis-Heuristik
  const yr = parseInt(data.year, 10);
  const pr = parseNum(data.price);
  const km = parseNum(data.mileage);

  if (!isNaN(yr) && !isNaN(pr) && !isNaN(km)) {
    const age = new Date().getFullYear() - yr;
    const minExpected = Math.max(2000, 20000 - age * 1500 - km * 0.05);
    if (pr < minExpected * 0.7) {
      score += 15;
      hints.push('Preis deutlich unter dem erwartbaren Marktniveau – technische Prüfung ratsam.');
      questions.push('Wie erklären Sie den Preis im Vergleich zum Marktniveau?');
    }
  }

  // ─────────────────────────────────────────────
  // 🔥 FREITEXT-TRIGGER
  // ─────────────────────────────────────────────
  if (data.advertText) {
    const text = data.advertText.toLowerCase();

    const triggers = [
      { regex: /kundenauftrag/, score: 12, hint: 'Formulierung „im Kundenauftrag“ gefunden – Gewährleistung prüfen.' },
      { regex: /keine garantie|ohne garantie/, score: 10, hint: 'Hinweis auf fehlende Garantie im Inserat.' },
      { regex: /nur export|export/, score: 15, hint: 'Fahrzeug offenbar nur für Export vorgesehen.' },
      { regex: /bastlerfahrzeug/, score: 20, hint: 'Fahrzeug als Bastlerfahrzeug bezeichnet – hoher Reparaturbedarf möglich.' },
      { regex: /nur gewerbe/, score: 12, hint: 'Verkauf offenbar nur an Gewerbetreibende.' },
      { regex: /unfallfahrzeug/, score: 20, hint: 'Inserat weist Fahrzeug als Unfallfahrzeug aus.' },
    ];

    triggers.forEach(t => {
      if (t.regex.test(text)) {
        score += t.score;
        hints.push(t.hint);
      }
    });
  }

  // Score begrenzen
  score = Math.min(score, 100);

  const level: RiskLevel =
    score < 25 ? 'Niedrig' :
    score < 60 ? 'Erhöht' :
    'Hoch';

  if (hints.length === 0) {
    hints.push('Keine auffälligen Punkte erkannt – Dokumente und Probefahrt dennoch empfehlenswert.');
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
  const s = val.trim();

  const m1 = s.match(/^(\d{1,2})[./](\d{4})$/);
  if (m1) return new Date(+m1[2], +m1[1] - 1, 1);

  const m2 = s.match(/^(\d{4})-(\d{1,2})$/);
  if (m2) return new Date(+m2[1], +m2[2] - 1, 1);

  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function monthsUntil(d: Date): number {
  const now = new Date();
  return (d.getFullYear() - now.getFullYear()) * 12 + (d.getMonth() - now.getMonth());
}

function fmtDate(d: Date): string {
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function parseNum(s: string): number {
  return parseFloat((s || '').replace(/[^\d.]/g, ''));
}
