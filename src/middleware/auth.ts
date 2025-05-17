import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function verifyAuth(request: NextRequest) {
  // Try to get token from cookies first
  let token = request.cookies.get('access_token')?.value;

  // Fallback to Authorization header if no cookie
  if (!token) {
    token = request.headers.get('Authorization')?.split(' ')[1];
  }

  if (!token) {
    return false;
  }

  try {
    // Verify the JWT token
    // Replace 'your-secret-key' with your actual JWT secret key
    const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? 'your-secret-key');
    await jwtVerify(token, secret);
    return true;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

export function unauthorized() {
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  );
}