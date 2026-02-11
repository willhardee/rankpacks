import Link from 'next/link';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-24 pt-4">
      <header className="mb-6 rounded-2xl border border-violet-100 bg-white/70 p-3 backdrop-blur card-pop">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-violet-900">RankPacks ✨</Link>
          <nav className="flex gap-3 text-sm text-gray-700">
            <Link href="/home">Home</Link>
            <Link href="/notifications">Inbox</Link>
            <Link href="/install">Install</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <div className="safe-area-bottom fixed bottom-0 left-0 right-0 border-t border-violet-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-around px-4 py-3 text-sm font-medium text-gray-700">
          <Link className="rounded-lg px-3 py-1 hover:bg-violet-50" href="/home">Dashboard</Link>
          <Link className="rounded-lg px-3 py-1 hover:bg-violet-50" href="/packs/new">Create</Link>
          <Link className="rounded-lg px-3 py-1 hover:bg-violet-50" href="/explore">Explore</Link>
        </div>
      </div>
    </div>
  );
}
