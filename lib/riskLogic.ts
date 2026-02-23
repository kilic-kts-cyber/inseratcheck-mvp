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
  hints:     string[];   // 3–7
  questions: string[];   // 5–8
}

// ─── Basis-Fragen (immer enthalten) ──────────────────────────
const BASE_QUESTIONS: string[] = [
  'Könnten Sie mir die vollständige FIN / VIN mitteilen?',
  'Wann wurde der letzte größere Service durchgeführt?',
  'Wie ist die Gewährleistung geregelt?',
  'Wurde der Zahnriemen geprüft oder ersetzt?',
];

// ─── Haupt-Funktion ───────────────────────────────────────────
export function calculateRisk(data: FormData): RiskResult {
  let score = 0;
  const hints:     string[] = [];
  const questions: string[] = [...BASE_QUESTIONS];

  // 1. Besitzdauer (nur Privat)
  if (data.sellerType === 'privat') {
    if (data.ownershipDuration === '<3') {
      score += 2;
      hints.push(
        'Sehr kurze Besitzdauer (< 3 Monate): erhöhtes Risiko eines Weiterverkaufs ' +
        'mit unbekannter Vorgeschichte oder versteckten Mängeln.',
      );
      questions.push('Warum wird das Fahrzeug nach so kurzer Besitzdauer verkauft?');
    } else if (data.ownershipDuration === 'unklar') {
      score += 1;
      hints.push('Besitzdauer unklar – bitte direkt beim Verkäufer nachfragen.');
      questions.push('Wie lange besitzen Sie das Fahrzeug bereits?');
    }
  }

  // 2. Unfallfrei
  if (data.accidentFree === 'nein') {
    score += 2;
    hints.push(
      'Unfall bekannt: Vorschäden können Fahrzeugsicherheit und Wiederverkaufswert ' +
      'erheblich mindern. Gutachten und Reparaturnachweise anfordern.',
    );
    questions.push(
      'Welche Teile wurden nach dem Unfall instand gesetzt, und liegt ein Schadensgutachten vor?',
    );
  } else if (data.accidentFree === 'unklar') {
    score += 1;
    hints.push(
      'Unfallfreiheit im Inserat nicht eindeutig angegeben – eine Lackschichtenmessung ' +
      'vor Ort ist dringend empfehlenswert.',
    );
    questions.push(
      'Ist das Fahrzeug nach Ihren Kenntnissen unfallfrei? Liegt eine Schadenshistorie vor?',
    );
  }

  // 3. Service / Scheckheft
  if (data.serviceHistory === 'nein') {
    score += 2;
    hints.push(
      'Kein Scheckheft vorhanden: Wartungshistorie nicht nachvollziehbar – ' +
      'erhöhtes Risiko für ungepflegten Verschleiß.',
    );
    questions.push(
      'Gibt es alternativ Rechnungen oder Belege zu bisherigen Wartungsarbeiten?',
    );
  } else if (data.serviceHistory === 'unklar') {
    score += 1;
    hints.push(
      'Serviceheft-Status unklar: Bitte direkt nachfragen und das Heft vor Ort einsehen.',
    );
  }

  // 4. HU / TÜV
  const huDate = parseHuDate(data.huValidUntil);
  if (!huDate) {
    score += 1;
    hints.push(
      'HU-Datum unklar oder nicht angegeben: Bei baldiger Fälligkeit entstehen ' +
      'zusätzliche Kosten – Ablaufdatum unbedingt erfragen.',
    );
    questions.push('Wann läuft die aktuelle Hauptuntersuchung ab, und war sie mängelfrei?');
  } else {
    const mLeft = monthsUntil(huDate);
    if (mLeft <= 0) {
      score += 2;
      hints.push(
        `HU bereits abgelaufen (${fmtDate(huDate)}): Fahrzeug darf so nicht am Verkehr ` +
        'teilnehmen – neue HU ist Pflicht vor dem Kauf.',
      );
      questions.push(
        'Wann wird die abgelaufene Hauptuntersuchung erneuert, und wer trägt die Kosten?',
      );
    } else if (mLeft <= 3) {
      score += 1;
      hints.push(
        `HU läuft bald ab (${fmtDate(huDate)}): Rechnen Sie kurzfristig mit Kosten ` +
        'für eine neue Hauptuntersuchung.',
      );
      questions.push(
        'Ist die Hauptuntersuchung mängelfrei abgelaufen, und wird sie vor dem Kauf erneuert?',
      );
    }
  }

  // 5. Erstauslieferung
  if (data.firstRegistration === 'non-eu') {
    score += 2;
    hints.push(
      'Nicht-EU-Import: Ausstattung, Sicherheitsnormen und Schadenshistorie können ' +
      'stark abweichen – erheblich höherer Prüfaufwand nötig.',
    );
    questions.push(
      'In welchem Land wurde das Fahrzeug erstzugelassen, und liegt vollständige Importdokumentation vor?',
    );
  } else if (data.firstRegistration === 'eu') {
    score += 1;
    hints.push(
      'EU-Reimport: Serviceheft und Ausstattung können von deutschen Fahrzeugen abweichen – ' +
      'Fahrzeugbrief und COC-Dokument prüfen.',
    );
    questions.push('Liegt die vollständige Servicehistorie aus dem Erstzulassungsland vor?');
  } else if (data.firstRegistration === 'unklar') {
    score += 1;
    hints.push(
      'Erstauslieferungsland unklar: Bitte Fahrzeugbrief und COC-Dokument einsehen.',
    );
  }

  // 6. Nachlackierungen
  if (data.repaintsDocumented === 'nein') {
    score += 1;
    hints.push(
      'Nachlackierungen nicht dokumentiert: Können auf Vorschäden hinweisen – ' +
      'Lackschichtenmessung empfohlen.',
    );
    questions.push('Wurden Nachlackierungen durchgeführt, und wenn ja, aus welchem Grund?');
  } else if (data.repaintsDocumented === 'unklar') {
    score += 1;
    hints.push(
      'Nachlackierungs-Status unklar: Eine professionelle Sichtprüfung kann ' +
      'verborgene Vorschäden aufdecken.',
    );
  }

  // 7. Preis-Heuristik
  const yr = parseInt(data.year, 10);
  const pr = parseNum(data.price);
  const km = parseNum(data.mileage);
  if (!isNaN(yr) && !isNaN(pr) && !isNaN(km)) {
    const age = new Date().getFullYear() - yr;
    const minExpected = Math.max(1500, 18000 - age * 1200 - km * 0.04);
    if (pr < minExpected * 0.68) {
      score += 1;
      hints.push(
        `Preis auffällig niedrig (${pr.toLocaleString('de-DE')} €): ` +
        'Deutliche Abweichung vom erwarteten Marktniveau – mögliche versteckte Mängel.',
      );
      questions.push('Warum liegt der Preis so deutlich unter dem Marktdurchschnitt?');
    }
  }

  // 8. Händler-spezifisch
  if (data.sellerType === 'haendler') {
    questions.push(
      'Welche gesetzliche Gewährleistung wird gewährt, und gibt es eine Händlergarantie?',
    );
  }

  // Score → Level
  const level: RiskLevel =
    score <= 2 ? 'Niedrig' :
    score <= 5 ? 'Erhöht'  : 'Hoch';

  // Abschluss-Hinweise
  if (level === 'Niedrig') {
    if (hints.length === 0)
      hints.push('Keine offensichtlichen Risikosignale – Basisprüfung ohne auffällige Befunde.');
    hints.push('Eine unabhängige Werkstattprüfung ist dennoch immer empfehlenswert.');
  } else if (level === 'Erhöht') {
    hints.push(
      'Mehrere Punkte sollten vor dem Kauf geklärt werden – ' +
      'eine unabhängige Werkstattprüfung ist ausdrücklich ratsam.',
    );
  } else {
    hints.push(
      'Erhebliche Risikosignale – kaufen Sie dieses Fahrzeug nur nach einer ' +
      'professionellen Werkstattprüfung durch einen unabhängigen Sachverständigen.',
    );
  }

  // Mindestens 3 Hinweise, max 7
  const fallbackHints = [
    'Lassen Sie alle relevanten Dokumente (Fahrzeugbrief, Scheckheft, COC) vor Ort prüfen.',
    'Vereinbaren Sie eine ausführliche Probefahrt unter realen Bedingungen.',
  ];
  while (hints.length < 3) {
    const h = fallbackHints.shift();
    if (!h) break;
    hints.push(h);
  }

  // Mindestens 5 Fragen, max 8
  const fallbackQs = [
    'Liegt eine lückenlose Schadenshistorie vor?',
    'Wurden alle fälligen Wartungsarbeiten laut Herstellerplan durchgeführt?',
    'Kann ich eine Probefahrt unter realen Bedingungen durchführen?',
  ];
  while (questions.length < 5) {
    const q = fallbackQs.shift();
    if (!q) break;
    if (!questions.includes(q)) questions.push(q);
  }

  return {
    score:     Math.min(score, 10),
    level,
    hints:     [...new Set(hints)].slice(0, 7),
    questions: [...new Set(questions)].slice(0, 8),
  };
}

// ─── Hilfsfunktionen ──────────────────────────────────────────

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
  return parseFloat(s.replace(/[^\d.]/g, ''));
}
