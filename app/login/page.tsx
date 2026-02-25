"use client";

export const dynamic = "force-dynamic";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = getSupabase();

      const { data, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      console.log("LOGIN DATA:", data);
      console.log("LOGIN ERROR:", authError);

      if (authError) {
        setError(authError.message);
        return;
      }

      if (!data.session) {
        setError("Keine Session erhalten.");
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("LOGIN CATCH ERROR:", err);
      setError("Ein Fehler ist aufgetreten.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Wird eingeloggt..." : "Einloggen"}
        </button>
      </form>
    </main>
  );
}
