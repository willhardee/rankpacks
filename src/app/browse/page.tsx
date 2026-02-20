import { createClient } from '@supabase/supabase-js';
import { AppShell } from '@/components/app-shell';
import { BrowsePackList, type PublicPack } from '@/components/browse-pack-list';

type PublicPackRow = {
  id: string;
  title: string;
  created_at: string;
  submissions?: Array<{ count: number | null }> | null;
};

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

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false }
  });

  const { data, error } = await supabase
    .from('packs')
    .select('id, title, created_at, submissions(count)')
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .limit(50);

  const packs = ((data ?? []) as PublicPackRow[]).map((pack): PublicPack => ({
    id: pack.id,
    title: pack.title,
    created_at: pack.created_at,
    rankingsCount: pack.submissions?.[0]?.count ?? 0
  }));

  return (
    <AppShell>
      <section className="space-y-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Browse public packs</h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Discover the newest and most active public packs.</p>
        </div>

        {error ? (
          <p className="text-sm text-red-700 dark:text-red-300">Unable to load packs right now.</p>
        ) : (
          <BrowsePackList packs={packs} />
        )}
      </section>
    </AppShell>
  );
}
