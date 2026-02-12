import { AppShell } from '@/components/app-shell';
import { RankingClient } from '@/components/ranking-client';

export default async function PackPage({ params, searchParams }: { params: Promise<{ packId: string }>; searchParams: Promise<{ created?: string }> }) {
  const { packId } = await params;
  const { created } = await searchParams;
  const items = [
    { id: '1', name: 'Spicy Chips' },
    { id: '2', name: 'Sour Gummies' },
    { id: '3', name: 'Chocolate Clusters' }
  ];

  return (
    <AppShell>
      <section className="space-y-4">
        {created === '1' ? (
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-800 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200">Pack created. You can now add members and start ranking.</div>
        ) : null}
        <div className="rounded-xl border border-neutral-200 bg-white p-4 card-pop dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">Pack {packId}</p>
          <h1 className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">Friday Snack Draft</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Drag to rank, or tap arrows for precision. Save draft or submit when ready.</p>
        </div>
        <RankingClient packId={packId} initialItems={items} />
      </section>
    </AppShell>
  );
}
