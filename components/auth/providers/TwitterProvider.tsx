'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Twitter } from 'lucide-react';
import { toast } from 'sonner';

export interface AuthProviderProps {
  onBack?: () => void;
  onSuccess?: (email: string) => void;
}

export function TwitterProvider({ onBack }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'button' | 'form'>('button');

  const handleTwitterSignIn = async () => {
    setIsLoading(true);
    try {
      // This would be implemented when Twitter auth is added to Supabase
      toast.info('Twitter authentication will be available soon');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Button view (initial state)
  if (view === 'button') {
    return (
      <Button
        variant='outline'
        className='w-full flex items-center justify-start gap-2 h-12'
        onClick={() => setView('form')}
        disabled
      >
        <Twitter className='h-4 w-4 text-blue-400' />
        <span>Continue with Twitter</span>
        <span className='ml-auto text-xs text-muted-foreground'>
          (Coming soon)
        </span>
      </Button>
    );
  }

  // Form view
  return (
    <div className='space-y-4'>
      {onBack && (
        <Button
          variant='ghost'
          size='sm'
          className='mb-2 -ml-3'
          onClick={onBack}
        >
          ← Back
        </Button>
      )}

      <div className='py-4 text-center'>
        <div className='mx-auto w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-blue-50'>
          <Twitter className='h-6 w-6 text-blue-400' />
        </div>
        <h3 className='text-lg font-medium mb-2'>Twitter Authentication</h3>
        <p className='text-sm text-muted-foreground mb-4'>
          Twitter authentication is coming soon. We're working on integrating
          Twitter Sign-In into our platform.
        </p>
        <Button
          className='w-full'
          disabled={true}
          onClick={handleTwitterSignIn}
        >
          {isLoading ? 'Connecting...' : 'Continue with Twitter'}
        </Button>
      </div>
    </div>
  );
}
