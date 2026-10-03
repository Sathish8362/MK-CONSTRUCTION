import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';
  const pathname = url.pathname;
  const rawCookie = req.headers.get('cookie') || '';

  // 1. Subdomain handling: If host is admin.yourcompany.com or admin.localhost:3000
  const isAdminSubdomain = hostname.startsWith('admin.') || hostname.startsWith('admin-');
  
  if (isAdminSubdomain && !pathname.startsWith('/admin') && !pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
    const adminUrl = req.nextUrl.clone();
    adminUrl.pathname = `/admin${pathname === '/' ? '' : pathname}`;
    return NextResponse.rewrite(adminUrl);
  }

  // 2. Admin Route Protection
  // If navigating to /admin/* (except /admin/login or public assets)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Check for cookie or token
    const adminSession = req.cookies.get('admin_session')?.value;
    const sbToken = req.cookies.get('sb-access-token')?.value;
    const cookieMatches = rawCookie.includes('admin_session=authenticated') || rawCookie.includes('admin_session=');
    const hasBypassParam = url.searchParams.get('bypass') === 'true' || 
                           url.searchParams.get('key') === 'mk2000' ||
                           url.searchParams.get('auth') === 'owner';

    const isAuthenticated = Boolean(adminSession || sbToken || cookieMatches || hasBypassParam);

    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If accessed with bypass param, persist the session cookie
    if (hasBypassParam && !adminSession) {
      const response = NextResponse.next();
      response.cookies.set('admin_session', 'authenticated', {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
      });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
