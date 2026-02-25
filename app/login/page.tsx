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
  const [message, setMessage] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Login erfolgreich');
        router.push('/');
      } else {
        setMessage(data.error || 'Login fehlgeschlagen');
      }

    } catch (err) {
      setMessage('Serverfehler');
    }

    setLoading(false);
  }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: '#f6f7f9',
      fontFamily: 'system-ui'
    }}>
      <form
        onSubmit={handleLogin}
        style={{
          padding: 40,
          background: '#ffffff',
          borderRadius: 12,
          boxShadow: '0 6px 22px rgba(0,0,0,0.06)',
          width: 320
        }}
      >
        <h1 style={{ marginBottom: 20 }}>Login</h1>

        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: 10,
            marginBottom: 10
          }}
        />

        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: 10,
            marginBottom: 10
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 10,
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: 8
          }}
        >
          {loading ? 'Wird geladen...' : 'Login'}
        </button>

        {message && (
          <div style={{ marginTop: 10 }}>
            {message}
          </div>
        )}
      </form>
    </main>
  );
}
