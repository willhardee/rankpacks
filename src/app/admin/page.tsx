import { AppShell } from '@/components/app-shell';
import { adminDebugSnapshot } from '@/lib/core-flows';

const parseAdmins = () =>
  (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ as?: string }> }) {
  const { as } = await searchParams;
  const admins = parseAdmins();
  const currentEmail = (as ?? '').toLowerCase();
  const allowed = admins.length > 0 && admins.includes(currentEmail);

  if (!allowed) {
    return (
      <AppShell>
        <h1 className="text-2xl font-semibold">Admin Console</h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Access denied. Provide an admin email via <code>?as=you@example.com</code> that matches ADMIN_EMAILS.</p>
      </AppShell>
    );
  }

  const snapshot = await adminDebugSnapshot();

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Admin Console</h1>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-900"><p className="text-xs">Packs</p><p className="text-xl font-semibold">{snapshot.counts.packs}</p></div>
        <div className="rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-900"><p className="text-xs">Items</p><p className="text-xl font-semibold">{snapshot.counts.items}</p></div>
        <div className="rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-900"><p className="text-xs">Submissions</p><p className="text-xl font-semibold">{snapshot.counts.submissions}</p></div>
      </div>

      <section className="mt-4 rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-900">
        <h2 className="font-semibold">Last 10 packs</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {snapshot.recentPacks.map((pack: any) => <li key={pack.id}>{pack.title} • {pack.category} • {new Date(pack.created_at).toLocaleString()}</li>)}
        </ul>
      </section>

      <section className="mt-4 rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-900">
        <h2 className="font-semibold">Last 10 submissions</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {snapshot.recentSubmissions.map((sub: any) => <li key={sub.id}>{sub.display_name ?? 'Guest'} • pack {sub.pack_id ?? 'n/a'} • {new Date(sub.submitted_at).toLocaleString()}</li>)}
        </ul>
      </section>
    </AppShell>
  );
}
