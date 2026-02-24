'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { FormData } from '@/lib/riskLogic';

const EMPTY: FormData = {
  advertLink: '',
  advertText: '',   // ← NEU
  brand: '',
  model: '',
  year: '',
  price: '',
  mileage: '',
  sellerType: '',
  firstRegistration: '',
  serviceHistory: '',
  lastServiceEntry: '',
  lastServiceWork: '',
  accidentFree: '',
  repaintsDocumented: '',
  huValidUntil: '',
  ownershipDuration: '',
};

const inputCls =
  'w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm bg-white text-gray-900 placeholder-gray-400';

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

export default function CheckPage() {

  const router = useRouter();
  const [form, setForm] = useState<FormData>(EMPTY);
  const [error, setError] = useState('');

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

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
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            ⚠️ {error}
          </div>
        )}

        <Section title="Inserat">
          <Field label="Inserat-Link" hint="Optional – z. B. mobile.de oder autoscout24.de">
            <input
              type="url"
              placeholder="https://www.mobile.de/..."
              className={inputCls}
              value={form.advertLink}
              onChange={e => set('advertLink', e.target.value)}
            />
          </Field>

          {/* 🔥 NEU: Inseratstext */}
          <Field
            label="Inseratstext (optional)"
            hint="Hier können Sie die komplette Fahrzeugbeschreibung hineinkopieren. Das System erkennt automatisch auffällige Formulierungen wie „im Kundenauftrag“, „Export“, „Bastlerfahrzeug“ usw."
          >
            <textarea
              rows={6}
              placeholder="Hier kompletten Inseratstext einfügen …"
              className={`${inputCls} resize-none`}
              value={form.advertText}
              onChange={e => set('advertText', e.target.value)}
            />
          </Field>
        </Section>

        <Section title="Fahrzeugdaten">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Marke" required>
              <input className={inputCls} value={form.brand}
                onChange={e => set('brand', e.target.value)} />
            </Field>
            <Field label="Modell" required>
              <input className={inputCls} value={form.model}
                onChange={e => set('model', e.target.value)} />
            </Field>
            <Field label="Baujahr" required>
              <input className={inputCls} value={form.year}
                onChange={e => set('year', e.target.value)} />
            </Field>
            <Field label="Kilometerstand (km)" required>
              <input className={inputCls} value={form.mileage}
                onChange={e => set('mileage', e.target.value)} />
            </Field>
          </div>

          <Field label="Preis (€)" required>
            <input className={inputCls} value={form.price}
              onChange={e => set('price', e.target.value)} />
          </Field>
        </Section>

        <div className="pt-2 pb-10">
          <button
            onClick={handleSubmit}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-base py-4 rounded-xl shadow-md"
          >
            Analyse starten
          </button>
        </div>

      </div>
    </main>
  );
}
