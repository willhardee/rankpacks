'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export type PublicPack = {
  id: string;
  title: string;
  created_at: string;
  rankingsCount: number;
};

function formatCreatedAt(createdAt: string) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return 'Unknown date';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function BrowsePackList({ packs }: { packs: PublicPack[] }) {
  const [search, setSearch] = useState('');
  const [sortMode, setSortMode] = useState<'new' | 'trending'>('new');

  const visiblePacks = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const filtered = needle
      ? packs.filter((pack) => pack.title.toLowerCase().includes(needle))
      : packs;

    return [...filtered].sort((a, b) => {
      if (sortMode === 'trending') {
        if (b.rankingsCount !== a.rankingsCount) return b.rankingsCount - a.rankingsCount;
      }

      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [packs, search, sortMode]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search packs by title"
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none ring-indigo-300 focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          aria-label="Search public packs by title"
        />

        <div className="inline-flex rounded-lg border border-neutral-300 p-1 dark:border-neutral-700">
          <button
            type="button"
            onClick={() => setSortMode('new')}
            className={`rounded-md px-3 py-1 text-sm ${sortMode === 'new' ? 'bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100' : 'text-neutral-600 dark:text-neutral-300'}`}
          >
            New
          </button>
          <button
            type="button"
            onClick={() => setSortMode('trending')}
            className={`rounded-md px-3 py-1 text-sm ${sortMode === 'trending' ? 'bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100' : 'text-neutral-600 dark:text-neutral-300'}`}
          >
            Trending
          </button>
        </div>
      </div>

      {visiblePacks.length > 0 ? (
        <ul className="space-y-3">
          {visiblePacks.map((pack) => (
            <li key={pack.id}>
              <Link
                href={`/packs/${pack.id}`}
                className="block rounded-lg border border-neutral-200 bg-neutral-50 p-3 transition hover:border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
              >
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{pack.title}</p>
                <div className="mt-1 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
                  <p>Created {formatCreatedAt(pack.created_at)}</p>
                  <p>{pack.rankingsCount} rankings</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-neutral-600 dark:text-neutral-400">No public packs yet</p>
      )}
    </div>
  );
}
