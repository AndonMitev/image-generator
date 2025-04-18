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

  async trainModel(
    input_images: string,
    trigger_word: string,
    destination: string
  ) {
    await authService.checkAuth();

    const supabase = await supabaseServerClient();

    const { data, error } = await supabase.functions.invoke('train-model', {
      body: JSON.stringify({
        input_images,
        trigger_word,
        destination
      })
    });

    console.log('data', data);
    console.log('error', error);

    if (error) {
      console.error(
        '[AIModelService] Error invoking train-model function:',
        error
      );
      throw new Error(
        `[AIModelService] Failed to train model: ${error.message}`
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
        '[AIModelService] Error invoking create-model function:',
        error
      );
      throw new Error(
        `[AIModelService] Failed to create model: ${error.message}`
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

  async generateImage(prompt: string, modelUrl: string) {
    await authService.checkAuth();

    const supabase = await supabaseServerClient();

    const { data, error } = await supabase.functions.invoke('send-prompt', {
      body: JSON.stringify({
        prompt,
        modelUrl
      })
    });

    if (error) {
      console.error(
        '[AIModelService] Error invoking send-prompt function:',
        error
      );
      throw new Error(
        `[AIModelService] Failed to generate image: ${error.message}`
      );
    }

    return data;
  }
}

export const replicateService = ReplicateService.getInstance();
