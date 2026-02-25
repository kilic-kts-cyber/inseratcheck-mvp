import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

export function createMiddlewareSupabaseClient(request: NextRequest) {
  const accessToken = request.cookies.get('sb-access-token')?.value

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken ?? ''}`,
        },
      },
    }
  )
}
