import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase/middleware'

function carryCookies(from: NextResponse, to: NextResponse) {
  for (const c of from.cookies.getAll()) {
    to.cookies.set(c)
  }
  return to
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const response = NextResponse.next()

  const supabase = createMiddlewareClient(request, response)

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const redirect = NextResponse.redirect(new URL('/login', request.url))
    return carryCookies(response, redirect)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, approved')
    .eq('id', user.id)
    .single()

  if (!profile) {
    const redirect = NextResponse.redirect(new URL('/login', request.url))
    return carryCookies(response, redirect)
  }

  const { role, approved } = profile

  if (pathname.startsWith('/dashboard')) {
    if (role !== 'customer') {
      return carryCookies(response, redirectByRole(role, approved, request))
    }
    return response
  }

  if (pathname.startsWith('/workshop')) {
    if (role !== 'workshop') {
      return carryCookies(response, redirectByRole(role, approved, request))
    }

    if (pathname.startsWith('/workshop/dashboard') && !approved) {
      const redirect = NextResponse.redirect(new URL('/workshop/pending', request.url))
      return carryCookies(response, redirect)
    }

    if (pathname.startsWith('/workshop/pending') && approved) {
      const redirect = NextResponse.redirect(new URL('/workshop/dashboard', request.url))
      return carryCookies(response, redirect)
    }

    return response
  }

  if (pathname.startsWith('/admin')) {
    if (role !== 'admin') {
      return carryCookies(response, redirectByRole(role, approved, request))
    }
    return response
  }

  return response
}

function redirectByRole(role: string, approved: boolean, request: NextRequest): NextResponse {
  if (role === 'customer') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (role === 'workshop') {
    return NextResponse.redirect(
      new URL(approved ? '/workshop/dashboard' : '/workshop/pending', request.url)
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
