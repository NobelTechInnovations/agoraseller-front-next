import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PUBLIC_PATHS = [
  '/unauthorized',
  '/api/auth',
  '/admin/login',
  '/seller/login',
];

const ADMIN_ONLY_PATHS = ['/admin/dashboard', '/admin/dashboard/'];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Skip middleware for public files and routes
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
      secureCookie: process.env.NODE_ENV === 'production',
    });

    console.log(token,'middleare');

    // If no token, and trying to access admin route, don't redirect to it
    if (!token) {
      if (pathname.startsWith('/admin')) {
        // If trying to access admin routes without login, do NOT redirect to admin login
        return NextResponse.redirect(new URL('/seller/login', req.url));
      }

      // Redirect all other paths to seller login
      const sellerLoginUrl = new URL('/seller/login', req.url);
      sellerLoginUrl.searchParams.set('callbackUrl', encodeURI(req.url));
      return NextResponse.redirect(sellerLoginUrl);
    }

    const role = token.user?.role;

    // If user is not admin, block access to admin routes
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // If seller tries to access admin dashboard directly
    if (ADMIN_ONLY_PATHS.some(path => pathname.startsWith(path)) && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/seller/login', req.url));
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/store-manage/:path*',
    '/onboarding',
    '/onboarding/:path*',
    '/seller/:path*',
  ],
};
