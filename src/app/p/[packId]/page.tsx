import { AppShell } from '@/components/app-shell';
import { RankingClient } from '@/components/ranking-client';

export default async function PackPage({ params }: { params: Promise<{ packId: string }> }) {
  const { packId } = await params;
  const items = [
    { id: '1', name: 'Item A' },
    { id: '2', name: 'Item B' },
    { id: '3', name: 'Item C' }
  ];

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Pack {packId}</h1>
      <p className="text-sm text-gray-500">Drag and drop or use arrow buttons to rank.</p>
      <div className="mt-4"><RankingClient initialItems={items} /></div>
    </AppShell>
  );
}
