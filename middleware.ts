import { auth0 } from './lib/auth0';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    const session = await auth0.getSession(request);
    if (!session) {
      return NextResponse.redirect(new URL('/api/auth/login', request.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.error('Auth0 middleware error:', error);
    return NextResponse.redirect(new URL('/api/auth/login', request.url));
  }
}

export const config = {
  matcher: [
    '/manager',
    '/worker'
  ],
};
