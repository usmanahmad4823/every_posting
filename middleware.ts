import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Handle URL aliases for /login and /signup
  if (pathname === '/login') {
    const url = req.nextUrl.clone();
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  if (pathname === '/signup') {
    const url = req.nextUrl.clone();
    url.pathname = '/sign-up';
    return NextResponse.redirect(url);
  }

  // Read Supabase auth session token from cookies
  const hasAuthCookie = Array.from(req.cookies.getAll()).some(
    (c) => c.name.includes('sb-') && (c.name.includes('-auth-token') || c.name.includes('access-token'))
  );

  // If logged-in user with auth cookie opens /, redirect to /dashboard
  if (pathname === '/' && hasAuthCookie) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/account/:path*', '/login', '/signup'],
};
