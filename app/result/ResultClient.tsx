'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { calculateRisk, type FormData, type RiskLevel } from '@/lib/riskLogic';
import { generatePDF } from '@/lib/pdf';
import WorkshopCTA from '@/components/WorkshopCTA';

// ─── Risiko-Config ────────────────────────────────────────────
const RISK_CFG: Record<RiskLevel, {
  bg: string; border: string; text: string; badgeBg: string; emoji: string; pulse: boolean;
}> = {
  Niedrig: { bg:'bg-emerald-50', border:'border-emerald-200', text:'text-emerald-700', badgeBg:'bg-emerald-100', emoji:'✅', pulse:false },
  Erhöht:  { bg:'bg-amber-50',   border:'border-amber-200',   text:'text-amber-700',   badgeBg:'bg-amber-100',   emoji:'⚠️', pulse:false },
  Hoch:    { bg:'bg-red-50',     border:'border-red-200',     text:'text-red-700',     badgeBg:'bg-red-100',     emoji:'🚨', pulse:true  },
};

// ─── Score-Balken ─────────────────────────────────────────────
function ScoreBar({ score, level }: { score: number; level: RiskLevel }) {
  const pct   = Math.min(100, Math.round((score / 100) * 100));
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
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width:`${pct}%` }} />
      </div>
    </div>
  );
}

// ─── Hauptkomponente ──────────────────────────────────────────
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

const emailTemplate = useMemo(() => {
  const vehicleName = [data.brand, data.model, data.year]
    .filter(Boolean)
    .join(' ');

  const idMatch = data.advertLink?.match(/id=(\d+)/);
  const advertId = idMatch ? idMatch[1] : null;

  const greeting = 'Guten Tag,';

  const intro =
    vehicleName
      ? `bezüglich Ihres angebotenen Fahrzeugs (${vehicleName}) hätte ich vor einer Besichtigung noch einige Fragen:`
      : 'bezüglich des angebotenen Fahrzeugs hätte ich vor einer Besichtigung noch einige Fragen:';

  const idLine = advertId ? `Inseratsnummer: ${advertId}` : '';

  const questionsBlock = result.questions.map((q) => `- ${q}`).join('\n');

  return `${greeting}\n\n${intro}\n${idLine}\n\n${questionsBlock}\n\nIch freue mich auf Ihre Rückmeldung.\nMit freundlichen Grüßen`;
}, [result.questions, data]);

