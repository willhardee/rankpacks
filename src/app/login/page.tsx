import { AppShell } from '@/components/app-shell';
import { AuthButtons } from '@/components/auth-buttons';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;

  return (
    <AppShell>
      <section className="mx-auto max-w-md rounded-xl border border-sky-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Sign in to save progress</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Continue as guest any time. Sign in to sync rankings and access them across devices.</p>
        <div className="mt-4">
          <AuthButtons next={next ?? '/home'} />
        </div>
      </section>
    </AppShell>
  );
}
