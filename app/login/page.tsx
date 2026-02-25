'use client';

export const dynamic = 'force-dynamic';
export const revalidate = false;

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

function withTimeout<T>(p: Promise<T>, ms: number) {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('Zeitüberschreitung beim Login (Timeout).')), ms);
    p.then((v) => {
      clearTimeout(t);
      resolve(v);
    }).catch((e) => {
      clearTimeout(t);
      reject(e);
    });
  });
}

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClientComponentClient(), []);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const { error } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        15000
      );

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      router.replace('/');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Unbekannter Fehler beim Login.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <form
        onSubmit={onSubmit}
        style={{
          width: 360,
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: 20,
          background: '#fff',
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Anmelden</h1>

        <label style={{ display: 'block', fontSize: 12, marginBottom: 6 }}>E-Mail</label>
        <input
          type="email"
          value={email}
          onChange={(v) => setEmail(v.target.value)}
          placeholder="name@beispiel.de"
          required
          autoComplete="email"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: 8,
            marginBottom: 12,
          }}
        />

        <label style={{ display: 'block', fontSize: 12, marginBottom: 6 }}>Passwort</label>
        <input
          type="password"
          value={password}
          onChange={(v) => setPassword(v.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: 8,
            marginBottom: 12,
          }}
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
              lineHeight: 1.3,
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
            padding: '10px 12px',
            borderRadius: 8,
            border: 'none',
            background: '#2563EB',
            color: '#fff',
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
