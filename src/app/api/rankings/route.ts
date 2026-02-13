import { NextResponse } from 'next/server';
import { z } from 'zod';
import { parseBody } from '@/lib/api';
import { getUserFromRequest } from '@/lib/auth';
import { ensureProfile, getPackWithItems } from '@/lib/core-flows';
import { supabaseAdmin } from '@/lib/supabase';

const schema = z.object({
  packId: z.string().uuid(),
  orderedItemIds: z.array(z.string().uuid()),
  submit: z.boolean().optional()
});

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ ranking: null });

  const { searchParams } = new URL(req.url);
  const packId = searchParams.get('packId');
  if (!packId) return NextResponse.json({ error: 'Missing packId' }, { status: 400 });

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from('rankings')
    .select('ordered_item_ids,submitted_at,updated_at')
    .eq('pack_id', packId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ranking: data });
}

export async function POST(req: Request) {
  const parsed = await parseBody(req, schema);
  if (parsed instanceof NextResponse) return parsed;

  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Login required to submit ranking.' }, { status: 401 });
  }

  const { items } = await getPackWithItems(parsed.packId);
  const validIds = new Set(items.map((item) => item.id));
  if (parsed.orderedItemIds.length !== items.length || parsed.orderedItemIds.some((id) => !validIds.has(id))) {
    return NextResponse.json({ error: 'Ranking must include each item exactly once.' }, { status: 400 });
  }

  await ensureProfile(user.id, user.email);

  const supabase = supabaseAdmin();
  const { error } = await supabase.from('rankings').upsert(
    {
      pack_id: parsed.packId,
      user_id: user.id,
      ordered_item_ids: parsed.orderedItemIds,
      submitted_at: parsed.submit ? new Date().toISOString() : null
    },
    { onConflict: 'pack_id,user_id' }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, event: parsed.submit ? 'ranking_submitted' : 'ranking_saved' });
}
