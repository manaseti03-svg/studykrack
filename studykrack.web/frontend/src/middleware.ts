import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value
  const { pathname } = request.nextUrl

  // Protected Routes
  const isDashboard = pathname.startsWith('/dashboard')
  const isLanding = pathname === '/'

  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  if (isLanding && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/setup/:path*',
    '/forge/:path*',
    '/research/:path*',
    '/auth',
    '/api/search',
    '/api/forge',
    '/api/vision',
    '/api/metrics',
    '/api/syllabus',
    '/api/token',
    '/api/node/:path*'
  ]
};
