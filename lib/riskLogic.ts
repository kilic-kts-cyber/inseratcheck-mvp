// lib/riskLogic.ts
// ─────────────────────────────────────────────────────────────────────────────
// Regelbasierte Risikobewertung – Score 0–10 → Niedrig / Erhöht / Hoch
// 3–7 Hinweise · 5–8 Verhandlungsfragen
// ─────────────────────────────────────────────────────────────────────────────

export type RiskLevel = 'Niedrig' | 'Erhöht' | 'Hoch';

export interface FormData {
  advertLink:         string;
  brand:              string;
  model:              string;
  year:               string;
  price:              string;
  mileage:            string;
  sellerType:         'privat' | 'haendler' | '';
  firstRegistration:  'de' | 'eu' | 'non-eu' | 'unklar' | '';
  serviceHistory:     'ja' | 'nein' | 'unklar' | '';
  lastServiceEntry:   string;
  lastServiceWork:    string;
  accidentFree:       'ja' | 'nein' | 'unklar' | '';
  repaintsDocumented: 'ja' | 'nein' | 'unklar' | '';
  huValidUntil:       string;
  ownershipDuration:  '<3' | '3-12' | '1plus' | 'unklar' | '';
}

export interface RiskResult {
  score:     number;
  level:     RiskLevel;
  hints:     string[];
  questions: string[];
}

// ─── Basis-Fragen ─────────────────────────────────────────────

const BASE_QUESTIONS: string[] = [
 'Können Sie mir die FIN bzw. VIN mitteilen?',
'Wann wurde der letzte größere Service durchgeführt?',
'Wurde der Zahnriemen oder – falls vorhanden – die Steuerkette geprüft bzw. erneuert?',
'Ist das Fahrzeug unfallfrei?',
'Welche gesetzliche Gewährleistung oder Händlergarantie wird gewährt?',
];

// ─── Hauptfunktion ─────────────────────────────────────────────

