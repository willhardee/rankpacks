'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AuthButtons } from '@/components/auth-buttons';
import { supabaseBrowser } from '@/lib/supabase';

type Item = { id: string; name: string };

export function RankingClient({ initialItems, packId }: { initialItems: Item[]; packId: string }) {
  const [items, setItems] = useState(initialItems);
  const [displayName, setDisplayName] = useState('Guest');
  const [message, setMessage] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(`rankpacks.ranking.${packId}`);
      if (!raw) return;
      const draft = JSON.parse(raw) as { orderedIds: string[]; displayName?: string };
      const byId = new Map(initialItems.map((item) => [item.id, item]));
      const restored = (draft.orderedIds ?? []).map((id) => byId.get(id)).filter(Boolean) as Item[];
      if (restored.length === initialItems.length) setItems(restored);
      if (draft.displayName) setDisplayName(draft.displayName);
    } catch {
      // ignore malformed draft
    }
  }, [initialItems, packId]);

  const persistDraft = (nextItems: Item[], nextName = displayName) => {
    setItems(nextItems);
    try {
      window.localStorage.setItem(`rankpacks.ranking.${packId}`, JSON.stringify({ orderedIds: nextItems.map((i) => i.id), displayName: nextName }));
    } catch {
      // ignore storage failures
    }
  };

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    persistDraft(next);
  };

  const onDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.dataTransfer.setData('text/plain', String(index));
  };

  const onDrop = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    const start = Number(e.dataTransfer.getData('text/plain'));
    if (Number.isNaN(start) || start === index) return;
    const next = [...items];
    const [dragged] = next.splice(start, 1);
    next.splice(index, 0, dragged);
    persistDraft(next);
  };

  const completion = useMemo(() => Math.round((items.length / Math.max(initialItems.length, 1)) * 100), [items.length, initialItems.length]);

  const saveDraft = async () => {
    setMessage('Saving draft...');
    try {
      await fetch('/api/rankings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId, orderedItemIds: items.map((i) => i.id), submit: false, displayName })
      });
      setMessage('Draft saved');
    } catch {
      setMessage('Draft saved locally');
    }
  };

  const submitRanking = async () => {
    setSubmitting(true);
    setMessage('Submitting ranking...');
    try {
      const response = await fetch('/api/rankings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId, orderedItemIds: items.map((i) => i.id), submit: true, displayName })
      });

      if (!response.ok) throw new Error('submit failed');

      setMessage('Ranking submitted');

      const supabase = supabaseBrowser();
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setShowSavePrompt(true);
      }
    } catch {
      setMessage('Submission failed, try again');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm text-neutral-700 dark:text-neutral-300">
        Display name for this submission
        <input
          value={displayName}
          onChange={(e) => {
            setDisplayName(e.target.value);
            persistDraft(items, e.target.value);
          }}
          className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          placeholder="Guest"
        />
      </label>

      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
        <p className="font-semibold">Ranking progress</p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
          <div className="h-full bg-indigo-600 transition-all" style={{ width: `${completion}%` }} />
        </div>
      </div>

      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={item.id} draggable onDragStart={(e) => onDragStart(e, index)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, index)} className="rounded-xl border border-neutral-200 bg-white p-3 transition hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium">#{index + 1} {item.name}</span>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" className="px-2 py-1" onClick={() => move(index, -1)} aria-label={`Move ${item.name} up`}>↑</Button>
                <Button type="button" variant="secondary" className="px-2 py-1" onClick={() => move(index, 1)} aria-label={`Move ${item.name} down`}>↓</Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <Button type="button" onClick={saveDraft}>Save draft</Button>
        <Button type="button" variant="secondary" onClick={submitRanking} disabled={submitting}>Submit ranking</Button>
        <Button type="button" variant="ghost" onClick={() => (window.location.href = `/results/${packId}`)}>View results</Button>
      </div>
      {message ? <p className="text-xs text-neutral-600 dark:text-neutral-400">{message}</p> : null}

      {showSavePrompt ? (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 dark:border-indigo-900 dark:bg-indigo-950/40">
          <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">Save your ranking</p>
          <p className="mt-1 text-xs text-indigo-800 dark:text-indigo-300">Continue as guest or sign in to keep this ranking synced to your account.</p>
          <div className="mt-2">
            <AuthButtons next={`/p/${packId}`} compact />
          </div>
        </div>
      ) : null}
    </div>
  );
}
