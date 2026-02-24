"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (!error) {
      alert("Registrierung erfolgreich. Bitte Email bestätigen.")
    } else {
      alert(error.message)
    }
  }

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!error) {
      router.push("/dashboard")
    } else {
      alert(error.message)
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          background: "white",
          padding: 40,
          borderRadius: 8,
          boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
          width: 320,
        }}
      >
        <h2 style={{ marginBottom: 20 }}>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 20 }}
        />

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={signIn}
            style={{
              flex: 1,
              padding: 10,
              background: "black",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Einloggen
          </button>

          <button
            onClick={signUp}
            style={{
              flex: 1,
              padding: 10,
              background: "#e5e5e5",
              border: "none",
              cursor: "pointer",
            }}
          >
            Registrieren
          </button>
        </div>
      </div>
    </div>
  )
}
