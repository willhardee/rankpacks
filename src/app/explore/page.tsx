import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { listPublicPacks } from '@/lib/core-flows';

const categories = ['all', 'snacks', 'wine', 'fast-food', 'coffee', 'movies', 'custom'];

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const selectedCategory = categories.includes(category ?? '') ? (category as string) : 'all';
  const packs = await listPublicPacks(selectedCategory);

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Explore public packs</h1>
      <div className="flex flex-wrap gap-2 text-xs">
        {categories.map((entry) => (
          <Link key={entry} href={`/explore?category=${entry}`} className={`rounded-full border px-3 py-1 ${selectedCategory === entry ? 'bg-indigo-600 text-white' : ''}`}>
            {entry}
          </Link>
        ))}
      </div>
      {packs.length === 0 ? <p className="text-sm text-gray-500 mt-2">No public packs yet.</p> : (
        <ul className="space-y-2">
          {packs.map((pack) => (
            <li key={pack.id} className="rounded border p-3">
              <Link href={`/p/${pack.id}`} className="font-semibold">{pack.title}</Link>
              <p className="text-xs text-gray-500">{pack.category} · {pack.item_count} items · {new Date(pack.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
