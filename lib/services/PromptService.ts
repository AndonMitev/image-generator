import 'server-only';
import { authService } from './AuthService';
import { supabaseServerClient } from '../clients/supabase/supabaseServerClient';

class PromptService {
  private static instance: PromptService;

  private constructor() {}

  public static getInstance(): PromptService {
    if (!PromptService.instance) {
      PromptService.instance = new PromptService();
    }
    return PromptService.instance;
  }

  async createPrompt({ prompt }: { prompt: string }) {
    const user = await authService.checkAuth();

    const supabase = await supabaseServerClient();

    const { data, error } = await supabase
      .from('user_prompts')
      .insert({
        user_id: user.id,
        prompt_text: prompt
      })
      .select()
      .single();

    if (error) {
      console.error('[PromptService] Error creating prompt:', error);
      throw new Error(
        `[PromptService] Error creating prompt: ${error.message}`
      );
    }

    return data;
  }

  async updatePrompt({ id, imageUrl }: { id: string; imageUrl: string }) {
    const user = await authService.checkAuth();

    const supabase = await supabaseServerClient();
    console.log('[PromptService] Updating prompt:', id, imageUrl);
    console.log('[PromptService] User:', user);
    const { data, error } = await supabase
      .from('user_prompts')
      .update({ out_image_url: imageUrl })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('[PromptService] Error updating prompt:', error);
      throw new Error(
        `[PromptService] Error updating prompt: ${error.message}`
      );
    }

    return data;
  }

  async getRecentPrompts({ limit = 10 }: { limit?: number } = {}) {
    const user = await authService.checkAuth();

    const supabase = await supabaseServerClient();

    const { data, error } = await supabase
      .from('user_prompts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[PromptService] Error fetching prompts:', error);
      throw new Error(
        `[PromptService] Error fetching prompts: ${error.message}`
      );
    }

    return data.map((prompt) => ({
      id: prompt.id,
      prompt: prompt.prompt_text,
      imageUrl: prompt.out_image_url
    }));
  }
}

export const promptService = PromptService.getInstance();
