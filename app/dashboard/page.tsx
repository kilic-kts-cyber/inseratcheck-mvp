'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push('/login')
      }
    }

    checkUser()
  }, [router])

  return (
    <main style={{ padding: 40 }}>
      <h1>Dashboard</h1>
      <p>Du bist eingeloggt.</p>
    </main>
  )
}
