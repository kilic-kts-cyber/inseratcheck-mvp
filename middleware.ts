import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareSupabaseClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const supabase = createMiddlewareSupabaseClient(request)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, approved')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const { role, approved } = profile

  // Customer Bereich
  if (pathname.startsWith('/dashboard') && role !== 'customer') {
    return redirectByRole(role, approved, request)
  }

  // Workshop Bereich
  if (pathname.startsWith('/workshop')) {
    if (role !== 'workshop') {
      return redirectByRole(role, approved, request)
    }

    if (!approved && pathname !== '/workshop/pending') {
      return NextResponse.redirect(new URL('/workshop/pending', request.url))
    }

    if (approved && pathname === '/workshop/pending') {
      return NextResponse.redirect(new URL('/workshop/dashboard', request.url))
    }
  }

  // Admin Bereich
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return redirectByRole(role, approved, request)
  }

  return NextResponse.next()
}

function redirectByRole(
  role: string,
  approved: boolean,
  request: NextRequest
) {
  if (role === 'customer') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (role === 'workshop') {
    return NextResponse.redirect(
      new URL(
        approved ? '/workshop/dashboard' : '/workshop/pending',
        request.url
      )
    )
  }

  if (role === 'admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: ['/dashboard/:path*', '/workshop/:path*', '/admin/:path*'],
}
