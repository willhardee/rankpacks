import { AppShell } from '@/components/app-shell';
import { RankingClient } from '@/components/ranking-client';

export default async function PackPage({ params }: { params: Promise<{ packId: string }> }) {
  const { packId } = await params;
  const items = [
    { id: '1', name: 'Spicy Chips' },
    { id: '2', name: 'Sour Gummies' },
    { id: '3', name: 'Chocolate Clusters' }
  ];

  return (
    <AppShell>
      <section className="space-y-4">
        <div className="rounded-2xl border border-violet-100 bg-white p-4 card-pop">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">Pack {packId}</p>
          <h1 className="mt-1 text-2xl font-bold text-violet-950">Friday Snack Draft</h1>
          <p className="text-sm text-gray-600">Drag to rank, or tap arrows for precision. Your draft auto-saves while you reorder.</p>
        </div>
        <RankingClient initialItems={items} />
      </section>
    </AppShell>
  );
}
