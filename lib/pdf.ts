// lib/pdf.ts
// Client-seitiger PDF-Export via jsPDF – kein Backend, kein Upload.

import type { FormData, RiskResult } from './riskLogic';

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

  // ── Helfer ────────────────────────────────────────────────
  function rgb(hex: string): [number, number, number] {
    const h = hex.replace('#', '');
    return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
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

  function roundedBox(
    bx: number, by: number, bw: number, bh: number,
    fillHex: string, strokeHex: string,
  ) {
    fc(fillHex); dc(strokeHex);
    doc.setLineWidth(0.4);
    doc.roundedRect(bx, by, bw, bh, 2.5, 2.5, 'FD');
  }

  // ── Header ────────────────────────────────────────────────
  fc('#174d37'); doc.rect(0, 0, PW, 28, 'F');

  doc.setFontSize(17); doc.setFont('helvetica', 'bold'); tc('#ffffff');
  doc.text('InseratCheck', ML, 11);

  doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); tc('#84ccab');
  doc.text('Kostenlose Risikoanalyse', ML, 19);

  const dateStr = new Date().toLocaleDateString('de-DE', { day:'2-digit', month:'2-digit', year:'numeric' });
  doc.setFontSize(8); tc('#84ccab');
  doc.text(dateStr, PW - MR - doc.getTextWidth(dateStr), 19);
  y = 36;

  // ── Fahrzeugdaten ─────────────────────────────────────────
  sectionHead('Fahrzeugdaten');
  const vehicle = [data.brand, data.model, data.year].filter(Boolean).join(' ');
  if (vehicle) {
    doc.setFontSize(15); doc.setFont('helvetica','bold'); tc('#111827');
    doc.text(vehicle, ML, y); y += 9;
  }
  const meta: string[] = [];
  if (data.price)      meta.push(`Preis: ${parseFloat(data.price).toLocaleString('de-DE')} €`);
  if (data.mileage)    meta.push(`KM-Stand: ${parseFloat(data.mileage).toLocaleString('de-DE')} km`);
  if (data.sellerType) meta.push(`Verkäufer: ${data.sellerType === 'privat' ? 'Privat' : 'Händler'}`);
  if (meta.length)  wrapped(meta.join('   ·   '), 9, '#6b7280');
  if (data.advertLink) wrapped(data.advertLink, 7.5, '#9ca3af');
  y += 2;

  // ── Risikoklasse ──────────────────────────────────────────
  sectionHead('Risikoklasse');
  const [bgHex, bdHex, txHex] =
    result.level === 'Niedrig' ? ['#f0fdf4','#bbf7d0','#166534'] :
    result.level === 'Erhöht'  ? ['#fffbeb','#fde68a','#92400e'] :
                                 ['#fef2f2','#fecaca','#991b1b'];

  roundedBox(ML, y, CW, 22, bgHex, bdHex);

  doc.setFontSize(15); doc.setFont('helvetica','bold'); tc(txHex);
  doc.text(result.level, ML + 6, y + 9);

  doc.setFontSize(8.5); doc.setFont('helvetica','normal'); tc('#6b7280');
  doc.text(`Risikoscore: ${result.score} / 10`, ML + 6, y + 16);

  // Score-Balken
  const barX = ML + 52, barW = CW - 58;
  fc('#e5e7eb'); doc.rect(barX, y + 12.5, barW, 2.5, 'F');
  const barColor = result.level === 'Niedrig' ? '#16a34a' : result.level === 'Erhöht' ? '#d97706' : '#dc2626';
  fc(barColor); doc.rect(barX, y + 12.5, barW * Math.min(1, result.score / 10), 2.5, 'F');
  y += 30;

  // ── Hinweise ──────────────────────────────────────────────
  sectionHead('Befunde & Hinweise');
  result.hints.forEach((hint, i) => {
    fc('#e8f5ef'); dc('#b5e2cc'); doc.setLineWidth(0.2);
    doc.circle(ML + 3, y - 1.2, 3, 'FD');
    doc.setFontSize(7); doc.setFont('helvetica','bold'); tc('#1e7752');
    doc.text(String(i + 1), ML + 3, y - 0.2, { align: 'center' });
    wrapped(hint, 9, '#374151', 8);
    y += 1.5;
  });
  y += 2;

  // ── Verhandlungsfragen ────────────────────────────────────
  sectionHead('Ihre Verhandlungsfragen');
  result.questions.forEach((q) => {
    doc.setFontSize(10); doc.setFont('helvetica','bold'); tc('#1e7752');
    doc.text('›', ML, y);
    wrapped(`„${q}"`, 9, '#374151', 5);
    y += 1.5;
  });
  y += 5;

  // ── Footer ────────────────────────────────────────────────
  const footerH = email ? 30 : 24;
  roundedBox(ML, y, CW, footerH, '#f9fafb', '#e5e7eb');
  y += 5;
  wrapped(
    'Ein Online-Inserat-Check dient der Vorbereitung und ersetzt keine technische ' +
    'Begutachtung vor Ort. Für maximale Sicherheit empfehlen wir eine unabhängige ' +
    'Werkstattprüfung vor dem Kauf.',
    8, '#6b7280',
  );
  if (email) {
    y += 1.5;
    wrapped(`PDF-Kopie angefordert für: ${email}`, 7.5, '#9ca3af');
  }

  doc.save('inserat-check-analyse.pdf');
}
