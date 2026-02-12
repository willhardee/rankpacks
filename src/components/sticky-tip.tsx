'use client';

import { useState } from 'react';

export function StickyTip({ title, body }: { title: string; body: string }) {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <aside className="card-pop rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{title}</p>
          <p className="mt-1 text-amber-800/90">{body}</p>
        </div>
        <button type="button" onClick={() => setClosed(true)} aria-label="Dismiss tip" className="rounded-md px-2 py-1 text-xs hover:bg-amber-100">✕</button>
      </div>
    </aside>
  );
}
