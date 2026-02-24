'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
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
  const [advertText, setAdvertText] = useState('');

  useEffect(() => {
    const text = localStorage.getItem('advertText') || '';
    setAdvertText(text);
  }, []);

  const data = useMemo<FormData>(() => ({
    advertLink: params.get('advertLink') ?? '',
    advertText: advertText,
    brand: params.get('brand') ?? '',
    model: params.get('model') ?? '',
    year: params.get('year') ?? '',
    price: params.get('price') ?? '',
    mileage: params.get('mileage') ?? '',
    sellerType: '',
    firstRegistration: '',
    serviceHistory: '',
    lastServiceEntry: '',
    lastServiceWork: '',
    accidentFree: '',
    repaintsDocumented: '',
    huValidUntil: '',
    ownershipDuration: '',
  }), [params, advertText]);

  const result = useMemo(() => calculateRisk(data), [data]);
  const cfg = RISK_CFG[result.level];

  const vehicle = [data.brand, data.model, data.year].filter(Boolean).join(' ');

  const idMatch = data.advertLink?.match(/(\d{5,})/);
  const advertId = idMatch ? idMatch[1] : null;

  const emailTemplate = `
Guten Tag,

ich interessiere mich für Ihr Fahrzeug (${vehicle})${advertId ? ` – Inseratsnummer: ${advertId}` : ''}.

Vor einer Besichtigung hätte ich noch folgende Fragen:

- Können Sie mir bitte die FIN/VIN mitteilen, damit ich mir das Fahrzeugdatenblatt ziehen kann?
- Wie viele Vorbesitzer hatte das Fahrzeug?
- Ist das Fahrzeug vollständig scheckheftgepflegt?
- Wann wurde der letzte größere Service durchgeführt (Datum, Kilometerstand und Umfang)?
- Wurde der Zahnriemen bzw. – falls vorhanden – die Steuerkette geprüft oder erneuert?
- Ist das Fahrzeug unfallfrei?
- Gibt es ein aktuelles Werkstatt- oder Zustandsprotokoll?

Vielen Dank im Voraus.

Mit freundlichen Grüßen
`;

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

        <h1 className="text-2xl font-bold">{vehicle}</h1>

        <div className={`${cfg.bg} ${cfg.border} border-2 rounded-xl p-6`}>
          <p className={`text-xl font-bold ${cfg.text}`}>{result.level}</p>
          <p>Risikoscore: {result.score} / 100</p>
        </div>

        <section className="bg-white rounded-xl border p-4">
          <h2 className="font-semibold mb-3">Befunde & Hinweise</h2>
          <ul className="text-sm space-y-2">
            {result.hints.map((h, i) => (
              <li key={i}>• {h}</li>
            ))}
          </ul>
        </section>

        <section className="bg-gray-50 rounded-xl border p-4">
          <h2 className="font-semibold mb-3">Anfrage direkt kopieren</h2>
          <textarea
            readOnly
            value={emailTemplate}
            className="w-full h-72 p-3 border rounded-lg"
          />
        </section>

        <button
          onClick={handlePdf}
          disabled={pdfLoading}
          className="w-full bg-black text-white py-4 rounded-xl"
        >
          {pdfLoading ? 'PDF wird erstellt…' : 'Analyse als PDF speichern'}
        </button>

      </div>
    </main>
  );
}
