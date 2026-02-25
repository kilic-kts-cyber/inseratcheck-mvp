export const revalidate = false;
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#f6f7f9',
        fontFamily: 'system-ui'
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
        <h1 style={{ marginBottom: 20 }}>Login Seite funktioniert</h1>

        <a
          href="/"
          style={{
            padding: '10px 20px',
            background: '#2563eb',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 8,
            fontWeight: 600
          }}
        >
          Zurück
        </a>
      </div>
    </main>
  );
}
