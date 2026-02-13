'use client';

import { useEffect, useState } from 'react';

type Item = { id: string; name: string };

type Aggregate = { itemId: string; score: number; averageRank: number; topVotes: number };

type Submission = { id: string; display_name: string; ordered_item_ids: string[]; submitted_at: string };

export function ResultsClient({ packId, items, aggregate, submissions }: { packId: string; items: Item[]; aggregate: Aggregate[]; submissions: Submission[] }) {
  const [yourRanking, setYourRanking] = useState<string[]>([]);
  const itemMap = new Map(items.map((item) => [item.id, item.name]));

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(`rankpacks.ranking.${packId}`);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { orderedIds?: string[] };
      setYourRanking(parsed.orderedIds ?? []);
    } catch {
      // ignore
    }
  }, [packId]);

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Your submitted ranking</h2>
        {yourRanking.length === 0 ? <p className="text-sm text-neutral-500">No local submission found yet. Submit a ranking from the pack page.</p> : (
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
            {yourRanking.map((itemId) => <li key={itemId}>{itemMap.get(itemId) ?? itemId}</li>)}
          </ol>
        )}
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Aggregated results</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {aggregate.map((entry, index) => (
            <li key={entry.itemId} className="rounded-lg bg-neutral-50 p-2 dark:bg-neutral-800">#{index + 1} {itemMap.get(entry.itemId) ?? entry.itemId} • avg rank {entry.averageRank.toFixed(2)} • top votes {entry.topVotes}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Individual submissions</h2>
        <ul className="mt-2 space-y-2">
          {submissions.map((submission) => (
            <li key={submission.id} className="rounded-lg bg-neutral-50 p-3 text-sm dark:bg-neutral-800">
              <p className="font-semibold">{submission.display_name}</p>
              <p className="text-xs text-neutral-500">{new Date(submission.submitted_at).toLocaleString()}</p>
              <ol className="mt-1 list-decimal space-y-1 pl-5">
                {submission.ordered_item_ids.map((itemId) => <li key={`${submission.id}-${itemId}`}>{itemMap.get(itemId) ?? itemId}</li>)}
              </ol>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
