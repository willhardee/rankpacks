'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

export function RankingClient({ initialItems }: { initialItems: { id: string; name: string }[] }) {
  const [items, setItems] = useState(initialItems);

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    setItems(next);
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
    setItems(next);
  };

  const quickAssistEnabled = items.length > 15;
  const completion = useMemo(() => Math.round((items.length / Math.max(initialItems.length, 1)) * 100), [items.length, initialItems.length]);

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-violet-100 bg-violet-50 p-3 text-sm text-violet-900">
        <p className="font-semibold">Ranking progress</p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-violet-100">
          <div className="h-full bg-violet-500 transition-all" style={{ width: `${completion}%` }} />
        </div>
      </div>

      {quickAssistEnabled && (
        <div className="rounded-xl border border-violet-100 bg-white p-3 text-sm">
          <p className="font-semibold text-violet-900">Quick Assist</p>
          <p className="text-xs text-gray-600">Start with top 5 and bottom 5 picks, then refine.</p>
          <div className="mt-2 flex gap-2">
            <Button type="button" variant="secondary">Pick top 5</Button>
            <Button type="button" variant="secondary">Pick bottom 5</Button>
          </div>
        </div>
      )}

      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={item.id} draggable onDragStart={(e) => onDragStart(e, index)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, index)} className="rounded-xl border border-gray-200 bg-white p-3 transition hover:shadow-sm">
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
        <Button type="button" onClick={() => navigator.clipboard.writeText(JSON.stringify(items.map((i) => i.id)))}>Save draft order</Button>
        <Button type="button" variant="secondary">Submit ranking</Button>
      </div>
    </div>
  );
}
