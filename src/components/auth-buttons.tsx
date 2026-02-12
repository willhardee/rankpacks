'use client';

import { supabaseBrowser } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

const redirectFor = (next?: string) => {
  const cleanNext = next?.startsWith('/') ? next : '/home';
  return `${appUrl}/auth/callback?next=${encodeURIComponent(cleanNext)}`;
};

export function AuthButtons({ next = '/home', compact = false }: { next?: string; compact?: boolean }) {
  const login = async (provider: 'google' | 'facebook') => {
    const supabase = supabaseBrowser();
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectFor(next)
      }
    });
  };

  return (
    <div className={compact ? 'flex gap-2' : 'space-y-2'}>
      <Button type="button" onClick={() => login('google')} className={compact ? 'px-3 py-1.5' : 'w-full'}>
        Continue with Google
      </Button>
      <Button type="button" variant="secondary" onClick={() => login('facebook')} className={compact ? 'px-3 py-1.5' : 'w-full'}>
        Continue with Facebook
      </Button>
    </div>
  );
}
