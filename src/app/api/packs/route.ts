import { NextResponse } from 'next/server';
import { packSchema } from '@/lib/schemas';
import { parseBody } from '@/lib/api';

export async function POST(req: Request) {
  const parsed = await parseBody(req, packSchema);
  if (parsed instanceof NextResponse) return parsed;

  const packId = crypto.randomUUID();
  const isFormPost = (req.headers.get('content-type') ?? '').includes('form');

  if (isFormPost) {
    return NextResponse.redirect(new URL(`/p/${packId}?created=1`, req.url), { status: 303 });
  }

  return NextResponse.json({ ok: true, pack: { id: packId, ...parsed } });
}
