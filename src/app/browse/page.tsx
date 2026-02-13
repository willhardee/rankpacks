import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { AppShell } from '@/components/app-shell';
import type { Database } from '@/types/db';

function formatCreatedAt(createdAt: string) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return 'Unknown date';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export default async function BrowsePage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return (
      <AppShell>
        <section className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Browse public packs</h1>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">Unable to load packs right now.</p>
        </section>
      </AppShell>
    );
  }

  const supabase = createClient<Database>(url, anonKey, {
    auth: { persistSession: false }
  });

  const { data: packs, error } = await supabase
    .from('packs')
    .select('id, title, created_at')
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <AppShell>
      <section className="space-y-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Browse public packs</h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Newest public packs from the community.</p>
        </div>

        {error ? (
          <p className="text-sm text-red-700 dark:text-red-300">Unable to load packs right now.</p>
        ) : packs && packs.length > 0 ? (
          <ul className="space-y-3">
            {packs.map((pack) => (
              <li key={pack.id}>
                <Link
                  href={`/packs/${pack.id}`}
                  className="block rounded-lg border border-neutral-200 bg-neutral-50 p-3 transition hover:border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
                >
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{pack.title}</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Created {formatCreatedAt(pack.created_at)}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">No public packs yet</p>
        )}
      </section>
    </AppShell>
  );
}
