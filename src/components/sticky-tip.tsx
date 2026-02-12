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
    <aside className="card-pop rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-800">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-neutral-900">{title}</p>
          <p className="mt-1 text-neutral-700">{body}</p>
        </div>
        <button type="button" onClick={close} aria-label="Dismiss tip" className="rounded-md px-2 py-1 text-xs text-neutral-700 hover:bg-neutral-200">Close</button>
      </div>
    </aside>
  );
}
