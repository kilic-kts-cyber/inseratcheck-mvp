import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#f7f9f8]">

      {/* Nav */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-5 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-heading text-xl font-black tracking-tight text-brand-800">
            Inserat<span className="text-brand-500">Check</span>
          </span>
          <Link
            href="/check"
            className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Jetzt prüfen
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-800 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#1e7752_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_#143f2e_0%,_transparent_55%)]" />
        <div className="noise-overlay absolute inset-0" />
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-white/5 hidden lg:block" />
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full border border-white/5 hidden lg:block" />

        <div className="relative max-w-3xl mx-auto px-5 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 border border-white/15 bg-white/5 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-medium mb-7 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            Kostenlos · Ohne Anmeldung · Sofort-Ergebnis
          </div>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.1] mb-6 animate-fade-in-up">
            Inserat kostenlos prüfen –<br />
            <span className="text-green-300">sicher auf Augenhöhe</span> verhandeln
          </h1>

          <p className="text-base md:text-lg text-white/70 leading-relaxed mb-10 max-w-xl mx-auto animate-fade-in-up delay-100">
            Erhalte sofort eine Risikoanalyse, konkrete Hinweise und professionelle
            Verhandlungsfragen – kostenlos und ohne Anmeldung.
          </p>

          <div className="animate-fade-in-up delay-200">
            <Link
              href="/check"
              className="inline-flex items-center gap-3 bg-white text-brand-700 hover:bg-green-50 font-bold text-base md:text-lg px-8 py-4 rounded-xl shadow-xl hover:-translate-y-0.5 transform transition-all"
            >
              <svg className="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Inserat kostenlos prüfen
            </Link>
            <p className="text-white/40 text-sm mt-4">Dauert nur 60–90 Sekunden</p>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-white border-b border-gray-100 py-4 px-5">
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-6 md:gap-10">
          {[
            { icon: '🔒', label: 'Kein Login nötig' },
            { icon: '💶', label: '100 % kostenlos' },
            { icon: '⚡', label: 'Sofort-Ergebnis' },
            { icon: '📄', label: 'PDF kostenlos' },
            { icon: '🔧', label: 'Werkstatt-Tipp inklusive' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <span>{icon}</span><span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Schritte */}
      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-2">So funktioniert&apos;s</p>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900">In drei Schritten zum sicheren Kauf</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-9 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-brand-100" />
            {[
              { step: 1, icon: '🔍', title: 'Inserat prüfen', desc: 'Fülle das kurze Formular mit den wichtigsten Fahrzeugdaten aus – in unter 90 Sekunden.' },
              { step: 2, icon: '⚠️', title: 'Risiken erkennen', desc: 'Sofortige Risikoanalyse mit konkreten Hinweisen und professionellen Verhandlungsfragen.' },
              { step: 3, icon: '🔧', title: 'Werkstattprüfung buchen', desc: 'Lass das Fahrzeug von einem unabhängigen Profi prüfen – vor dem Kauf, für maximale Sicherheit.' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <div className="w-[72px] h-[72px] rounded-2xl bg-white border-2 border-brand-100 flex items-center justify-center text-3xl shadow-card">{icon}</div>
                  <span className="step-number absolute -top-2 -right-2 bg-brand-600 text-white">{step}</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-base mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/check" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-md">
              Inserat kostenlos prüfen
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Was du bekommst */}
      <section className="bg-white border-y border-gray-100 py-14 px-5">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">Was du sofort erhältst</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: '📊', cardBg: 'bg-emerald-50 border-emerald-100', iconBg: 'bg-emerald-100', title: 'Risikoklasse', desc: 'Niedrig / Erhöht / Hoch – klar und sofort sichtbar mit Risikoscore.' },
              { icon: '💡', cardBg: 'bg-amber-50 border-amber-100',   iconBg: 'bg-amber-100',   title: 'Konkrete Hinweise', desc: 'Bis zu 7 spezifische Befunde zu Unfall, HU, Scheckheft, Import und mehr.' },
              { icon: '💬', cardBg: 'bg-blue-50 border-blue-100',     iconBg: 'bg-blue-100',    title: 'Verhandlungsfragen', desc: 'Bis zu 8 professionelle Fragen, die dich als kompetenten Käufer positionieren.' },
            ].map(({ icon, cardBg, iconBg, title, desc }) => (
              <div key={title} className={`rounded-2xl border ${cardBg} p-5`}>
                <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center text-xl mb-3`}>{icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1.5">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-950 text-brand-300/60 text-xs text-center py-6 mt-auto px-5">
        <p>© {new Date().getFullYear()} InseratCheck · Ein Online-Check ersetzt keine technische Prüfung vor Ort.</p>
      </footer>

    </main>
  );
}