const [pdfLoading, setPdfLoading] = useState(false);
  const [sendEmail,  setSendEmail]  = useState(false);
  const [email,      setEmail]      = useState('');

  async function handlePdf() {
    setPdfLoading(true);
    try { await generatePDF(data, result, sendEmail ? email : undefined); }
    finally { setPdfLoading(false); }
  }

  const vehicle = [data.brand, data.model, data.year].filter(Boolean).join(' ');

  return (
    <main className="min-h-screen bg-[#f7f9f8]">

      {/* Nav */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-5 py-4 shadow-sm">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-heading text-xl font-black text-brand-800">
            Inserat<span className="text-brand-500">Check</span>
          </Link>
          <Link href="/check" className="text-sm text-brand-600 font-semibold hover:underline">
            ← Neues Inserat prüfen
          </Link>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-8 space-y-5 pb-40">

        {/* Fahrzeug-Header */}
        <div className="animate-fade-in">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1">Analyseergebnis für</p>
          <h1 className="font-heading text-2xl md:text-3xl font-black text-gray-900">{vehicle || 'Ihr Fahrzeug'}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-gray-400">
            {data.price   && <span>💶 {parseFloat(data.price).toLocaleString('de-DE')} €</span>}
            {data.mileage && <span>🛣️ {parseFloat(data.mileage).toLocaleString('de-DE')} km</span>}
            {data.sellerType && <span>{data.sellerType === 'privat' ? '👤 Privat' : '🏪 Händler'}</span>}
          </div>
        </div>

        {/* Risikoklasse */}
        <div className={`${cfg.bg} ${cfg.border} border-2 rounded-2xl p-6 animate-fade-in-up ${cfg.pulse ? 'animate-pulse-ring' : ''}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className={`${cfg.badgeBg} w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0`}>
              {cfg.emoji}
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold text-gray-400 mb-0.5">Risikoklasse</p>
              <p className={`font-heading text-2xl font-black ${cfg.text}`}>{result.level}</p>
            </div>
          </div>
          <ScoreBar score={result.score} level={result.level} />
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 animate-fade-in delay-100">
          <span className="shrink-0 mt-0.5">ℹ️</span>
          <p className="text-xs text-blue-700 leading-relaxed">
            <strong>Wichtiger Hinweis:</strong> Ein Online-Check ersetzt keine technische Prüfung vor Ort.
            Für maximale Sicherheit empfehlen wir eine unabhängige Werkstattprüfung vor dem Kauf.
          </p>
        </div>

        {/* Hinweise */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden animate-fade-in-up delay-200">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2.5">
            <span className="text-lg">📋</span>
            <h2 className="font-semibold text-gray-900">Befunde & Hinweise</h2>
            <span className="ml-auto text-xs font-semibold text-gray-400 bg-gray-100 rounded-full px-2.5 py-0.5">{result.hints.length}</span>
          </div>
          <ul className="divide-y divide-gray-50">
            {result.hints.map((hint, i) => (
              <li key={i} className="px-6 py-4 flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                <span className="shrink-0 w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-[11px] font-bold flex items-center justify-center mt-0.5">{i+1}</span>
                {hint}
              </li>
            ))}
          </ul>
        </section>

        {/* Verhandlungsfragen */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden animate-fade-in-up delay-300">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2.5">
            <span className="text-lg">💬</span>
            <h2 className="font-semibold text-gray-900">Ihre Verhandlungsfragen</h2>
            <span className="ml-auto text-xs font-semibold text-gray-400 bg-gray-100 rounded-full px-2.5 py-0.5">{result.questions.length}</span>
          </div>
          <ul className="divide-y divide-gray-50">
            {result.questions.map((q, i) => (
              <li key={i} className="px-6 py-4 flex items-start gap-3 text-sm text-gray-600">
                <span className="shrink-0 text-brand-400 font-black text-lg leading-none mt-0.5">›</span>
                <span className="leading-relaxed italic">„{q}"</span>
              </li>
            ))}
          </ul>
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-400">Sachlich formuliert – positioniert Sie als kompetenten, informierten Käufer.</p>
          </div>
        </section>

        {/* PDF-Export */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden animate-fade-in-up delay-400">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2.5">
            <span className="text-lg">📄</span>
            <h2 className="font-semibold text-gray-900">Analyse speichern</h2>
          </div>
          <div className="px-6 py-5 space-y-4">
            <button onClick={handlePdf} disabled={pdfLoading}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2.5 text-sm transition-colors">
              {pdfLoading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />PDF wird erstellt …</>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Analyse als PDF speichern (kostenlos)
                </>
              )}
            </button>

            <div className="pt-1 border-t border-gray-50">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input type="checkbox" checked={sendEmail} onChange={e => setSendEmail(e.target.checked)}
                  className="w-4 h-4 rounded accent-brand-600" />
                <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                  PDF zusätzlich per E-Mail senden <span className="text-gray-400 text-xs">(optional)</span>
                </span>
              </label>
              {sendEmail && (
                <div className="mt-3 space-y-1.5 animate-fade-in">
                  <input type="email" placeholder="deine@email.de" value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm" />
                  <p className="text-xs text-gray-400">
                    Hinweis: In dieser MVP-Version wird kein E-Mail-Versand ausgelöst. Die Adresse wird im PDF vermerkt.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="text-center py-2">
          <Link href="/check" className="text-sm text-brand-600 hover:underline font-medium">
            ← Ein weiteres Inserat prüfen
          </Link>
        </div>

      </div>

      <WorkshopCTA />
    </main>
  );
}
