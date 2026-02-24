// lib/pdf.ts
// Client-seitiger PDF-Export via jsPDF – kein Backend, kein Upload.

import type { FormData, RiskResult } from './riskLogic';

function generateAnalysisId(advertLink?: string): string {
  const today = new Date();
  const dateStr =
    today.getFullYear().toString() +
    String(today.getMonth() + 1).padStart(2, '0') +
    String(today.getDate()).padStart(2, '0');

  const match = advertLink?.match(/id=(\d+)/);
  const mobileId = match ? match[1] : Math.random().toString(36).substring(2, 8).toUpperCase();
  return `IC-${dateStr}-${mobileId}`;
}

export async function generatePDF(
  data: FormData,
  result: RiskResult,
  email?: string,
): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const ML = 18, MR = 18, PW = 210;
  const CW = PW - ML - MR;
  let y = ML;

  const analysisId = generateAnalysisId(data.advertLink);

  function rgb(hex: string): [number, number, number] {
    const h = hex.replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }

  const tc = (hex: string) => doc.setTextColor(...rgb(hex));
  const fc = (hex: string) => doc.setFillColor(...rgb(hex));
  const dc = (hex: string) => doc.setDrawColor(...rgb(hex));

  function wrapped(text: string, size: number, color: string, indent = 0) {
    doc.setFontSize(size);
    doc.setFont('helvetica', 'normal');
    tc(color);
    const lines = doc.splitTextToSize(text, CW - indent);
    doc.text(lines, ML + indent, y);
    y += lines.length * (size * 0.44 + 0.6) + 0.5;
  }

  function sectionHead(title: string) {
    y += 3;
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    tc('#9ca3af');
    doc.text(title.toUpperCase(), ML, y);
    y += 4;
    dc('#e5e7eb'); doc.setLineWidth(0.25);
    doc.line(ML, y, PW - MR, y);
    y += 5;
  }

  function roundedBox(bx: number, by: number, bw: number, bh: number, fillHex: string, strokeHex: string) {
    fc(fillHex); dc(strokeHex);
    doc.setLineWidth(0.4);
    doc.roundedRect(bx, by, bw, bh, 2.5, 2.5, 'FD');
  }

  // ── Header ────────────────────────────────────────────────
  fc('#174d37'); doc.rect(0, 0, PW, 32, 'F');

  doc.setFontSize(17); doc.setFont('helvetica', 'bold'); tc('#ffffff');
  doc.text('InseratCheck', ML, 12);

  doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); tc('#84ccab');
  doc.text('Kostenlose Risikoanalyse', ML, 20);

  const dateStr = new Date().toLocaleDateString('de-DE');
  doc.setFontSize(8); tc('#84ccab');
  doc.text(dateStr, PW - MR - doc.getTextWidth(dateStr), 20);

  doc.setFontSize(8); tc('#84ccab');
  doc.text(`Analyse-ID: ${analysisId}`, ML, 26);

  y = 40;

  // ── Fahrzeugdaten ─────────────────────────────────────────
  sectionHead('Fahrzeugdaten');
  const vehicle = [data.brand, data.model, data.year].filter(Boolean).join(' ');
  if (vehicle) {
    doc.setFontSize(15); doc.setFont('helvetica', 'bold'); tc('#111827');
    doc.text(vehicle, ML, y); y += 9;
  }

  const meta: string[] = [];
  if (data.price) meta.push(`Preis: ${parseFloat(data.price).toLocaleString('de-DE')} €`);
  if (data.mileage) meta.push(`KM-Stand: ${parseFloat(data.mileage).toLocaleString('de-DE')} km`);
  if (data.sellerType) meta.push(`Verkäufer: ${data.sellerType === 'privat' ? 'Privat' : 'Händler'}`);
  if (meta.length) wrapped(meta.join('   ·   '), 9, '#6b7280');
  if (data.advertLink) wrapped(data.advertLink, 7.5, '#9ca3af');
  y += 4;

  // ── Risikoklasse ──────────────────────────────────────────
  sectionHead('Risikoklasse');

  const [bgHex, bdHex, txHex] =
    result.level === 'Niedrig' ? ['#f0fdf4', '#bbf7d0', '#166534'] :
    result.level === 'Erhöht'  ? ['#fffbeb', '#fde68a', '#92400e'] :
                                 ['#fef2f2', '#fecaca', '#991b1b'];

  roundedBox(ML, y, CW, 24, bgHex, bdHex);

  doc.setFontSize(15); doc.setFont('helvetica', 'bold'); tc(txHex);
  doc.text(result.level, ML + 6, y + 10);

  doc.setFontSize(9); doc.setFont('helvetica', 'normal'); tc('#6b7280');
  doc.text(`Risikoscore: ${result.score} / 100`, ML + 6, y + 17);

  // Score-Balken (0–100) + Farben
  const barX = ML + 52, barW = CW - 58;
  fc('#e5e7eb'); doc.rect(barX, y + 14, barW, 3, 'F');

  const barColor =
    result.score < 30 ? '#16a34a' :   // grün
    result.score < 50 ? '#d97706' :   // orange
                        '#dc2626';    // rot

  fc(barColor);
  doc.rect(barX, y + 14, barW * Math.min(1, result.score / 100), 3, 'F');

  y += 32;

  // ── Hinweise ──────────────────────────────────────────────
  sectionHead('Befunde & Hinweise');
  result.hints.forEach((hint, i) => {
    wrapped(`${i + 1}. ${hint}`, 9, '#374151');
    y += 2;
  });

  y += 2;

  // ── Fragen ────────────────────────────────────────────────
  sectionHead('Ihre Verhandlungsfragen');
  result.questions.forEach((q) => {
    wrapped(`› „${q}"`, 9, '#374151');
    y += 2;
  });

  y += 6;

  // ── Footer ────────────────────────────────────────────────
  roundedBox(ML, y, CW, email ? 30 : 24, '#f9fafb', '#e5e7eb');
  y += 5;

  wrapped(
    'Ein Online-Inserat-Check dient der Vorbereitung und ersetzt keine technische Begutachtung vor Ort. Für maximale Sicherheit empfehlen wir eine unabhängige Werkstattprüfung vor dem Kauf.',
    8,
    '#6b7280',
  );

  if (email) {
    y += 2;
    wrapped(`PDF-Kopie angefordert für: ${email}`, 7.5, '#9ca3af');
  }

  doc.save('inserat-check-analyse.pdf');
}
