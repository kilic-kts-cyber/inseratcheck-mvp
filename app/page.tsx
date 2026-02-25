export const revalidate = false;
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#f6f7f9',
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif'
      }}
    >
      <div
        style={{
          padding: 40,
          background: '#ffffff',
          borderRadius: 12,
          boxShadow: '0 6px 22px rgba(0,0,0,0.06)',
          textAlign: 'center'
        }}
      >
        <h1 style={{ marginBottom: 16 }}>InseratCheck</h1>
        <p style={{ marginBottom: 24 }}>
          System läuft.
        </p>

        <a
          href="/login"
          style={{
            padding: '10px 20px',
            background: '#2563eb',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 8,
            fontWeight: 600
          }}
        >
          Zum Login
        </a>
      </div>
    </main>
  );
}
