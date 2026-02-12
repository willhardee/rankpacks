import Link from 'next/link';
import { AppShell } from '@/components/app-shell';

export default async function ResultsPage({ params }: { params: Promise<{ packId: string }> }) {
  const { packId } = await params;
  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Results</h1>
      <p className="text-sm text-gray-500">Consensus ranking, controversy, and taste twins appear here once revealed.</p>
      <Link href={`/api/og/${packId}`} className="text-primary">Preview OG image</Link>
    </AppShell>
  );
}
