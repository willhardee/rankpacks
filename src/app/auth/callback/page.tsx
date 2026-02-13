'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const [message, setMessage] = useState('Signing you in...');
  const searchParams = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const code = searchParams.get('code');
      const next = searchParams.get('next');
      const safeNext = next && next.startsWith('/') ? next : '/home';
      if (!code) {
        window.location.href = safeNext;
        return;
      }

      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        setMessage('Could not complete sign in. Please try again.');
        return;
      }
      window.location.href = safeNext;
    };

    run();
  }, [searchParams]);

  return <main className="mx-auto max-w-lg p-8 text-sm text-slate-700 dark:text-slate-200">{message}</main>;
}
