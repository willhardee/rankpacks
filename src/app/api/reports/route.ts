import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({ packId: z.string().uuid(), commentId: z.string().uuid(), reason: z.string().min(4).max(300) });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  return NextResponse.json({ ok: true, event: 'report_submitted' });
}
