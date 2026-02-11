import Link from 'next/link';
import { AppShell } from '@/components/app-shell';

export default function HomePage() {
  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <section className="rounded-lg border bg-white p-4">
          <h2 className="font-medium">Your packs</h2>
          <p className="text-sm text-gray-500">Start your first pack.</p>
          <Link href="/packs/new" className="text-sm text-primary">Create pack →</Link>
        </section>
        <section className="rounded-lg border bg-white p-4">
          <h2 className="font-medium">Invited packs</h2>
          <p className="text-sm text-gray-500">Invite friends to see activity here.</p>
        </section>
      </div>
    </AppShell>
  );
}
