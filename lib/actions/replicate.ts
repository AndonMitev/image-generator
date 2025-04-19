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
  return replicateService.trainModel({
    zipUrl: data.zipUrl,
    triggerWord: data.triggerWord,
    destination: data.destination
  });
}

export async function generateImage({ prompt }: { prompt: string }) {
  return replicateService.generateImage({ prompt });
}
