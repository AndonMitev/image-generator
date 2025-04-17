'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  const { user, isLoading } = useAuth();

  return (
    <div className='flex flex-col items-center justify-center h-screen py-20 text-center'>
      <h1 className='text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl'>
        Welcome to ImageGen
      </h1>
      <p className='mt-6 max-w-3xl text-xl text-muted-foreground'>
        An AI-powered image generation platform
      </p>

      <div className='mt-10'>
        {isLoading ? (
          <p className='text-muted-foreground'>Loading...</p>
        ) : user ? (
          <div className='space-y-4'>
            <p className='text-xl'>
              Hello, <span className='font-medium'>{user.email}</span>
            </p>
            <Button asChild size='lg'>
              <Link href='/generate'>Generate Images</Link>
            </Button>
          </div>
        ) : (
          <div className='space-y-4'>
            <p className='text-muted-foreground'>
              Sign in using the sidebar to start generating images
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
