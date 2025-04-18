'use server';

import { replicateService } from '@/lib/services/ReplicateService';

export async function createModel() {
  return replicateService.createModel();
}

export async function trainModel(data: {
  zipUrl: string;
  triggerWord: string;
  destination: string;
}) {
  return replicateService.trainModel(
    data.zipUrl,
    data.triggerWord,
    data.destination
  );
}

export async function generateImage(prompt: string, modelUrl: string) {
  return replicateService.generateImage(prompt, modelUrl);
}
