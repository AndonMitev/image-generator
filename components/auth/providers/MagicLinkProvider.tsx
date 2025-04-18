'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

type FormData = z.infer<typeof formSchema>;

export interface AuthProviderProps {
  onSuccess?: (email: string) => void;
}

export function MagicLinkProvider({ onSuccess }: AuthProviderProps) {
  const { signInWithMagicLink } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'button' | 'form' | 'success'>('button');
  const [email, setEmail] = useState('');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const { error } = await signInWithMagicLink(data.email);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Magic link sent! Check your email.');
      setEmail(data.email);
      setView('success');

      if (onSuccess) {
        onSuccess(data.email);
      }
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
      >
        <Mail className='h-4 w-4' />
        <span>Continue with Magic Link</span>
      </Button>
    );
  }

  // Success view
  if (view === 'success') {
    return (
      <div className='space-y-4 text-center'>
        <h2 className='text-xl font-semibold'>Check your email</h2>
        <p className='text-muted-foreground'>
          We&apos;ve sent a magic link to {email}. Click the link to sign in.
        </p>
        <Button
          variant='outline'
          onClick={() => setView('form')}
          className='w-full'
        >
          Use a different email
        </Button>
      </div>
    );
  }

  // Form view
  return (
    <div className='space-y-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='your@email.com' type='email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Magic Link'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
