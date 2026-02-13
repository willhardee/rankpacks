'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { supabaseBrowser } from '@/lib/supabase';
import { AuthButtons } from '@/components/auth-buttons';

type Item = { id: string; name: string };

export function RankingClient({ packId, initialItems }: { packId: string; initialItems: Item[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>(initialItems);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);

  useEffect(() => setItems(initialItems), [initialItems]);

  useEffect(() => {
    const load = async () => {
      const supabase = supabaseBrowser();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;
      const res = await fetch(`/api/rankings?packId=${packId}`, { headers: { Authorization: `Bearer ${token}` } });
      const body = await res.json();
      const orderedIds = body.ranking?.ordered_item_ids as string[] | undefined;
      if (!orderedIds?.length) return;
      const byId = new Map(initialItems.map((item) => [item.id, item]));
      const reordered = orderedIds.map((id) => byId.get(id)).filter(Boolean) as Item[];
      if (reordered.length === initialItems.length) setItems(reordered);
    };
    load();
  }, [initialItems, packId]);

  const completion = useMemo(() => Math.min(100, Math.round((items.length / Math.max(initialItems.length, 1)) * 100)), [items.length, initialItems.length]);

  const persist = (next: Item[]) => setItems(next);
  const move = (index: number, offset: number) => {
    const target = index + offset;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [entry] = next.splice(index, 1);
    next.splice(target, 0, entry);
    persist(next);
  };

  const onDragStart = (_event: React.DragEvent<HTMLLIElement>, index: number) => setDragIndex(index);
  const onDrop = (_event: React.DragEvent<HTMLLIElement>, index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    const next = [...items];
    const [entry] = next.splice(dragIndex, 1);
    next.splice(index, 0, entry);
    persist(next);
    setDragIndex(null);
  };

  const send = async (submit: boolean) => {
    setSubmitting(true);
    const supabase = supabaseBrowser();
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      setShowSavePrompt(true);
      router.push(`/login?next=/p/${packId}`);
      setSubmitting(false);
      return;
    }

    const res = await fetch('/api/rankings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ packId, orderedItemIds: items.map((i) => i.id), submit })
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: 'Submission failed' }));
      setMessage(body.error ?? 'Submission failed');
      setSubmitting(false);
      return;
    }

    setMessage(submit ? 'Ranking submitted' : 'Draft saved');
    setSubmitting(false);
    if (submit) router.push(`/results/${packId}`);
  };

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm">Ranking progress: {completion}%</div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={item.id} draggable onDragStart={(e) => onDragStart(e, index)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, index)} className="rounded-xl border border-neutral-200 bg-white p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium">#{index + 1} {item.name}</span>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" className="px-2 py-1" onClick={() => move(index, -1)}>↑</Button>
                <Button type="button" variant="secondary" className="px-2 py-1" onClick={() => move(index, 1)}>↓</Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <Button type="button" onClick={() => send(false)} disabled={submitting}>Save draft</Button>
        <Button type="button" variant="secondary" onClick={() => send(true)} disabled={submitting}>Submit ranking</Button>
      </div>
      {message ? <p className="text-xs text-neutral-600">{message}</p> : null}

      {showSavePrompt ? (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3">
          <p className="text-sm font-semibold text-indigo-900">Sign in to submit your ranking</p>
          <div className="mt-2"><AuthButtons next={`/p/${packId}`} compact /></div>
        </div>
      ) : null}
    </div>
  );
}
