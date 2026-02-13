import { NextResponse } from 'next/server';
import { packSchema } from '@/lib/schemas';
import { parseBody } from '@/lib/api';
import { ensureProfile } from '@/lib/core-flows';
import { getUserFromRequest } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

const normalizeItems = (raw: string | string[] | undefined) => {
  const values = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return values
    .flatMap((entry) => entry.split('\n'))
    .map((entry) => entry.trim())
    .filter(Boolean)
    .slice(0, 40);
};

export async function POST(req: Request) {
  const parsed = await parseBody(req, packSchema);
  if (parsed instanceof NextResponse) return parsed;

  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Login required to create packs.' }, { status: 401 });
  }

  const items = normalizeItems(parsed.items);
  if (items.length < 2) {
    return NextResponse.json({ error: 'Add at least two items.' }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  await ensureProfile(user.id, user.email);

  const { data: pack, error: packError } = await supabase
    .from('packs')
    .insert({
      owner_id: user.id,
      title: parsed.title,
      category: parsed.category,
      visibility: parsed.visibility,
      location: parsed.location,
      scheduled_for: parsed.scheduledFor,
      status: 'open'
    })
    .select('id')
    .single();

  if (packError || !pack) {
    return NextResponse.json({ error: packError?.message ?? 'Could not create pack.' }, { status: 500 });
  }

  const packItems = items.map((name) => ({ pack_id: pack.id, name }));
  const { error: itemsError } = await supabase.from('pack_items').insert(packItems);
  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  const isFormPost = (req.headers.get('content-type') ?? '').includes('form');
  if (isFormPost) {
    return NextResponse.redirect(new URL(`/p/${pack.id}?created=1`, req.url), { status: 303 });
  }

  return NextResponse.json({ ok: true, packId: pack.id });
}
