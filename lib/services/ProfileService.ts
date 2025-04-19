import 'server-only';

import { authService } from './AuthService';
import { supabaseServerClient } from '../clients/supabase/supabaseServerClient';
import { Profile } from '../types/profile';

class ProfileService {
  private static instance: ProfileService;

  public static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  async updateProfile({ modelUrl, triggerWord }: Profile) {
    const user = await authService.checkAuth();
    const supabase = await supabaseServerClient();
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...(modelUrl && { model_url: modelUrl }),
        ...(triggerWord && { trigger_word: triggerWord })
      })
      .eq('id', user.id);

    if (error) {
      console.error('[ProfileService] Error updating profile:', error);
      throw new Error(error.message);
    }

    return data;
  }

  async getProfile() {
    const user = await authService.checkAuth();
    const supabase = await supabaseServerClient();

    const { data, error } = await supabase
      .from('profiles')
      .select(
        `
          model_url,
          trigger_word
        `
      )
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('[ProfileService] Error getting profile:', error);
      throw new Error(
        `[ProfileService] Error getting profile: ${error.message}`
      );
    }

    return {
      ...data,
      email: user.email
    };
  }
}

export const profileService = ProfileService.getInstance();
