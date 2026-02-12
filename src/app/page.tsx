import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { FunBadge } from '@/components/fun-badge';
import { StickyTip } from '@/components/sticky-tip';

const highlights = [
  { title: '⚡ 2-minute setup', detail: 'Start from snack, wine, or fast-food templates.' },
  { title: '🎯 Friendly competition', detail: 'See taste twins, streaks, and most-controversial picks.' },
  { title: '📲 Built to share', detail: 'Mobile-first flow with one-tap invite links and share cards.' }
];

export default function LandingPage() {
  return (
    <AppShell>
      <section className="space-y-6 card-pop">
        <FunBadge />
        <h1 className="text-4xl font-extrabold tracking-tight text-violet-950">Rank anything with friends — and make it fun.</h1>
        <p className="text-gray-700">Build a pack, invite your crew, race to rank, and reveal consensus with playful insights your group actually wants to share.</p>
        <div className="flex gap-3">
          <Link href="/packs/new"><Button>Create a pack</Button></Link>
          <Link href="/explore"><Button variant="secondary">Explore packs</Button></Link>
        </div>

        <StickyTip title="Pro tip" body="Public packs grow faster. Start link-only, then flip public when you're ready to attract more votes." />

        <div className="grid gap-3 sm:grid-cols-3">
          {highlights.map((item) => (
            <article key={item.title} className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <h2 className="font-semibold text-violet-900">{item.title}</h2>
              <p className="mt-1 text-sm text-gray-600">{item.detail}</p>
            </article>
          ))}
        </div>

        <div className="rounded-2xl border border-violet-100 bg-white p-4">
          <h2 className="font-semibold">How it works</h2>
          <ol className="mt-2 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
            <li className="rounded-xl bg-violet-50 p-3">1. Create your pack from a template.</li>
            <li className="rounded-xl bg-violet-50 p-3">2. Invite by link or email.</li>
            <li className="rounded-xl bg-violet-50 p-3">3. Rank with drag-and-drop or tap controls.</li>
            <li className="rounded-xl bg-violet-50 p-3">4. Reveal results and share instantly.</li>
          </ol>
        </div>
      </section>
    </AppShell>
  );
}
