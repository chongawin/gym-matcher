import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Pages only for guests (logged-out users)
const GUEST_ONLY_PATHS = ['/login', '/signup']
// Page only for logged-in users with incomplete profile
const ONBOARDING_PATH = '/onboarding'

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-next-pathname', pathname)
  requestHeaders.set('x-next-search-params', request.nextUrl.searchParams.toString())

  const isFrontendPath = !pathname.startsWith('/api') && !pathname.startsWith('/admin')
  if (!isFrontendPath) {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  const isLoggedIn = request.cookies.get('auth_logged_in')?.value === '1'
  const isProfileComplete = request.cookies.get('profile_complete')?.value === '1'

  const isGuestOnlyPath = GUEST_ONLY_PATHS.some((p) => pathname.startsWith(p))
  const isOnboardingPath = pathname.startsWith(ONBOARDING_PATH)

  // Logged-in + profile complete → block login, signup, onboarding; redirect / to /profile
  if (isLoggedIn && isProfileComplete && (isGuestOnlyPath || isOnboardingPath)) {
    const url = request.nextUrl.clone()
    url.pathname = '/profile'
    return NextResponse.redirect(url)
  }

  if (isLoggedIn && isProfileComplete && pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/profile'
    return NextResponse.redirect(url)
  }

  // Logged-in + profile incomplete → force onboarding (except on onboarding itself)
  if (isLoggedIn && !isProfileComplete && !isOnboardingPath && !isGuestOnlyPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/onboarding'
    return NextResponse.redirect(url)
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

