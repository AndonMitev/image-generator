'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription
} from '@/components/ui/dialog';

// Direct imports of providers
import { MagicLinkProvider } from './providers/MagicLinkProvider';
import { GoogleProvider } from './providers/GoogleProvider';
import { TwitterProvider } from './providers/TwitterProvider';

export function AuthenticationDialog({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-center'>Sign in to ImageGen</DialogTitle>
          <DialogDescription className='text-center'>
            Choose your preferred sign in method
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-3 py-4'>
          <MagicLinkProvider />
          <GoogleProvider onBack={onClose} />
          <TwitterProvider onBack={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
