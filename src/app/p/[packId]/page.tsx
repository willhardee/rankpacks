import { AppShell } from '@/components/app-shell';
import { RankingClient } from '@/components/ranking-client';
import { getPackWithItems } from '@/lib/core-flows';

export default async function PackPage({ params, searchParams }: { params: Promise<{ packId: string }>; searchParams: Promise<{ created?: string }> }) {
  const { packId } = await params;
  const { created } = await searchParams;

  let packTitle = 'Pack';
  let description = 'Drag to rank, or tap arrows for precision. Save draft or submit when ready.';
  let items: Array<{ id: string; name: string }> = [];

  try {
    const payload = await getPackWithItems(packId);
    packTitle = payload.pack.title;
    items = payload.items.map((item) => ({ id: item.id, name: item.name }));
  } catch {
    description = 'This pack could not be loaded.';
  }

  return (
    <AppShell>
      <section className="space-y-4">
        {created === '1' ? <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-800">Pack created. You can now rank items.</div> : null}
        <div className="rounded-xl border border-neutral-200 bg-white p-4 card-pop dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Pack {packId}</p>
          <h1 className="mt-1 text-2xl font-bold">{packTitle}</h1>
          <p className="text-sm text-neutral-600">{description}</p>
        </div>
        <RankingClient packId={packId} initialItems={items} />
      </section>
    </AppShell>
  );
}
