'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/clients/supabase/supabaseBrowserClient';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Routes } from '@/lib/constants';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signInWithMagicLink: (email: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  getUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  signInWithMagicLink: async () => ({ error: null }),
  signOut: async () => ({ error: null }),
  getUser: async () => null
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Auth helper functions
  const signInWithMagicLink = async (email: string) => {
    const { error } = await createClient().auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    return { error };
  };

  const signOut = async () => {
    const { error } = await createClient().auth.signOut();
    if (!error) {
      // Redirect to home page after successful sign out
      router.push(Routes.HOME);
    }
    return { error };
  };

  const getSession = async () => {
    return await createClient().auth.getSession();
  };

  const getUser = async () => {
    const {
      data: { session }
    } = await getSession();
    return session?.user ?? null;
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const {
          data: { session }
        } = await getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    // Set up auth state change listener
    const {
      data: { subscription }
    } = createClient().auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      // If user signs out, redirect to home page
      if (event === 'SIGNED_OUT') {
        router.push(Routes.HOME);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        signInWithMagicLink,
        signOut,
        getUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
