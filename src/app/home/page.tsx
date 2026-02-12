import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { StickyTip } from '@/components/sticky-tip';

const goals = [
  'Create one new pack this week',
  'Invite three friends to active packs',
  'Reveal one result and share it'
];

const peers = [
  { name: 'Alex', insight: 'Often ranks bold flavors first' },
  { name: 'Sam', insight: 'Usually picks an unexpected winner' }
];

export default function HomePage() {
  return (
    <AppShell>
      <section className="space-y-4 card-pop">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 offset-shadow dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-700 dark:text-indigo-300">Momentum</p>
          <h1 className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Three-day ranking streak</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Submit one ranking today to keep your streak moving.</p>
          <div className="mt-3 flex gap-2">
            <Button>Submit ranking</Button>
            <Button variant="secondary">View streaks</Button>
          </div>
        </div>

        <StickyTip storageKey="home-streak-tip" title="Tip" body="Invite one friend after each reveal to improve completion rates." />

        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Your packs</h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Create a new pack or reopen one from last week.</p>
            <Link href="/packs/new" className="mt-3 inline-block text-sm font-medium text-indigo-700 dark:text-indigo-300">Create pack</Link>
          </section>
          <section className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Invited packs</h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">No pending invites. Share a link after creating a pack.</p>
          </section>
        </div>

        <section className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Weekly goals</h2>
            <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">0/3 complete</span>
          </div>
          <ul className="mt-3 space-y-2">
            {goals.map((goal) => (
              <li key={goal} className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">{goal}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Friends insights</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {peers.map((peer) => (
              <li key={peer.name} className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm dark:border-neutral-700 dark:bg-neutral-800">
                <p className="font-medium text-neutral-900 dark:text-neutral-100">{peer.name}</p>
                <p className="text-neutral-600 dark:text-neutral-400">{peer.insight}</p>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </AppShell>
  );
}
