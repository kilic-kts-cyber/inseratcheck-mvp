'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { calculateRisk, type FormData, type RiskLevel } from '@/lib/riskLogic';
import { generatePDF } from '@/lib/pdf';

const RISK_CFG: Record<RiskLevel, {
  bg: string; border: string; text: string; badgeBg: string; emoji: string;
}> = {
  Niedrig: { bg:'bg-emerald-50', border:'border-emerald-200', text:'text-emerald-700', badgeBg:'bg-emerald-100', emoji:'✅' },
  Erhöht:  { bg:'bg-amber-50',   border:'border-amber-200',   text:'text-amber-700',   badgeBg:'bg-amber-100',   emoji:'⚠️' },
  Hoch:    { bg:'bg-red-50',     border:'border-red-200',     text:'text-red-700',     badgeBg:'bg-red-100',     emoji:'🚨' },
};

export default function ResultClient() {

  const params = useSearchParams();

  const data = useMemo<FormData>(() => ({
    advertLink: params.get('advertLink') ?? '',
    advertText: params.get('advertText') ?? '',
    brand: params.get('brand') ?? '',
    model: params.get('model') ?? '',
    year: params.get('year') ?? '',
    price: params.get('price') ?? '',
    mileage: params.get('mileage') ?? '',
    sellerType: (params.get('sellerType') as any) ?? '',
    firstRegistration: (params.get('firstRegistration') as any) ?? '',
    serviceHistory: (params.get('serviceHistory') as any) ?? '',
    lastServiceEntry: params.get('lastServiceEntry') ?? '',
    lastServiceWork: params.get('lastServiceWork') ?? '',
    accidentFree: (params.get('accidentFree') as any) ?? '',
    repaintsDocumented: (params.get('repaintsDocumented') as any) ?? '',
    huValidUntil: params.get('huValidUntil') ?? '',
    ownershipDuration: (params.get('ownershipDuration') as any) ?? '',
  }), [params]);

  const result = useMemo(() => calculateRisk(data), [data]);
  const cfg = RISK_CFG[result.level];

  const vehicle = [data.brand, data.model, data.year].filter(Boolean).join(' ');

  // 🔹 Händler-Mustertext
  const emailTemplate = useMemo(() => {

    const questionsBlock = result.questions
      .map(q => `- ${q}`)
      .join('\n');

    return `Guten Tag,

ich interessiere mich für Ihr Fahrzeug (${vehicle}).

Vor einer Besichtigung hätte ich noch folgende Fragen:

${questionsBlock}

Vielen Dank im Voraus.

Mit freundlichen Grüßen`;

  }, [result.questions, vehicle]);

  const [pdfLoading, setPdfLoading] = useState(false);

  async function handlePdf() {
    setPdfLoading(true);
    try {
      await generatePDF(data, result);
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f9f8] pb-20">

      <div className="max-w-xl mx-auto px-4 py-8 space-y-6">

        <h1 className="text-2xl font-bold">{vehicle || 'Ihr Fahrzeug'}</h1>

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
          <p className="text-sm text-gray-600">
            Risikoscore: {result.score} / 100
          </p>
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

        {/* Verhandlungsfragen */}
        <section className="bg-white rounded-xl border p-4">
          <h2 className="font-semibold mb-3">Ihre Verhandlungsfragen</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            {result.questions.map((q, i) => (
              <li key={i}>„{q}“</li>
            ))}
          </ul>
        </section>

        {/* Copy-Block */}
        <section className="bg-gray-50 rounded-xl border p-4">
          <h2 className="font-semibold mb-3">📩 Anfrage direkt kopieren</h2>
          <textarea
            readOnly
            value={emailTemplate}
            className="w-full h-64 text-sm p-3 border rounded-lg bg-white"
          />
        </section>

        {/* PDF Button */}
        <button
          onClick={handlePdf}
          disabled={pdfLoading}
          className="w-full bg-black text-white py-4 rounded-xl font-semibold"
        >
          {pdfLoading ? 'PDF wird erstellt…' : 'Analyse als PDF speichern'}
        </button>

      </div>

    </main>
  );
}
