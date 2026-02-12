'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { supabaseBrowser } from '@/lib/supabase';

export default function AuthCompletePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Completing sign in...');

  const code = searchParams.get('code');
  const next = useMemo(() => {
    const nextParam = searchParams.get('next');
    return nextParam && nextParam.startsWith('/') ? nextParam : '/home';
  }, [searchParams]);

  useEffect(() => {
    const run = async () => {
      if (!code) {
        router.replace('/login?error=missing_code');
        return;
      }

      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        setMessage('Sign in could not be completed. Redirecting back to login...');
        setTimeout(() => router.replace('/login?error=exchange_failed'), 1100);
        return;
      }

      router.replace(next);
    };

    run();
  }, [code, next, router]);

  return (
    <AppShell>
      <section className="mx-auto max-w-md rounded-xl border border-sky-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Signing you in</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{message}</p>
      </section>
    </AppShell>
  );
}
