import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { listPublicPacks } from '@/lib/core-flows';

export default async function HomePage() {
  const packs = await listPublicPacks({ sort: 'recent' });

  return (
    <AppShell>
      <section className="space-y-4 card-pop">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 offset-shadow dark:border-neutral-800 dark:bg-neutral-900">
          <h1 className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Public packs right now</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Browse recent packs or start your own.</p>
          <div className="mt-3 flex gap-2">
            <Link href="/packs/new"><Button>Start a rank pack</Button></Link>
            <Link href="/explore"><Button variant="secondary">Open Explore</Button></Link>
          </div>
        </div>

        <section className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Trending public packs</h2>
          {packs.length === 0 ? (
            <p className="mt-2 text-sm text-neutral-500">No public packs yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {packs.slice(0, 6).map((pack) => (
                <li key={pack.id} className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800">
                  <Link href={`/p/${pack.id}`} className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{pack.title}</Link>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">{pack.category} • {pack.items_count} item(s)</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </AppShell>
  );
}
