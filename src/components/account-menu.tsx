'use client';

import { useEffect, useState } from 'react';
import { UserRound } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase';

export function AccountMenu() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = supabaseBrowser();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (!email) {
    return (
      <a
        href="/login?next=/home"
        className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      >
        <UserRound className="h-3.5 w-3.5" /> Account
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
    >
      <UserRound className="h-3.5 w-3.5" /> Sign out
    </button>
  );
}
