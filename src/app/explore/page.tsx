import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { listPublicPacks } from '@/lib/core-flows';

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ category?: string; sort?: 'recent' | 'oldest' }> }) {
  const { category = 'all', sort = 'recent' } = await searchParams;
  const packs = await listPublicPacks({ category, sort });

  return (
    <AppShell>
      <section className="space-y-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Explore public packs</h1>
          <form className="mt-3 flex flex-wrap gap-2" method="get">
            <select name="category" defaultValue={category} className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900">
              <option value="all">All categories</option>
              <option value="snacks">Snacks</option>
              <option value="wine">Wine</option>
              <option value="fast-food">Fast food</option>
              <option value="coffee">Coffee</option>
              <option value="movies">Movies</option>
              <option value="custom">Custom</option>
            </select>
            <select name="sort" defaultValue={sort} className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900">
              <option value="recent">Most recent</option>
              <option value="oldest">Oldest</option>
            </select>
            <button type="submit" className="rounded-md border border-indigo-600 px-3 py-2 text-sm font-medium text-indigo-700 dark:text-indigo-300">Apply</button>
          </form>
        </div>

        {packs.length === 0 ? (
          <p className="text-sm text-neutral-500">No public packs yet.</p>
        ) : (
          <ul className="space-y-2">
            {packs.map((pack) => (
              <li key={pack.id} className="rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-900">
                <Link href={`/p/${pack.id}`} className="font-semibold text-neutral-900 dark:text-neutral-100">{pack.title}</Link>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">{pack.category} • {new Date(pack.created_at).toLocaleDateString()} • {pack.items_count} item(s)</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