export function calculateRisk(data: FormData): RiskResult {
  let score = 0;
  const hints: string[] = [];
  const questions: string[] = [...BASE_QUESTIONS];

  // Besitzdauer (nur Privat)
  if (data.sellerType === 'privat') {
    if (data.ownershipDuration === '<3') {
      score += 2;
      hints.push(
        'Sehr kurze Besitzdauer (< 3 Monate): mögliches Weiterverkaufsrisiko.'
      );
      questions.push('Warum wird das Fahrzeug nach so kurzer Besitzdauer verkauft?');
    } else if (data.ownershipDuration === 'unklar') {
      score += 1;
      hints.push('Besitzdauer unklar – bitte nachfragen.');
      questions.push('Wie lange besitzen Sie das Fahrzeug bereits?');
    }
  }

  // Unfallstatus
  if (data.accidentFree === 'nein') {
    score += 2;
    hints.push('Unfall bekannt – Reparaturnachweise und Gutachten prüfen.');
    questions.push(
      'Welche Teile wurden instand gesetzt und liegt ein Gutachten vor?'
    );
  } else if (data.accidentFree === 'unklar') {
  score += 1;
  hints.push('Unfallfreiheit nicht eindeutig – Lackprüfung empfohlen.');
}
    );
  }

  // Servicehistorie
  if (data.serviceHistory === 'nein') {
    score += 2;
    hints.push('Kein Scheckheft – Wartungshistorie nicht nachvollziehbar.');
    questions.push(
      'Gibt es Rechnungen oder andere Wartungsnachweise?'
    );
  } else if (data.serviceHistory === 'unklar') {
    score += 1;
    hints.push('Servicehistorie unklar – bitte prüfen.');
  }

  // HU / TÜV
  const huDate = parseHuDate(data.huValidUntil);
  if (!huDate) {
    score += 1;
    hints.push('HU-Datum unklar – Ablaufdatum prüfen.');
    questions.push('Wann läuft die aktuelle Hauptuntersuchung ab?');
  } else {
    const mLeft = monthsUntil(huDate);
    if (mLeft <= 0) {
      score += 2;
      hints.push(
        `HU abgelaufen (${fmtDate(huDate)}) – neue HU erforderlich.`
      );
      questions.push(
        'Wann wird die HU erneuert und wer trägt die Kosten?'
      );
    } else if (mLeft <= 3) {
      score += 1;
      hints.push(
        `HU läuft bald ab (${fmtDate(huDate)}).`
      );
    }
  }

  // Erstauslieferung
  if (data.firstRegistration === 'non-eu') {
    score += 2;
    hints.push('Nicht-EU-Import – erhöhte Prüfpflicht.');
    questions.push(
      'Liegt vollständige Importdokumentation vor?'
    );
  } else if (data.firstRegistration === 'eu') {
    score += 1;
    hints.push('EU-Reimport – Serviceunterlagen prüfen.');
  } else if (data.firstRegistration === 'unklar') {
    score += 1;
    hints.push('Erstauslieferungsland unklar.');
  }

  // Nachlackierungen
  if (data.repaintsDocumented === 'nein') {
    score += 1;
    hints.push('Nachlackierungen nicht dokumentiert – prüfen.');
  } else if (data.repaintsDocumented === 'unklar') {
    score += 1;
    hints.push('Nachlackierungsstatus unklar.');
  }

  // Preis-Heuristik
  const yr = parseInt(data.year, 10);
  const pr = parseNum(data.price);
  const km = parseNum(data.mileage);

  if (!isNaN(yr) && !isNaN(pr) && !isNaN(km)) {
    const age = new Date().getFullYear() - yr;
    const minExpected = Math.max(1500, 18000 - age * 1200 - km * 0.04);
    if (pr < minExpected * 0.68) {
      score += 1;
      hints.push(
        `Preis auffällig niedrig (${pr.toLocaleString('de-DE')} €).`
      );
      questions.push(
        'Warum liegt der Preis deutlich unter dem Marktniveau?'
      );
    }
  }

  // Händler-spezifisch
  if (data.sellerType === 'haendler') {
    questions.push(
      'Welche gesetzliche Gewährleistung wird gewährt?'
    );
  }

  // Score → Level
  const level: RiskLevel =
    score <= 2 ? 'Niedrig' :
    score <= 5 ? 'Erhöht'  :
    'Hoch';

  // Mindest-Hinweise
  const fallbackHints = [
    'Dokumente vor Ort sorgfältig prüfen.',
    'Unabhängige Werkstattprüfung empfohlen.',
  ];

  while (hints.length < 3 && fallbackHints.length > 0) {
    hints.push(fallbackHints.shift()!);
  }

  // Mindest-Fragen
  const fallbackQs = [
    'Liegt eine vollständige Schadenshistorie vor?',
    'Wurden alle Wartungsintervalle eingehalten?',
    'Ist eine Probefahrt möglich?',
  ];

  while (questions.length < 5 && fallbackQs.length > 0) {
    const q = fallbackQs.shift()!;
    if (!questions.includes(q)) questions.push(q);
  }

  return {
    score: Math.min(score, 10),
    level,
    hints: Array.from(new Set(hints)).slice(0, 7),
    questions: Array.from(new Set(questions)).slice(0, 8),
  };
}

// ─── Hilfsfunktionen ──────────────────────────────────────────

function parseHuDate(val: string): Date | null {
  if (!val || /unklar/i.test(val)) return null;

  const m1 = val.match(/^(\d{1,2})[./](\d{4})$/);
  if (m1) return new Date(+m1[2], +m1[1] - 1, 1);

  const m2 = val.match(/^(\d{4})-(\d{1,2})$/);
  if (m2) return new Date(+m2[1], +m2[2] - 1, 1);

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
  return parseFloat(s.replace(/[^\d.]/g, ''));
}
