'use client';

export const dynamic = 'force-dynamic';
export const revalidate = false;

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMsg(data?.error || 'Login fehlgeschlagen');
        return;
      }

      router.replace('/');
      router.refresh();
    } catch {
      setErrorMsg('Serverfehler beim Login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#f6f7f9' }}>
      <form
        onSubmit={handleLogin}
        style={{
          width: 360,
          padding: 20,
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          background: '#ffffff',
          boxShadow: '0 6px 22px rgba(0,0,0,0.06)',
        }}
      >
        <h1 style={{ margin: 0, marginBottom: 16, fontSize: 20, fontWeight: 700 }}>Anmelden</h1>

        <label style={{ display: 'block', fontSize: 12, marginBottom: 6 }}>E-Mail</label>
        <input
          type="email"
          placeholder="name@beispiel.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }}
        />

        <label style={{ display: 'block', fontSize: 12, marginBottom: 6 }}>Passwort</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }}
        />

        {errorMsg ? (
          <div
            style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#991B1B',
              padding: 10,
              borderRadius: 8,
              marginBottom: 12,
              fontSize: 13,
            }}
          >
            {errorMsg}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 10,
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Anmelden…' : 'Anmelden'}
        </button>
      </form>
    </main>
  );
}
