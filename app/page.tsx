'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { FormData } from '@/lib/riskLogic';

const EMPTY: FormData = {
  advertLink: '',
  advertText: '',
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

export default function CheckPage() {

  const router = useRouter();
  const [form, setForm] = useState<FormData>(EMPTY);

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  function handleSubmit() {

    // 🔥 WICHTIG: Text im localStorage speichern
    localStorage.setItem('advertText', form.advertText || '');

    const params = new URLSearchParams();

    Object.entries(form).forEach(([k, v]) => {
      if (k !== 'advertText' && v) {
        params.append(k, String(v));
      }
    });

    router.push(`/result?${params.toString()}`);
  }

  return (
    <main className="min-h-screen bg-[#f7f9f8]">
      <div className="max-w-xl mx-auto px-4 py-8 space-y-4">

        <textarea
          rows={6}
          placeholder="Inseratstext einfügen..."
          value={form.advertText}
          onChange={e => set('advertText', e.target.value)}
          className="w-full border p-3 rounded-lg"
        />

        <input
          placeholder="Marke"
          value={form.brand}
          onChange={e => set('brand', e.target.value)}
          className="w-full border p-3 rounded-lg"
        />

        <input
          placeholder="Modell"
          value={form.model}
          onChange={e => set('model', e.target.value)}
          className="w-full border p-3 rounded-lg"
        />

        <input
          placeholder="Baujahr"
          value={form.year}
          onChange={e => set('year', e.target.value)}
          className="w-full border p-3 rounded-lg"
        />

        <input
          placeholder="Kilometerstand"
          value={form.mileage}
          onChange={e => set('mileage', e.target.value)}
          className="w-full border p-3 rounded-lg"
        />

        <input
          placeholder="Preis"
          value={form.price}
          onChange={e => set('price', e.target.value)}
          className="w-full border p-3 rounded-lg"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          Analyse starten
        </button>

      </div>
    </main>
  );
}
