"use client"

import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()

  const logout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>
      <p>Du bist eingeloggt.</p>

      <button onClick={logout}>
        Ausloggen
      </button>
    </div>
  )
}
