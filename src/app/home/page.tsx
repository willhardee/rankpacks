import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { listPublicPacks } from '@/lib/core-flows';

export default async function HomePage() {
  const packs = await listPublicPacks();

  return (
    <AppShell>
      <section className="space-y-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <h1 className="text-2xl font-semibold">Home</h1>
          <p className="text-sm text-neutral-600">Jump into recent public packs or start your own.</p>
          <div className="mt-3 flex gap-2">
            <Link href="/packs/new"><Button>Create pack</Button></Link>
            <Link href="/explore"><Button variant="secondary">Explore</Button></Link>
          </div>
        </div>

        <section className="rounded-xl border border-neutral-200 bg-white p-4">
          <h2 className="text-base font-semibold">Recently created public packs</h2>
          <ul className="mt-3 space-y-2">
            {packs.slice(0, 8).map((pack) => (
              <li key={pack.id} className="rounded border bg-neutral-50 p-2">
                <Link href={`/p/${pack.id}`} className="font-medium">{pack.title}</Link>
                <p className="text-xs text-neutral-600">{pack.category}</p>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </AppShell>
  );
}
