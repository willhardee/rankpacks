'use client';

import { useEffect, useState } from 'react';

const messages = [
  '🔥 Hot streak ready',
  '🎉 New pack, new champion',
  '⚡ Fast reveal mode',
  '🏆 Friendly rivalry enabled'
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
    <div aria-live="polite" className="inline-flex min-h-8 items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800 transition-all duration-300">
      {messages[index]}
    </div>
  );
}
