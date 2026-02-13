import { NextResponse } from 'next/server';
import { z } from 'zod';
import { parseBody } from '@/lib/api';
import { submitRanking } from '@/lib/core-flows';

const schema = z.object({
  packId: z.string().min(1),
  orderedItemIds: z.array(z.string()).min(2),
  submit: z.boolean().optional(),
  displayName: z.string().max(80).optional()
});

export async function POST(req: Request) {
  const parsed = await parseBody(req, schema);
  if (parsed instanceof NextResponse) return parsed;

  try {
    await submitRanking({
      packId: parsed.packId,
      orderedItemIds: parsed.orderedItemIds,
      displayName: parsed.displayName
    });

    return NextResponse.json({ ok: true, event: parsed.submit ? 'ranking_submitted' : 'ranking_saved' });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to save ranking' }, { status: 500 });
  }
}
