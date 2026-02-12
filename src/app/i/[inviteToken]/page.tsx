import Link from 'next/link';
import { AppShell } from '@/components/app-shell';

export default async function InvitePage({ params }: { params: Promise<{ inviteToken: string }> }) {
  const { inviteToken } = await params;
  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Invite</h1>
      <p className="text-sm text-gray-600">Token: {inviteToken}</p>
      <Link className="text-primary" href="/home">Sign in to join this pack</Link>
    </AppShell>
  );
}
