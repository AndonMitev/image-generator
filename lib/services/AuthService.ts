import 'server-only';
import { supabaseServerClient } from '../clients/supabase/supabaseServerClient';
import { AuthError } from '@supabase/supabase-js';

class AuthService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async checkAuth() {
    const supabase = await supabaseServerClient();
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();

    if (error) {
      throw new AuthError('[AuthService] Authentication failed');
    }

    if (!user) {
      throw new AuthError('[AuthService] User is not authenticated');
    }

    return user;
  }
}

export const authService = AuthService.getInstance();
