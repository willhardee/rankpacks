import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({ displayName: z.string().min(2), avatarUrl: z.string().url().optional() });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  return NextResponse.json({ ok: true, event: 'onboarding_completed' });
}
