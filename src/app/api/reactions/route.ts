import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({ commentId: z.string().uuid(), emoji: z.enum(['👍', '😂', '🤯', '❤️']) });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  return NextResponse.json({ ok: true, event: 'reaction_added' });
}
