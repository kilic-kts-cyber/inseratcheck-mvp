'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { calculateRisk, type FormData, type RiskLevel } from '@/lib/riskLogic';
import { generatePDF } from '@/lib/pdf';
import WorkshopCTA from '@/components/WorkshopCTA';

const RISK_CFG: Record<RiskLevel, {
  bg: string; border: string; text: string; badgeBg: string; emoji: string;
}> = {
  Niedrig: { bg:'bg-emerald-50', border:'border-emerald-200', text:'text-emerald-700', badgeBg:'bg-emerald-100', emoji:'✅' },
  Erhöht:  { bg:'bg-amber-50',   border:'border-amber-200',   text:'text-amber-700',   badgeBg:'bg-amber-100',   emoji:'⚠️' },
  Hoch:    { bg:'bg-red-50',     border:'border-red-200',     text:'text-red-700',     badgeBg:'bg-red-100',     emoji:'🚨' },
};

function ScoreBar({ score }: { score: number }) {
  const pct = Math.min(100, score);

  const color =
    score < 30 ? 'bg-emerald-500' :
    score < 60 ? 'bg-amber-500' :
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

export default function ResultClient() {

  const params = useSearchParams();

  const data = useMemo<FormData>(() => ({
    advertLink: params.get('advertLink') ?? '',
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

  const baseResult = useMemo(() => calculateRisk(data), [data]);

  const [aiBoost, setAiBoost] = useState(0);

  useEffect(() => {
    const text = localStorage.getItem("advertText") || "";
    if (!text || text.length < 20) return;

    async function runAI() {
      try {
        const res = await fetch('/api/ai/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        });

        if (!res.ok) return;

        const result = await res.json();
        let boost = result?.riskBoost || 0;

        const lower = text.toLowerCase();

        if (
          lower.includes("springt nicht an") ||
          lower.includes("ausgegangen") ||
          lower.includes("motorschaden") ||
          lower.includes("motor defekt")
        ) {
          boost = Math.max(boost, 40);
        }

        setAiBoost(boost);

      } catch (e) {
        console.error(e);
      }
    }

    runAI();
  }, []);

  const finalScore = Math.min(100, baseResult.score + aiBoost);

  const finalLevel: RiskLevel =
    finalScore < 25 ? 'Niedrig' :
    finalScore < 60 ? 'Erhöht' :
    'Hoch';

  const cfg = RISK_CFG[finalLevel];

  const [pdfLoading, setPdfLoading] = useState(false);

  async function handlePdf() {
    setPdfLoading(true);
    try {
      await generatePDF(data, {
        ...baseResult,
        score: finalScore,
        level: finalLevel
      });
    } finally {
      setPdfLoading(false);
    }
  }

  const vehicle = [data.brand, data.model, data.year].filter(Boolean).join(' ');

  return (
    <main className="min-h-screen bg-[#f7f9f8]">
      <div className="max-w-xl mx-auto px-4 py-8 space-y-6">

        <h1 className="text-2xl font-bold">{vehicle || 'Ihr Fahrzeug'}</h1>

        <div className={`${cfg.bg} ${cfg.border} border-2 rounded-xl p-6`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`${cfg.badgeBg} w-12 h-12 rounded-xl flex items-center justify-center text-2xl`}>
              {cfg.emoji}
            </div>
            <div>
              <p className="text-sm text-gray-400">Risikoklasse</p>
              <p className={`text-xl font-bold ${cfg.text}`}>{finalLevel}</p>
            </div>
          </div>

          <ScoreBar score={finalScore} />
        </div>

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
