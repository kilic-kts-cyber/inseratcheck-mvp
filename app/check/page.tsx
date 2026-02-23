'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { FormData } from '@/lib/riskLogic';

const EMPTY: FormData = {
  advertLink: '', brand: '', model: '', year: '', price: '', mileage: '',
  sellerType: '', firstRegistration: '', serviceHistory: '',
  lastServiceEntry: '', lastServiceWork: '', accidentFree: '',
  repaintsDocumented: '', huValidUntil: '', ownershipDuration: '',
};

const inputCls =
  'w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm bg-white text-gray-900 placeholder-gray-400';

// ─── Pill (Radio-Button) ──────────────────────────────────────
function Pill({
  name, value, current, onSelect, label,
}: { name: string; value: string; current: string; onSelect: (v: string) => void; label: string }) {
  const active = current === value;
  return (
    <label className={`cursor-pointer select-none px-3.5 py-2 rounded-lg border text-sm font-medium transition-all ${
      active
        ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
        : 'bg-white text-gray-600 border-gray-200 hover:border-brand-400 hover:bg-brand-50'
    }`}>
      <input type="radio" name={name} value={value} checked={active}
        onChange={() => onSelect(value)} className="sr-only" />
      {label}
    </label>
  );
}

// ─── Field ────────────────────────────────────────────────────
function Field({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 leading-relaxed">{hint}</p>}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{title}</p>
      </div>
      <div className="p-6 flex flex-col gap-5">{children}</div>
    </div>
  );
}

