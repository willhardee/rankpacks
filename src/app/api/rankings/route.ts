import { NextResponse } from 'next/server';
import { z } from 'zod';
import { parseBody } from '@/lib/api';

const schema = z.object({
  packId: z.string().uuid(),
  orderedItemIds: z.array(z.string()),
  submit: z.boolean().optional()
});

export async function POST(req: Request) {
  const parsed = await parseBody(req, schema);
  if (parsed instanceof NextResponse) return parsed;
  return NextResponse.json({ ok: true, event: parsed.submit ? 'ranking_submitted' : 'ranking_saved' });
}
