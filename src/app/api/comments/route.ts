import { NextResponse } from 'next/server';
import { commentSchema } from '@/lib/schemas';
import { parseBody } from '@/lib/api';
import { containsProfanity } from '@/lib/profanity';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  if (!rateLimit('comments:anon', 5, 60_000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const parsed = await parseBody(req, commentSchema);
  if (parsed instanceof NextResponse) return parsed;
  if (containsProfanity(parsed.body)) {
    return NextResponse.json({ error: 'profanity_detected' }, { status: 400 });
  }
  return NextResponse.json({ ok: true, event: 'comment_posted' });
}
