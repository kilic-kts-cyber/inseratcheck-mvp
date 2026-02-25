import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          InseratCheck
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Prüfe Gebrauchtwagen-Inserate intelligent, erkenne Risiken frühzeitig
          und gehe vorbereitet in Preisverhandlungen.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Jetzt starten
          </Link>

          <Link
            href="/result"
            className="border border-gray-300 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition"
          >
            Demo ansehen
          </Link>
        </div>
      </section>

      {/* Vorteile */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <h3 className="font-semibold text-lg mb-2">
              Risiko-Analyse
            </h3>
            <p className="text-gray-600 text-sm">
              Automatische Auswertung von Inseraten mit klarer
              Risiko-Einstufung.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm">
            <h3 className="font-semibold text-lg mb-2">
              Verhandlungs-Vorteil
            </h3>
            <p className="text-gray-600 text-sm">
              Erhalte konkrete Hinweise für Preisverhandlungen.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm">
            <h3 className="font-semibold text-lg mb-2">
              Werkstatt-Prüfung
            </h3>
            <p className="text-gray-600 text-sm">
              Optional: Vor-Ort-Check durch Partnerwerkstätten.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className="text-2xl font-semibold mb-6">
          Bereit für deinen nächsten Fahrzeugkauf?
        </h2>

        <Link
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition"
        >
          Kostenlos prüfen
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} InseratCheck – Sicher. Legal. Geprüft.
      </footer>
    </main>
  );
}
