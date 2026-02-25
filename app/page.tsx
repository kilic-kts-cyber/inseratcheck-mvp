export default function HomePage() {
  return (
    <main style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>

      {/* Navigation */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        borderBottom: "1px solid #eee"
      }}>
        <h2>InseratCheck</h2>
        <a href="/login" style={{ textDecoration: "none", fontWeight: 600 }}>
          Login
        </a>
      </header>

      {/* Hero */}
      <section style={{
        padding: "80px 40px",
        textAlign: "center",
        maxWidth: 900,
        margin: "0 auto"
      }}>
        <h1 style={{ fontSize: 40, marginBottom: 20 }}>
          Gebrauchtwagen prüfen wie ein Profi
        </h1>

        <p style={{ fontSize: 18, color: "#555", marginBottom: 40 }}>
          InseratCheck analysiert Fahrzeuganzeigen,
          erkennt Risiken und gibt dir klare
          Verhandlungsargumente.
        </p>

        <a
          href="#analyse"
          style={{
            padding: "15px 30px",
            backgroundColor: "black",
            color: "white",
            textDecoration: "none",
            borderRadius: 6,
            fontWeight: 600
          }}
        >
          Jetzt kostenlos prüfen
        </a>
      </section>

      {/* Vorteile */}
      <section style={{
        background: "#f8f8f8",
        padding: "60px 40px"
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", marginBottom: 40 }}>
            Warum InseratCheck?
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 30
          }}>
            <div>
              <h3>Risiko-Erkennung</h3>
              <p>
                Fehlende Angaben, typische Problemformulierungen
                und versteckte Hinweise werden erkannt.
              </p>
            </div>

            <div>
              <h3>Verhandlungsargumente</h3>
              <p>
                Du bekommst konkrete Punkte für die Preisverhandlung.
              </p>
            </div>

            <div>
              <h3>Werkstatt-Option</h3>
              <p>
                Optional kannst du das Fahrzeug
                professionell prüfen lassen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Analyse-Bereich */}
      <section
        id="analyse"
        style={{
          padding: "80px 40px",
          maxWidth: 800,
          margin: "0 auto"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 30 }}>
          Inserat prüfen
        </h2>

        <textarea
          placeholder="Inserattext hier einfügen..."
          style={{
            width: "100%",
            height: 150,
            padding: 15,
            marginBottom: 20
          }}
        />

        <input
          type="text"
          placeholder="Marke"
          style={{ width: "100%", padding: 10, marginBottom: 15 }}
        />

        <input
          type="text"
          placeholder="Modell"
          style={{ width: "100%", padding: 10, marginBottom: 15 }}
        />

        <input
          type="text"
          placeholder="Baujahr"
          style={{ width: "100%", padding: 10, marginBottom: 15 }}
        />

        <input
          type="text"
          placeholder="Kilometerstand"
          style={{ width: "100%", padding: 10, marginBottom: 15 }}
        />

        <input
          type="text"
          placeholder="Preis"
          style={{ width: "100%", padding: 10, marginBottom: 20 }}
        />

        <button
          style={{
            width: "100%",
            padding: 15,
            backgroundColor: "black",
            color: "white",
            border: "none",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Analyse starten
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        padding: 30,
        textAlign: "center",
        borderTop: "1px solid #eee",
        color: "#777"
      }}>
        © {new Date().getFullYear()} InseratCheck – Sicher. Legal. Geprüft.
      </footer>

    </main>
  );
}
