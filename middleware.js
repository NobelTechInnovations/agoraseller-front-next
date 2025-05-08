import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PUBLIC_PATHS = ['/unauthorized', '/api/auth', '/admin/login'];

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

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Not logged in, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  const role = token.user?.role;

  // Admin-only routes
  const adminRoutes = ['/admin/dashboard', '/admin/dashboard/'];

  if (adminRoutes.some(route => pathname.startsWith(route)) && role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // Technician-only routes
  // const technicianRoutes = ['/tracking', '/calendar'];

  // if (technicianRoutes.some(route => pathname.startsWith(route)) && role !== 'technician') {
  //   return NextResponse.redirect(new URL('/unauthorized', req.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
