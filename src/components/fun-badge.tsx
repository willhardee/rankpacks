'use client';

import { useEffect, useState } from 'react';

const messages = [
  'Trending now',
  'New packs today',
  'Fast reveal mode',
  'Friends active'
];

export function FunBadge() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const id = window.setInterval(() => setIndex((v) => (v + 1) % messages.length), 2600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div aria-live="polite" className="inline-flex min-h-8 items-center rounded-full bg-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700 transition-all duration-300">
      {messages[index]}
    </div>
  );
}
