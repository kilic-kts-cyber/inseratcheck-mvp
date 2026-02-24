"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabase();

    if (!supabase) {
      router.push("/login");
      return;
    }

    async function loadUser() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        router.push("/login");
        return;
      }

      setUser(session.user);
      setLoading(false);
    }

    loadUser();
  }, [router]);

  if (loading) return <div>Laden...</div>;

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Eingeloggt als: {user?.email}</p>
    </main>
  );
}
