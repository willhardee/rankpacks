import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 pb-24 pt-4">
      <header className="mb-6 rounded-xl border border-neutral-200 bg-white p-4 card-pop offset-shadow dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">RankPacks</Link>
          <div className="flex items-center gap-3">
            <nav className="flex gap-4 text-sm text-neutral-700 dark:text-neutral-300">
              <Link href="/home">Home</Link>
              <Link href="/notifications">Notifications</Link>
              <Link href="/install">Install</Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 space-y-4">{children}</main>
      <div className="safe-area-bottom fixed bottom-0 left-0 right-0 border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto flex max-w-4xl items-center justify-around px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
          <Link className="rounded-md px-3 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800" href="/home">Dashboard</Link>
          <Link className="rounded-md px-3 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800" href="/packs/new">Create</Link>
          <Link className="rounded-md px-3 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800" href="/explore">Explore</Link>
        </div>
      </div>
    </div>
  );
}
