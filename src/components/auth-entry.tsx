'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AuthButtons } from '@/components/auth-buttons';
import { Button } from '@/components/ui/button';
import { supabaseBrowser } from '@/lib/supabase';

const errorMessage = (error?: string) => {
  if (error === 'missing_code') return 'The login callback was missing required information. Please try again.';
  if (error === 'exchange_failed') return 'We could not complete sign in. Please retry your provider.';
  return '';
};

export function AuthEntry({ next = '/home', error }: { next?: string; error?: string }) {
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const check = async () => {
      const supabase = supabaseBrowser();
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        window.location.href = next.startsWith('/') ? next : '/home';
        return;
      }
      setCheckingSession(false);
    };

    check();
  }, [next]);

  if (checkingSession) {
    return (
      <section className="mx-auto max-w-md rounded-xl border border-sky-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Checking your account</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">One moment while we verify your session.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md rounded-xl border border-sky-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Welcome to RankPacks</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Sign in to sync your rankings, follow friends, and pick up where you left off.</p>

      <div className="mt-4">
        <AuthButtons next={next} />
      </div>

      {errorMessage(error) ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{errorMessage(error)}</p> : null}

      <div className="mt-4 border-t border-sky-100 pt-4 dark:border-slate-800">
        <p className="text-xs text-slate-500 dark:text-slate-400">Just browsing? You can still join and rank as a guest.</p>
        <Link href={next.startsWith('/') ? next : '/home'} className="mt-2 inline-block">
          <Button type="button" variant="ghost">Continue as guest</Button>
        </Link>
      </div>
    </section>
  );
}
