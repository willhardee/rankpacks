'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Compass, House, LayoutGrid, SquarePlus } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { AccountMenu } from '@/components/account-menu';
import { cn } from '@/lib/utils';

const iconClass = 'h-4 w-4';

const tabs = [
  { href: '/home', label: 'Dashboard', icon: LayoutGrid },
  { href: '/packs/new', label: 'Create', icon: SquarePlus },
  { href: '/explore', label: 'Explore', icon: Compass }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 pb-24 pt-4">
      <header className="mb-6 rounded-xl border border-sky-200 bg-white/95 p-4 card-pop offset-shadow dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-slate-900 dark:text-slate-100">RankPacks</Link>
          <div className="flex items-center gap-2">
            <nav aria-label="Top navigation" className="flex items-center gap-1">
              <Link title="Home" aria-label="Home" href="/home" className="rounded-md p-2 text-slate-700 transition hover:bg-sky-100 dark:text-slate-300 dark:hover:bg-slate-800">
                <House className={iconClass} />
              </Link>
              <Link title="Notifications" aria-label="Notifications" href="/notifications" className="rounded-md p-2 text-slate-700 transition hover:bg-sky-100 dark:text-slate-300 dark:hover:bg-slate-800">
                <Bell className={iconClass} />
              </Link>
            </nav>
            <ThemeToggle />
            <AccountMenu />
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-4">{children}</main>

      <div className="safe-area-bottom fixed bottom-0 left-0 right-0 border-t border-sky-200 bg-white/95 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-3">
          <nav aria-label="Primary tabs" className="grid grid-cols-3 rounded-xl bg-sky-100 p-1 dark:bg-slate-800">
            {tabs.map((tab) => {
              const active = pathname === tab.href;
              const Icon = tab.icon;
              return (
                <Link key={tab.href} className={cn('inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition', active ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-700 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700')} href={tab.href}>
                  <Icon className={iconClass} />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
