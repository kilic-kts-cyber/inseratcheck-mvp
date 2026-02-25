"use client";

import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0px)";
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));
  }, []);

  return (
    <main style={{ fontFamily: "Inter, Arial, sans-serif", overflowX: "hidden" }}>
      
      {/* HERO */}
      <section
        style={{
          position: "relative",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=2000')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.9) 100%)",
          }}
        />

        {/* Red Glow */}
        <div
          style={{
            position: "absolute",
            width: 700,
            height: 700,
            background:
              "radial-gradient(circle, rgba(255,0,0,0.3) 0%, transparent 70%)",
            filter: "blur(120px)",
          }}
        />

        <div style={{ position: "relative", maxWidth: 900, padding: 20 }}>
          <h1 style={{ fontSize: 60, fontWeight: 800, marginBottom: 20 }}>
            Gebrauchtwagen prüfen wie ein Profi
          </h1>

          <p style={{ fontSize: 20, color: "#ccc", marginBottom: 40 }}>
            KI-Analyse · Risiko-Erkennung · Technische Warnsignale ·
            Verhandlungsargumente
          </p>

          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <input
              type="text"
              placeholder="Inserat-Link hier einfügen..."
              style={{
                width: "100%",
                padding: 18,
                borderRadius: 10,
                border: "none",
                marginBottom: 15,
                fontSize: 16,
              }}
            />

            <button
              style={{
                width: "100%",
                padding: 18,
                backgroundColor: "#ff2d2d",
                border: "none",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 16,
                color: "white",
                cursor: "pointer",
                boxShadow: "0 15px 40px rgba(255,0,0,0.5)",
                transition: "0.3s",
              }}
            >
              Analyse starten
            </button>
          </div>

          <div style={{ marginTop: 25, color: "#aaa", fontSize: 14 }}>
            ⚠ Motorschäden · 🛠 Wartungsrisiken · 💰 Preisfallen
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        style={{
          background: "#0e0e0e",
          color: "white",
          padding: "120px 40px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: 40,
              marginBottom: 80,
            }}
            className="fade-in"
          >
            Warum InseratCheck?
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 40,
            }}
          >
            {[
              {
                title: "⚠ Risiko-Erkennung",
                text: "Problemformulierungen, fehlende Angaben und versteckte Hinweise werden automatisch erkannt.",
              },
              {
                title: "🧠 KI-Analyse",
                text: "Datenlogik trifft Marktverständnis – strukturiert und objektiv bewertet.",
              },
              {
                title: "💰 Verhandlungsstärke",
                text: "Klare Argumente für Preisverhandlungen – sachlich und fundiert.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="fade-in"
                style={{
                  background: "#1a1a1a",
                  padding: 50,
                  borderRadius: 20,
                  border: "1px solid #222",
                  transition: "0.4s",
                  opacity: 0,
                  transform: "translateY(40px)",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget.style.transform = "translateY(-10px)"),
                  (e.currentTarget.style.boxShadow =
                    "0 25px 60px rgba(255,0,0,0.2)"))
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget.style.transform = "translateY(0px)"),
                  (e.currentTarget.style.boxShadow = "none"))
                }
              >
                <h3 style={{ marginBottom: 20 }}>{item.title}</h3>
                <p style={{ color: "#bbb" }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section
        style={{
          background: "#ffffff",
          padding: "120px 40px",
          textAlign: "center",
        }}
        className="fade-in"
      >
        <h2 style={{ fontSize: 36, marginBottom: 20 }}>
          Sicher. Legal. Geprüft.
        </h2>

        <p style={{ maxWidth: 700, margin: "0 auto", color: "#555" }}>
          InseratCheck kombiniert technische Analyse,
          KI-Logik und reale Markterfahrung –
          für mehr Transparenz beim Fahrzeugkauf.
        </p>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: "black",
          color: "white",
          padding: 40,
          textAlign: "center",
        }}
      >
        © {new Date().getFullYear()} InseratCheck
      </footer>
    </main>
  );
}
