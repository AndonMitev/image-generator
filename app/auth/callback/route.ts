import { NextRequest, NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/clients/supabase/supabaseServerClient';

export async function GET(req: NextRequest) {
  // Get the code from the URL
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get('code');
  const redirectTo = requestUrl.searchParams.get('next') || '/profile';

  // Create a response object that redirects to the profile page by default
  const response = NextResponse.redirect(new URL(redirectTo, req.url));
  const supabase = await supabaseServerClient();

  if (code) {
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);
  }

  return response;
}
