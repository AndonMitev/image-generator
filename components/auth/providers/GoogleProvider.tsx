'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export interface AuthProviderProps {
  onBack?: () => void;
  onSuccess?: (email: string) => void;
}

export function GoogleProvider({ onBack }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'button' | 'form'>('button');

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // This would be implemented when Google auth is added to Supabase
      toast.info('Gmail authentication will be available soon');
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
        <svg
          xmlns='http://www.w3.org/2000/svg'
          height='16'
          width='16'
          viewBox='0 0 488 512'
          className='h-4 w-4 text-red-500'
        >
          <path
            fill='currentColor'
            d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z'
          />
        </svg>
        <span>Continue with Google</span>
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
        <div className='mx-auto w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-slate-100'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            height='24'
            width='24'
            viewBox='0 0 488 512'
            className='h-6 w-6'
          >
            <path
              fill='#EA4335'
              d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z'
            />
          </svg>
        </div>
        <h3 className='text-lg font-medium mb-2'>Gmail Authentication</h3>
        <p className='text-sm text-muted-foreground mb-4'>
          Gmail authentication is coming soon. We're working on integrating
          Gmail Sign-In into our platform.
        </p>
        <Button className='w-full' disabled={true} onClick={handleGoogleSignIn}>
          {isLoading ? 'Connecting...' : 'Continue with Gmail'}
        </Button>
      </div>
    </div>
  );
}
