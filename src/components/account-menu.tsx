'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronDown, LogOut, UserRound } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase';

type AccountState = { email: string | null; loading: boolean };

export function AccountMenu() {
  const [open, setOpen] = useState(false);
  const [account, setAccount] = useState<AccountState>({ email: null, loading: true });

  useEffect(() => {
    const supabase = supabaseBrowser();

    supabase.auth.getUser().then(({ data }) => {
      setAccount({ email: data.user?.email ?? null, loading: false });
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAccount({ email: session?.user?.email ?? null, loading: false });
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (account.loading) {
    return <div className="h-8 w-20 rounded-md bg-sky-100 dark:bg-slate-800" aria-hidden />;
  }

  if (!account.email) {
    return (
      <Link
        href="/login?next=/home"
        className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      >
        <UserRound className="h-3.5 w-3.5" /> Sign in
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      >
        <UserRound className="h-3.5 w-3.5" /> Account <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-56 rounded-lg border border-sky-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <p className="truncate px-2 py-1 text-xs text-slate-500 dark:text-slate-400">{account.email}</p>
          <button
            type="button"
            onClick={signOut}
            className="mt-1 inline-flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs font-medium text-slate-700 hover:bg-sky-50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
