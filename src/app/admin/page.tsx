import { AppShell } from '@/components/app-shell';

export default function AdminPage() {
  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Admin Console</h1>
      <ul className="mt-3 list-disc pl-5 text-sm text-gray-600">
        <li>Reported comments</li>
        <li>Beta allowlist + invite codes</li>
        <li>Analytics events</li>
        <li>Waitlist entries</li>
      </ul>
    </AppShell>
  );
}
