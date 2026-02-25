export const dynamic = 'force-dynamic';
export const revalidate = false;

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        fontFamily: 'system-ui',
        background: '#f6f7f9'
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
        <h1>Startseite funktioniert</h1>

        <a
          href="/login"
          style={{
            display: 'inline-block',
            marginTop: 20,
            padding: '10px 20px',
            background: '#2563eb',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 8
          }}
        >
          Login
        </a>
      </div>
    </main>
  );
}
