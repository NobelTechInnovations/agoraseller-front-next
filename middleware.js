import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PUBLIC_PATHS = ['/unauthorized', '/api/auth', '/admin/login', '/onboarding'];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Skip public files or paths
  if (
    PUBLIC_PATHS.some(path => pathname.startsWith(path)) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images')
  ) {
    return NextResponse.next();
  }

  try {
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === 'production'
    });

    // Not logged in, redirect to login
    if (!token) {
      const url = new URL('/admin/login', req.url);
      url.searchParams.set('callbackUrl', encodeURI(req.url));
      return NextResponse.redirect(url);
    }

    const role = token.user?.role;

    // Admin-only routes
    const adminRoutes = ['/admin/dashboard', '/admin/dashboard/'];

    if (adminRoutes.some(route => pathname.startsWith(route)) && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, redirect to login
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/store-manage/:path*',
    '/onboarding/:path*'
  ],
};
