import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  const { pathname } = request.nextUrl

  // Protected Routes
  const isDashboard = pathname.startsWith('/dashboard')
  const isLanding = pathname === '/'

  if (isDashboard && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isLanding && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
}
