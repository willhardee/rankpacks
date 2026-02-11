import Link from 'next/link';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-20 pt-4">
      <header className="mb-6 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold">RankPacks</Link>
        <nav className="flex gap-3 text-sm">
          <Link href="/home">Home</Link>
          <Link href="/notifications">Notifications</Link>
          <Link href="/install">Install</Link>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <div className="safe-area-bottom fixed bottom-0 left-0 right-0 border-t bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-around px-4 py-3 text-sm">
          <Link href="/home">Dashboard</Link>
          <Link href="/packs/new">Create Pack</Link>
          <Link href="/explore">Explore</Link>
        </div>
      </div>
    </div>
  );
}
