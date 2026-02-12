'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('rankpacks.theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const shouldDark = stored ? stored === 'dark' : prefersDark;
      document.documentElement.classList.toggle('dark', shouldDark);
      setDark(shouldDark);
    } catch {
      // ignore storage failures
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      window.localStorage.setItem('rankpacks.theme', next ? 'dark' : 'light');
    } catch {
      // ignore storage failures
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-md border border-neutral-300 bg-white px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
      aria-label="Toggle color mode"
    >
      {dark ? 'Dark' : 'Light'} mode
    </button>
  );
}
