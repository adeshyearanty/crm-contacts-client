import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of paths that require authentication
const protectedPaths = [
  '/contacts',
  // Add other protected paths here
];

// List of paths that are public (no auth required)
const publicPaths = [
  '/login',
  '/register',
  // Add other public paths here
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  // Get the token from the cookies
  const token = request.cookies.get('auth_token');

  // If the path is protected and there's no token, redirect to login
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If user is logged in and tries to access login/register, redirect to contacts
  if (isPublicPath && token) {
    const contactsUrl = new URL('/contacts', request.url);
    return NextResponse.redirect(contactsUrl);
  }

  return NextResponse.next();
}

// Configure the paths that trigger the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};