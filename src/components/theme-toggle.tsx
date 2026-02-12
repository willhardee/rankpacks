'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

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
      className="rounded-md border border-sky-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-sky-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      aria-label="Toggle color mode"
      title="Toggle color mode"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
