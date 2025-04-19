'use client';

import { useState } from 'react';
import { useGenerateImageMutation } from '@/lib/hooks/mutations/use-generate-image-mutation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

export const PromptImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const generateImage = useGenerateImageMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateImage.mutateAsync({ prompt });
    setPrompt('');
  };

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-bold text-white'>Generate New Image</h2>
      <form onSubmit={handleSubmit} className='flex gap-2'>
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='Enter your prompt...'
          className='flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400'
          disabled={generateImage.isPending}
        />
        <Button
          type='submit'
          disabled={generateImage.isPending}
          className='bg-blue-600 hover:bg-blue-700 text-white'
        >
          {generateImage.isPending ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Generating...
            </>
          ) : (
            'Generate'
          )}
        </Button>
      </form>
    </div>
  );
};
