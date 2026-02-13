import { AppShell } from '@/components/app-shell';
import { AuthEntry } from '@/components/auth-entry';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;

  return (
    <AppShell>
      <AuthEntry next={next ?? '/home'} error={error} />
    </AppShell>
  );
}
