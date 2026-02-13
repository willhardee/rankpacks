import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { listPublicPacks } from '@/lib/core-flows';

export default async function DashboardPage() {
  const trendingPacks = await listPublicPacks();

  return (
    <AppShell>
      <section className="card-pop rounded-xl border border-neutral-200 bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="mt-1 text-sm text-neutral-600">Create a new rank pack or browse public packs.</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Link href="/packs/new"><Button>Start a Rank Pack</Button></Link>
          <Link href="/explore"><Button variant="secondary">Browse packs</Button></Link>
        </div>
      </section>

      <article className="rounded-xl border border-neutral-200 bg-white p-4">
        <h2 className="text-base font-semibold">Latest public packs</h2>
        <ul className="mt-3 space-y-2">
          {trendingPacks.slice(0, 6).map((pack) => (
            <li key={pack.id} className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
              <Link href={`/p/${pack.id}`} className="text-sm font-medium">{pack.title}</Link>
              <p className="text-xs text-neutral-600">{pack.category} · {new Date(pack.created_at).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </article>
    </AppShell>
  );
}
