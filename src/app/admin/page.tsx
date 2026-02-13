'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { supabaseBrowser } from '@/lib/supabase';

type DebugPayload = {
  counts: { packs: number; items: number; submissions: number };
  lastPacks: Array<{ id: string; title: string; category: string; created_at: string }>;
  lastSubmissions: Array<{ pack_id: string; user_id: string; updated_at: string; submitted_at: string | null }>;
};

export default function AdminPage() {
  const [payload, setPayload] = useState<DebugPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = supabaseBrowser();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      const res = await fetch('/api/admin/debug', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (!res.ok) {
        setError('Not authorized for debug view.');
        return;
      }

      setPayload(await res.json());
    };

    load();
  }, []);

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Admin Debug</h1>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {payload ? (
        <section className="space-y-4 text-sm">
          <div className="grid grid-cols-3 gap-3">
            <article className="rounded border p-3">Packs: <strong>{payload.counts.packs}</strong></article>
            <article className="rounded border p-3">Items: <strong>{payload.counts.items}</strong></article>
            <article className="rounded border p-3">Submissions: <strong>{payload.counts.submissions}</strong></article>
          </div>

          <div>
            <h2 className="font-semibold">Last 10 created packs</h2>
            <ul className="mt-2 space-y-1">
              {payload.lastPacks.map((pack) => <li key={pack.id}>{pack.title} ({pack.category})</li>)}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold">Last 10 submissions</h2>
            <ul className="mt-2 space-y-1">
              {payload.lastSubmissions.map((submission) => <li key={`${submission.pack_id}-${submission.user_id}-${submission.updated_at}`}>{submission.pack_id} · {submission.user_id}</li>)}
            </ul>
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}
