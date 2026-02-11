import { AppShell } from '@/components/app-shell';

export default function InstallPage() {
  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Install RankPacks</h1>
      <div className="mt-4 space-y-4 text-sm text-gray-700">
        <section>
          <h2 className="font-semibold">iOS (Safari)</h2>
          <p>Tap Share → Add to Home Screen.</p>
        </section>
        <section>
          <h2 className="font-semibold">Android (Chrome)</h2>
          <p>Tap menu → Install app or Add to Home screen.</p>
        </section>
      </div>
    </AppShell>
  );
}
