import { notFound } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { ResultsClient } from '@/components/results-client';
import { aggregatePackResults, getPack, listPackSubmissions } from '@/lib/core-flows';

export default async function ResultsPage({ params }: { params: Promise<{ packId: string }> }) {
  const { packId } = await params;
  const pack = await getPack(packId);
  if (!pack) notFound();

  const submissions = await listPackSubmissions(packId);
  const aggregate = aggregatePackResults(pack.items.map((item) => item.id), submissions);

  return (
    <AppShell>
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{pack.title} results</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">See your ranking, the group consensus, and each individual submission.</p>
      </section>
      <ResultsClient packId={packId} items={pack.items} aggregate={aggregate} submissions={submissions} />
    </AppShell>
  );
}
