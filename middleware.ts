import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/clients/supabase/middleware';

// The middleware will run for all routes except for the ones specified in matcher
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

// Define routes that require authentication
export const config = {
  matcher: [
    // Exception routes - don't check auth for these paths
    '/((?!api|_next/static|_next/image|favicon.ico|login|auth).*)'
  ]
};
