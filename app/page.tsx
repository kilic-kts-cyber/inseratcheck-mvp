export default function HomePage() {
  return (
    <main style={{ fontFamily: "Arial, sans-serif", overflowX: "hidden" }}>

      {/* HERO */}
      <section
        style={{
          position: "relative",
          height: "100vh",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
          }}
        />

        <div style={{ position: "relative", maxWidth: 800, padding: 20 }}>
          <h1 style={{ fontSize: 48, marginBottom: 20 }}>
            Gebrauchtwagen prüfen wie ein Profi
          </h1>

          <p style={{ fontSize: 20, marginBottom: 40, color: "#ddd" }}>
            KI-Analyse. Risiko-Erkennung. Klare Verhandlungsargumente.
          </p>

          {/* Inserat-Link Feld */}
          <input
            type="text"
            placeholder="Inserat-Link hier einfügen..."
            style={{
              width: "100%",
              padding: 15,
              fontSize: 16,
              borderRadius: 6,
              border: "none",
              marginBottom: 15,
            }}
          />

          <button
            style={{
              width: "100%",
              padding: 16,
              backgroundColor: "#ff3b30",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              transition: "0.3s",
            }}
          >
            Analyse starten
          </button>
        </div>
      </section>

      {/* Vorteile */}
      <section
        style={{
          padding: "100px 40px",
          background: "#f5f5f5",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", marginBottom: 60 }}>
            Warum InseratCheck?
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 40,
            }}
          >
            <div
              style={{
                background: "white",
                padding: 40,
                borderRadius: 12,
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                transition: "0.3s",
              }}
            >
              <h3>⚠ Risiko-Erkennung</h3>
              <p>
                Fehlende Angaben, typische Problemformulierungen und versteckte
                Hinweise werden erkannt.
              </p>
            </div>

            <div
              style={{
                background: "white",
                padding: 40,
                borderRadius: 12,
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
            >
              <h3>🛠 Technische Hinweise</h3>
              <p>
                Hinweise auf Motorschäden, Unfallschäden oder Wartungsrisiken.
              </p>
            </div>

            <div
              style={{
                background: "white",
                padding: 40,
                borderRadius: 12,
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
            >
              <h3>💰 Verhandlungsargumente</h3>
              <p>
                Konkrete Punkte für die Preisverhandlung – datenbasiert.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: 40,
          textAlign: "center",
          background: "black",
          color: "white",
        }}
      >
        © {new Date().getFullYear()} InseratCheck – Sicher. Legal. Geprüft.
      </footer>
    </main>
  );
}
