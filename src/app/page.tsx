import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <AppShell>
      <section className="space-y-6">
        <h1 className="text-4xl font-bold">RankPacks helps groups decide faster.</h1>
        <p className="text-gray-600">Create snack, wine, fast-food, or custom packs. Invite friends. Rank quickly. Reveal consensus and share the results.</p>
        <Link href="/packs/new"><Button>Create a pack</Button></Link>
        <div className="rounded-lg border bg-white p-4">
          <h2 className="font-semibold">How it works</h2>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-gray-600">
            <li>Create your pack and add items.</li>
            <li>Invite friends by link or email.</li>
            <li>Everyone ranks and submits.</li>
            <li>Reveal consensus ranking + insights.</li>
          </ol>
        </div>
      </section>
    </AppShell>
  );
}
