'use client';

import { useEffect, useState } from 'react';

export function StickyTip({ title, body, storageKey }: { title: string; body: string; storageKey?: string }) {
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (!storageKey) return;
    try {
      const hidden = window.localStorage.getItem(`rankpacks.tip.${storageKey}`) === '1';
      setClosed(hidden);
    } catch {
      // no-op on restricted storage
    }
  }, [storageKey]);

  const close = () => {
    setClosed(true);
    if (!storageKey) return;
    try {
      window.localStorage.setItem(`rankpacks.tip.${storageKey}`, '1');
    } catch {
      // no-op on restricted storage
    }
  };

  if (closed) return null;

  return (
    <aside className="card-pop rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{title}</p>
          <p className="mt-1 text-amber-800/90">{body}</p>
        </div>
        <button type="button" onClick={close} aria-label="Dismiss tip" className="rounded-md px-2 py-1 text-xs hover:bg-amber-100">✕</button>
      </div>
    </aside>
  );
}
