'use server';

import { promptService } from '@/lib/services/PromptService';

export async function createPrompt({ prompt }: { prompt: string }) {
  return promptService.createPrompt({ prompt });
}

export async function updatePrompt({
  id,
  imageUrl
}: {
  id: string;
  imageUrl: string;
}) {
  return promptService.updatePrompt({ id, imageUrl });
}

export async function getRecentPrompts({ limit }: { limit?: number } = {}) {
  return promptService.getRecentPrompts({ limit });
}
