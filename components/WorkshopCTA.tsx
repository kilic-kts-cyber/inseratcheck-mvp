'use client';

import { WORKSHOP_BOOKING_URL } from '@/lib/config';

export default function WorkshopCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Weicher Übergang */}
      <div
        className="h-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.95) 0%, transparent 100%)' }}
      />
      <div className="bg-white border-t-2 border-brand-500 shadow-[0_-4px_32px_rgba(0,0,0,0.10)] px-4 py-3.5">
        <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-xl shrink-0">
              🔧
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm leading-tight">
                Werkstattprüfung in meiner Nähe buchen
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Vor dem Kauf unabhängig prüfen lassen
              </p>
            </div>
          </div>
          <a
            href={WORKSHOP_BOOKING_URL}
            className="shrink-0 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl w-full sm:w-auto text-center transition-colors shadow-sm"
          >
            Werkstattprüfung buchen
          </a>
        </div>
      </div>
    </div>
  );
}
