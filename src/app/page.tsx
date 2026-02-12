import { AppShell } from '@/components/app-shell';
import { AuthEntry } from '@/components/auth-entry';

const highlights = [
  { title: 'Rank together', copy: 'Create private or public packs and vote with friends in minutes.' },
  { title: 'Live activity', copy: 'See who joined, who submitted, and when results are about to drop.' },
  { title: 'Saved profiles', copy: 'Sign in once and keep your rankings synced across devices.' }
];

export default function LandingPage() {
  return (
    <AppShell>
      <section className="rounded-2xl border border-sky-200 bg-white p-6 card-pop offset-shadow dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">Social ranking app</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">Rank your favorites with your people.</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300">From food drafts to movie nights, RankPacks helps your group decide faster with shared lists and friendly competition.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {highlights.map((item) => (
            <article key={item.title} className="rounded-xl border border-sky-100 bg-sky-50/60 p-3 dark:border-slate-700 dark:bg-slate-800/80">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</h2>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <AuthEntry next="/home" />
    </AppShell>
  );
}
