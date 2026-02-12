import Link from 'next/link';
import { Bell, Compass, Download, House, LayoutGrid, SquarePlus } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

const iconClass = 'h-4 w-4';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 pb-24 pt-4">
      <header className="mb-6 rounded-xl border border-neutral-200 bg-white p-4 card-pop offset-shadow dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">RankPacks</Link>
          <div className="flex items-center gap-2">
            <nav aria-label="Top navigation" className="flex items-center gap-1">
              <Link title="Home" aria-label="Home" href="/home" className="rounded-md p-2 text-neutral-700 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800">
                <House className={iconClass} />
              </Link>
              <Link title="Notifications" aria-label="Notifications" href="/notifications" className="rounded-md p-2 text-neutral-700 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800">
                <Bell className={iconClass} />
              </Link>
              <Link title="Install" aria-label="Install" href="/install" className="rounded-md p-2 text-neutral-700 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800">
                <Download className={iconClass} />
              </Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-4">{children}</main>

      <div className="safe-area-bottom fixed bottom-0 left-0 right-0 border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto max-w-4xl px-4 py-3">
          <nav aria-label="Primary tabs" className="grid grid-cols-3 rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800">
            <Link className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-white dark:text-neutral-300 dark:hover:bg-neutral-700" href="/home">
              <LayoutGrid className={iconClass} />
              <span>Dashboard</span>
            </Link>
            <Link className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-white dark:text-neutral-300 dark:hover:bg-neutral-700" href="/packs/new">
              <SquarePlus className={iconClass} />
              <span>Create</span>
            </Link>
            <Link className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-white dark:text-neutral-300 dark:hover:bg-neutral-700" href="/explore">
              <Compass className={iconClass} />
              <span>Explore</span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