// ─── Seite ────────────────────────────────────────────────────
export default function CheckPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(EMPTY);
  const [error, setError] = useState('');

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  function pills(name: string, key: keyof FormData, opts: [string, string][]) {
    return opts.map(([v, l]) => (
      <Pill key={v} name={name} value={v} current={form[key] as string}
        onSelect={v => set(key, v as never)} label={l} />
    ));
  }

  function handleSubmit() {
    if (!form.brand || !form.model || !form.year || !form.price || !form.mileage) {
      setError('Bitte fülle alle Pflichtfelder aus: Marke, Modell, Baujahr, Preis und Kilometerstand.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setError('');
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(form).filter(([, v]) => v !== undefined && v !== ''),
      ) as Record<string, string>,
    );
    router.push(`/result?${params.toString()}`);
  }

  return (
    <main className="min-h-screen bg-[#f7f9f8]">

      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-5 py-4 shadow-sm">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-heading text-xl font-black text-brand-800">
            Inserat<span className="text-brand-500">Check</span>
          </Link>
          <span className="text-xs text-gray-400 font-medium">60–90 Sekunden</span>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-8 space-y-4">

        <div>
          <h1 className="font-heading text-3xl font-black text-gray-900 mb-1.5">Inserat prüfen</h1>
          <p className="text-sm text-gray-400">Keine Anmeldung · Keine E-Mail · Ergebnis sofort anzeigen</p>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm animate-fade-in">
            <span className="shrink-0">⚠️</span>{error}
          </div>
        )}

        <Section title="Inserat">
          <Field label="Inserat-Link" hint="Optional – z. B. mobile.de oder autoscout24.de">
            <input type="url" placeholder="https://www.mobile.de/..." className={inputCls}
              value={form.advertLink} onChange={e => set('advertLink', e.target.value)} />
          </Field>
        </Section>

        <Section title="Fahrzeugdaten">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Marke" required>
              <input placeholder="z. B. VW" className={inputCls} value={form.brand}
                onChange={e => set('brand', e.target.value)} />
            </Field>
            <Field label="Modell" required>
              <input placeholder="z. B. Golf" className={inputCls} value={form.model}
                onChange={e => set('model', e.target.value)} />
            </Field>
            <Field label="Baujahr" required>
              <input placeholder="z. B. 2019" className={inputCls} value={form.year}
                onChange={e => set('year', e.target.value)} />
            </Field>
            <Field label="Kilometerstand (km)" required>
              <input placeholder="z. B. 85000" className={inputCls} value={form.mileage}
                onChange={e => set('mileage', e.target.value)} />
            </Field>
          </div>
          <Field label="Preis (€)" required>
            <input placeholder="z. B. 14900" className={inputCls} value={form.price}
              onChange={e => set('price', e.target.value)} />
          </Field>
        </Section>

        <Section title="Verkäufer">
          <Field label="Verkäufertyp">
            <div className="flex flex-wrap gap-2">
              {pills('sellerType', 'sellerType', [['privat','👤 Privat'], ['haendler','🏪 Händler']])}
            </div>
          </Field>
          {form.sellerType === 'privat' && (
            <Field label="Wie lange hat der Verkäufer das Fahrzeug?">
              <div className="flex flex-wrap gap-2">
                {pills('ownershipDuration', 'ownershipDuration', [
                  ['<3','< 3 Monate'], ['3-12','3–12 Monate'], ['1plus','> 1 Jahr'], ['unklar','Unklar'],
                ])}
              </div>
            </Field>
          )}
        </Section>

        <Section title="Herkunft">
          <Field label="Erstauslieferung"
            hint="Erstauslieferung = Land der ersten Zulassung. Reimporte können abweichende Historien oder Ausstattungen haben.">
            <div className="flex flex-wrap gap-2">
              {pills('firstRegistration', 'firstRegistration', [
                ['de','🇩🇪 Deutsche Erstauslieferung'],
                ['eu','🇪🇺 EU-Reimport'],
                ['non-eu','🌍 Nicht-EU-Import'],
                ['unklar','❓ Unklar'],
              ])}
            </div>
          </Field>
        </Section>

        <Section title="Service & Wartung">
          <Field label="Service / Scheckheft vorhanden?">
            <div className="flex flex-wrap gap-2">
              {pills('serviceHistory', 'serviceHistory', [
                ['ja','✅ Ja'], ['nein','❌ Nein'], ['unklar','❓ Unklar'],
              ])}
            </div>
          </Field>
          <Field label="Wann war der letzte Eintrag?" hint="z. B. 03/2023 oder ‚Unklar'">
            <input placeholder="z. B. 03/2023" className={inputCls} value={form.lastServiceEntry}
              onChange={e => set('lastServiceEntry', e.target.value)} />
          </Field>
          <Field label="Was wurde gemacht?" hint="Optional">
            <textarea placeholder="z. B. Ölwechsel, Bremsscheiben …"
              className={`${inputCls} resize-none`} rows={2} value={form.lastServiceWork}
              onChange={e => set('lastServiceWork', e.target.value)} />
          </Field>
        </Section>

        <Section title="Schäden & Lackierung">
          <Field label="Unfallfrei laut Inserat?">
            <div className="flex flex-wrap gap-2">
              {pills('accidentFree', 'accidentFree', [
                ['ja','✅ Ja, unfallfrei'], ['nein','❌ Unfall bekannt'], ['unklar','❓ Unklar'],
              ])}
            </div>
          </Field>
          <Field label="Nachlackierungen dokumentiert?">
            <div className="flex flex-wrap gap-2">
              {pills('repaintsDocumented', 'repaintsDocumented', [
                ['ja','✅ Ja, dokumentiert'], ['nein','❌ Nein'], ['unklar','❓ Unklar'],
              ])}
            </div>
          </Field>
        </Section>

        <Section title="Hauptuntersuchung (HU / TÜV)">
          <Field label="HU gültig bis" hint="Format MM/JJJJ, z. B. 09/2025 – oder ‚Unklar'">
            <input placeholder="z. B. 09/2025 oder Unklar" className={inputCls}
              value={form.huValidUntil} onChange={e => set('huValidUntil', e.target.value)} />
          </Field>
        </Section>

        <div className="pt-2 pb-10">
          <button onClick={handleSubmit}
            className="w-full bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-base py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transform transition-all flex items-center justify-center gap-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Analyse starten
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">
            Keine Anmeldung · Kein E-Mail-Zwang · 100 % kostenlos
          </p>
        </div>
      </div>
    </main>
  );
}
