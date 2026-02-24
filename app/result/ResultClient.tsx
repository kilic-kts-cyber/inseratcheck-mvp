'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { calculateRisk, type FormData, type RiskLevel } from '@/lib/riskLogic';
import { generatePDF } from '@/lib/pdf';
import WorkshopCTA from '@/components/WorkshopCTA';

// ─────────────────────────────────────────────────────────────
// Risiko-Config
// ─────────────────────────────────────────────────────────────
const RISK_CFG: Record<RiskLevel, {
  bg: string; border: string; text: string; badgeBg: string; emoji: string; pulse: boolean;
}> = {
  Niedrig: { bg:'bg-emerald-50', border:'border-emerald-200', text:'text-emerald-700', badgeBg:'bg-emerald-100', emoji:'✅', pulse:false },
  Erhöht:  { bg:'bg-amber-50',   border:'border-amber-200',   text:'text-amber-700',   badgeBg:'bg-amber-100',   emoji:'⚠️', pulse:false },
  Hoch:    { bg:'bg-red-50',     border:'border-red-200',     text:'text-red-700',     badgeBg:'bg-red-100',     emoji:'🚨', pulse:true  },
};

// ─────────────────────────────────────────────────────────────
// Score-Bar (0–100)
// ─────────────────────────────────────────────────────────────
function ScoreBar({ score }: { score: number }) {
  const pct = Math.min(100, score);

  const color =
    score < 30 ? 'bg-emerald-500' :
    score < 50 ? 'bg-amber-500' :
                 'bg-red-500';

  return (
    <div>
      <div className="flex justify-between text-xs text-gray-400 mb-1.5">
        <span>Risikoscore</span>
        <span className="font-semibold text-gray-600">{score} / 100</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Hauptkomponente
// ─────────────────────────────────────────────────────────────
export default function ResultClient() {

  const params = useSearchParams();

  const data = useMemo<FormData>(() => ({
    advertLink:         params.get('advertLink') ?? '',
    brand:              params.get('brand') ?? '',
    model:              params.get('model') ?? '',
    year:               params.get('year') ?? '',
    price:              params.get('price') ?? '',
    mileage:            params.get('mileage') ?? '',
    sellerType:         (params.get('sellerType') as FormData['sellerType']) ?? '',
    firstRegistration:  (params.get('firstRegistration') as FormData['firstRegistration']) ?? '',
    serviceHistory:     (params.get('serviceHistory') as FormData['serviceHistory']) ?? '',
    lastServiceEntry:   params.get('lastServiceEntry') ?? '',
    lastServiceWork:    params.get('lastServiceWork') ?? '',
    accidentFree:       (params.get('accidentFree') as FormData['accidentFree']) ?? '',
    repaintsDocumented: (params.get('repaintsDocumented') as FormData['repaintsDocumented']) ?? '',
    huValidUntil:       params.get('huValidUntil') ?? '',
    ownershipDuration:  (params.get('ownershipDuration') as FormData['ownershipDuration']) ?? '',
  }), [params]);

  const result = useMemo(() => calculateRisk(data), [data]);
  const cfg    = RISK_CFG[result.level];

  // ─────────────────────────────────────────────────────────
  // Copy-Paste Verkäufer-Text
  // ─────────────────────────────────────────────────────────
  const emailTemplate = useMemo(() => {

    const vehicleName = [data.brand, data.model, data.year]
      .filter(Boolean)
      .join(' ');

    const idMatch = data.advertLink?.match(/(\d{5,})/);
    const advertId = idMatch ? idMatch[1] : null;

    const intro =
      vehicleName
        ? `bezüglich Ihres angebotenen Fahrzeugs (${vehicleName}) hätte ich vor einer Besichtigung noch einige Fragen:`
        : 'bezüglich des angebotenen Fahrzeugs hätte ich vor einer Besichtigung noch einige Fragen:';

    const idLine = advertId ? `Inseratsnummer: ${advertId}\n\n` : '';

    const questionsBlock = result.questions.map(q => `- ${q}`).join('\n');

    return `Guten Tag,

${intro}

${idLine}${questionsBlock}

Ich freue mich auf Ihre Rückmeldung.

Mit freundlichen Grüßen`;

  }, [result.questions, data]);

  const [pdfLoading, setPdfLoading] = useState(false);

  async function handlePdf() {
    setPdfLoading(true);
    try {
      await generatePDF(data, result);
    } finally {
      setPdfLoading(false);
    }
  }

  const vehicle = [data.brand, data.model, data.year].filter(Boolean).join(' ');

  return (
    <main className="min-h-screen bg-[#f7f9f8]">

      <div className="max-w-xl mx-auto px-4 py-8 space-y-6">

        {/* Fahrzeug */}
        <div>
          <h1 className="text-2xl font-bold">{vehicle || 'Ihr Fahrzeug'}</h1>
        </div>

        {/* Risikoklasse */}
        <div className={`${cfg.bg} ${cfg.border} border-2 rounded-xl p-6`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`${cfg.badgeBg} w-12 h-12 rounded-xl flex items-center justify-center text-2xl`}>
              {cfg.emoji}
            </div>
            <div>
              <p className="text-sm text-gray-400">Risikoklasse</p>
              <p className={`text-xl font-bold ${cfg.text}`}>{result.level}</p>
            </div>
          </div>

          <ScoreBar score={result.score} />
        </div>

        {/* Hinweise */}
        <section className="bg-white rounded-xl border p-4">
          <h2 className="font-semibold mb-3">Befunde & Hinweise</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            {result.hints.map((hint, i) => (
              <li key={i}>• {hint}</li>
            ))}
          </ul>
        </section>

        {/* Fragen */}
        <section className="bg-white rounded-xl border p-4">
          <h2 className="font-semibold mb-3">Ihre Verhandlungsfragen</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            {result.questions.map((q, i) => (
              <li key={i}>„{q}"</li>
            ))}
          </ul>
        </section>

        {/* Copy-Paste Block */}
        <section className="bg-gray-50 rounded-xl border p-4">
          <h2 className="font-semibold mb-3">📩 Anfrage direkt kopieren</h2>
          <textarea
            readOnly
            value={emailTemplate}
            className="w-full h-64 text-sm p-3 border rounded-lg bg-white"
          />
        </section>

        {/* PDF */}
        <button
          onClick={handlePdf}
          disabled={pdfLoading}
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          {pdfLoading ? 'PDF wird erstellt…' : 'Analyse als PDF speichern'}
        </button>

      </div>

      <WorkshopCTA />
    </main>
  );
}
