import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { FunBadge } from '@/components/fun-badge';

const trendingPacks = [
  { title: 'City Coffee Tasting', members: 18, status: 'Open for ranking' },
  { title: 'Late Night Snack Draft', members: 24, status: 'Reveal tonight' },
  { title: 'Weekend Movie Picks', members: 11, status: 'Collecting votes' }
];

const friendsActivity = [
  'Alex joined Late Night Snack Draft',
  'Sam submitted ranking in City Coffee Tasting',
  'Jordan revealed results in Friday Lunch Picks'
];

export default function DashboardPage() {
  return (
    <AppShell>
      <section className="card-pop rounded-xl border border-neutral-200 bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Product dashboard</h1>
            <p className="mt-1 text-sm text-neutral-600">Track what is trending, start a new pack, and follow friend activity.</p>
          </div>
          <FunBadge />
        </div>
        <div className="mt-4 flex gap-2">
          <Link href="/packs/new"><Button>Start a Rank Pack</Button></Link>
          <Link href="/explore"><Button variant="secondary">Browse packs</Button></Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-neutral-200 bg-white p-4">
          <h2 className="text-base font-semibold text-neutral-900">Trending packs</h2>
          <ul className="mt-3 space-y-2">
            {trendingPacks.map((pack) => (
              <li key={pack.title} className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                <p className="text-sm font-medium text-neutral-900">{pack.title}</p>
                <p className="text-xs text-neutral-600">{pack.members} members · {pack.status}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border border-neutral-200 bg-white p-4">
          <h2 className="text-base font-semibold text-neutral-900">Friends activity</h2>
          <ul className="mt-3 space-y-2">
            {friendsActivity.map((item) => (
              <li key={item} className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700">{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </AppShell>
  );
}
