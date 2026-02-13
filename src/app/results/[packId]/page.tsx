'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { supabaseBrowser } from '@/lib/supabase';

type ResultPayload = {
  aggregate: Array<{ rank: number; itemName: string; score: number; averageRank: number }>;
  submissions: Array<{ userId: string; displayName: string; orderedItems: Array<{ id: string; name: string }> }>;
  viewerSubmission: { orderedItems: Array<{ id: string; name: string }> } | null;
  submissionCount: number;
};

export default function ResultsPage() {
  const params = useParams<{ packId: string }>();
  const packId = params.packId;
  const [data, setData] = useState<ResultPayload | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = supabaseBrowser();
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const res = await fetch(`/api/results?packId=${packId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) return;
      setData(await res.json());
    };
    load();
  }, [packId]);

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Results</h1>
      {!data ? <p className="text-sm text-gray-500">Loading results...</p> : (
        <div className="space-y-4">
          <section className="rounded border p-3">
            <h2 className="font-semibold">Your ranking</h2>
            {data.viewerSubmission ? (
              <ol className="mt-2 list-decimal pl-5">{data.viewerSubmission.orderedItems.map((item) => <li key={item.id}>{item.name}</li>)}</ol>
            ) : <p className="text-sm text-gray-500">Sign in to see your submitted ranking.</p>}
          </section>

          <section className="rounded border p-3">
            <h2 className="font-semibold">Aggregate ranking ({data.submissionCount} submissions)</h2>
            <ol className="mt-2 list-decimal pl-5">
              {data.aggregate.map((item) => <li key={item.rank}>{item.itemName} — score {item.score}, avg rank {item.averageRank.toFixed(2)}</li>)}
            </ol>
          </section>

          <section className="rounded border p-3">
            <h2 className="font-semibold">Individual submissions</h2>
            <ul className="mt-2 space-y-2">
              {data.submissions.map((submission) => (
                <li key={submission.userId} className="rounded border p-2">
                  <p className="font-medium">{submission.displayName}</p>
                  <ol className="list-decimal pl-5 text-sm">
                    {submission.orderedItems.map((item) => <li key={`${submission.userId}-${item.id}`}>{item.name}</li>)}
                  </ol>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </AppShell>
  );
}
