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
    const id = setInterval(() => setIndex((v) => (v + 1) % messages.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="inline-flex min-h-8 items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800 transition-all duration-300">
      {messages[index]}
    </div>
  );
}
