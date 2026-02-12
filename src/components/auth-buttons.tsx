'use client';

import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

const redirectFor = (next?: string) => {
  const cleanNext = next?.startsWith('/') ? next : '/home';
  const origin = typeof window !== 'undefined' ? window.location.origin : appUrl ?? 'http://localhost:3000';
  return `${origin}/auth/callback?next=${encodeURIComponent(cleanNext)}`;
};

export function AuthButtons({ next = '/home', compact = false }: { next?: string; compact?: boolean }) {
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'facebook' | null>(null);
  const [error, setError] = useState('');

  const login = async (provider: 'google' | 'facebook') => {
    setError('');
    setLoadingProvider(provider);
    const supabase = supabaseBrowser();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectFor(next)
      }
    });

    if (oauthError) {
      setError(oauthError.message || 'Unable to start sign in. Please try again.');
      setLoadingProvider(null);
    }
  };

  return (
    <div className={compact ? 'flex flex-col gap-2 sm:flex-row' : 'space-y-2'}>
      <Button
        type="button"
        onClick={() => login('google')}
        className={compact ? 'px-3 py-1.5' : 'w-full'}
        disabled={loadingProvider !== null}
      >
        {loadingProvider === 'google' ? 'Connecting Google...' : 'Continue with Google'}
      </Button>
      <Button
        type="button"
        variant="secondary"
        onClick={() => login('facebook')}
        className={compact ? 'px-3 py-1.5' : 'w-full'}
        disabled={loadingProvider !== null}
      >
        {loadingProvider === 'facebook' ? 'Connecting Facebook...' : 'Continue with Facebook'}
      </Button>
      {error ? <p className="text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
