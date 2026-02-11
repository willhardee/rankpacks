'use client';

import { useState } from 'react';
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

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={item.id} draggable onDragStart={(e) => onDragStart(e, index)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, index)} className="rounded border bg-white p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium">#{index + 1} {item.name}</span>
              <div className="flex gap-2">
                <Button className="bg-gray-200 text-black" onClick={() => move(index, -1)} aria-label={`Move ${item.name} up`}>↑</Button>
                <Button className="bg-gray-200 text-black" onClick={() => move(index, 1)} aria-label={`Move ${item.name} down`}>↓</Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Button onClick={() => navigator.clipboard.writeText(JSON.stringify(items.map((i) => i.id)))}>Save draft order</Button>
    </div>
  );
}
