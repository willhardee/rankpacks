import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

const isDebugEnabled = process.env.ADMIN_DEBUG_ENABLED !== 'false';
const adminEmails = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export async function GET(req: Request) {
  if (!isDebugEnabled) return NextResponse.json({ error: 'Debug disabled' }, { status: 404 });

  const user = await getUserFromRequest(req);
  const email = user?.email?.toLowerCase() ?? '';
  if (!email || !adminEmails.includes(email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const supabase = supabaseAdmin();
  const [packsCount, itemsCount, submissionsCount, packs, submissions] = await Promise.all([
    supabase.from('packs').select('*', { count: 'exact', head: true }),
    supabase.from('pack_items').select('*', { count: 'exact', head: true }),
    supabase.from('rankings').select('*', { count: 'exact', head: true }),
    supabase.from('packs').select('id,title,category,created_at').order('created_at', { ascending: false }).limit(10),
    supabase.from('rankings').select('pack_id,user_id,updated_at,submitted_at').order('updated_at', { ascending: false }).limit(10)
  ]);

  return NextResponse.json({
    counts: {
      packs: packsCount.count ?? 0,
      items: itemsCount.count ?? 0,
      submissions: submissionsCount.count ?? 0
    },
    lastPacks: packs.data ?? [],
    lastSubmissions: submissions.data ?? []
  });
}
