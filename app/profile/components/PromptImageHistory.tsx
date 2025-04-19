'use client';

import Image from 'next/image';
import { useRecentPromptsQuery } from '@/lib/hooks/queries/use-recent-prompts-query';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const PromptImageHistory = () => {
  const recentPrompts = useRecentPromptsQuery({ limit: 10 });

  console.log('[PromptImageHistory] recentPrompts:', recentPrompts);

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-bold text-white'>Recent Prompts</h2>
      {recentPrompts.isLoading ? (
        <div className='flex justify-center'>
          <Loader2 className='h-6 w-6 animate-spin text-white' />
        </div>
      ) : recentPrompts.data?.length ? (
        <PromptImageList prompts={recentPrompts.data} />
      ) : (
        <p className='text-center text-gray-400'>No prompts generated yet</p>
      )}
    </div>
  );
};

interface PromptItem {
  id: string;
  prompt: string;
  imageUrl: string | null;
}

const PromptImageItem = ({ prompt, imageUrl }: PromptItem) => {
  return (
    <Card className='p-4 space-y-2 bg-gray-800 border-gray-700'>
      {imageUrl && (
        <div className='relative w-full h-48'>
          <Image
            src={imageUrl}
            alt={prompt}
            fill
            className='object-cover rounded-md'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>
      )}
      <p className='text-sm text-gray-300'>{prompt}</p>
    </Card>
  );
};

const PromptImageList = ({ prompts }: { prompts: PromptItem[] }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {prompts.map((item) => (
        <PromptImageItem key={item.id} {...item} />
      ))}
    </div>
  );
};
