import 'server-only';

import { supabaseServerClient } from '@/lib/clients/supabase/supabaseServerClient';
import { authService } from './AuthService';
import { profileService } from './ProfileService';
import { after } from 'next/server';

class ReplicateService {
  private static instance: ReplicateService;

  public static getInstance(): ReplicateService {
    if (!ReplicateService.instance) {
      ReplicateService.instance = new ReplicateService();
    }
    return ReplicateService.instance;
  }

  async trainModel({
    zipUrl,
    triggerWord,
    destination
  }: {
    zipUrl: string;
    triggerWord: string;
    destination: string;
  }) {
    await authService.checkAuth();

    const supabase = await supabaseServerClient();

    const { data, error } = await supabase.functions.invoke('train-model', {
      body: JSON.stringify({
        input_images: zipUrl,
        trigger_word: triggerWord,
        destination
      })
    });

    if (error) {
      console.error(
        '[ReplicateService] Error invoking train-model function:',
        error
      );
      throw new Error(
        `[ReplicateService] Failed to train model: ${error.message}`
      );
    }

    return data;
  }

  async createModel() {
    const user = await authService.checkAuth();

    const supabase = await supabaseServerClient();

    const modelName = user.email?.replace('@', '.');
    const { data, error } = await supabase.functions.invoke('create-model', {
      body: JSON.stringify({
        name: modelName
      })
    });

    if (error) {
      console.error(
        '[ReplicateService] Error invoking create-model function:',
        error
      );
      throw new Error(
        `[ReplicateService] Failed to create model: ${error.message}`
      );
    }

    // Background job to update `model_url`
    after(async () => {
      await profileService.updateProfile({
        modelUrl: data.url
      });
    });

    return data;
  }

  async generateImage({ prompt }: { prompt: string }) {
    await authService.checkAuth();

    const supabase = await supabaseServerClient();

    const user = await profileService.getProfile();

    const { data, error } = await supabase.functions.invoke('send-prompt', {
      body: JSON.stringify({
        prompt,
        modelUrl: user.model_url
      })
    });

    if (error) {
      console.error(
        '[ReplicateService] Error invoking send-prompt function:',
        error
      );
      throw new Error(
        `[ReplicateService] Failed to generate image: ${error.message}`
      );
    }

    return data?.output?.[0];
  }
}

export const replicateService = ReplicateService.getInstance();
