import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { StickyTip } from '@/components/sticky-tip';

const quests = [
  'Create 1 new pack this week',
  'Invite 3 friends to active packs',
  'Reveal one result and share it'
];

const rivalries = [
  { name: 'Alex', insight: 'Usually loves spicy picks 🌶️' },
  { name: 'Sam', insight: 'Always picks the wildcard 🎲' }
];

export default function HomePage() {
  return (
    <AppShell>
      <section className="space-y-4 card-pop">
        <div className="rounded-2xl border border-violet-100 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">Your momentum</p>
          <h1 className="mt-1 text-2xl font-bold text-violet-950">3-day ranking streak 🔥</h1>
          <p className="text-sm text-gray-600">Keep the streak alive by submitting one ranking today.</p>
          <div className="mt-3 flex gap-2">
            <Button>Submit a ranking</Button>
            <Button variant="secondary">View streaks</Button>
          </div>
        </div>

        <StickyTip title="Keep the streak alive" body="Invite one friend after every reveal to boost pack completion rates." />

        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-2xl border border-violet-100 bg-white p-4">
            <h2 className="font-medium text-violet-900">Your packs</h2>
            <p className="mt-1 text-sm text-gray-500">Start your first pack or revive one from last week.</p>
            <Link href="/packs/new" className="mt-3 inline-block text-sm font-semibold text-primary">Create pack →</Link>
          </section>
          <section className="rounded-2xl border border-violet-100 bg-white p-4">
            <h2 className="font-medium text-violet-900">Invited packs</h2>
            <p className="mt-1 text-sm text-gray-500">No pending invites. Share your invite link after creating a pack.</p>
          </section>
        </div>

        <section className="rounded-2xl border border-violet-100 bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-violet-900">Weekly quests</h2>
            <span className="rounded-full bg-violet-100 px-2 py-1 text-xs font-semibold text-violet-700">0/3 complete</span>
          </div>
          <ul className="mt-3 space-y-2">
            {quests.map((quest) => (
              <li key={quest} className="flex items-center gap-2 rounded-lg bg-violet-50 px-3 py-2 text-sm text-gray-700">
                <span aria-hidden>⬜</span>{quest}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-violet-100 bg-white p-4">
          <h2 className="font-medium text-violet-900">Friendly rivalries</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {rivalries.map((rival) => (
              <li key={rival.name} className="rounded-xl border border-violet-100 bg-violet-50 p-3 text-sm text-violet-950">
                <p className="font-semibold">{rival.name}</p>
                <p className="text-violet-800">{rival.insight}</p>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </AppShell>
  );
}
