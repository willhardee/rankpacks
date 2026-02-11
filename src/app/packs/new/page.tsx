import { AppShell } from '@/components/app-shell';
import { CreatePackFlow } from '@/components/create-pack-flow';

export default function NewPackPage() {
  return (
    <AppShell>
      <section className="space-y-4">
        <div className="card-pop rounded-2xl border border-violet-100 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">Pack builder</p>
          <h1 className="mt-1 text-2xl font-bold text-violet-950">Let’s build a pack people actually finish.</h1>
          <p className="mt-1 text-sm text-gray-600">Choose a vibe, name it, and go live in under 60 seconds.</p>
        </div>
        <CreatePackFlow />
      </section>
    </AppShell>
  );
}
