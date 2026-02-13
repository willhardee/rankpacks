import { NextResponse } from 'next/server';
import { z } from 'zod';
import { bordaCount, mostControversialItem, tasteTwins } from '@/lib/ranking';
import { parseBody } from '@/lib/api';
import { getResults } from '@/lib/core-flows';
import { getUserFromRequest } from '@/lib/auth';

const schema = z.object({ items: z.array(z.string()), ballots: z.array(z.object({ userId: z.string(), orderedItemIds: z.array(z.string()) })) });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const packId = searchParams.get('packId');
  if (!packId) return NextResponse.json({ error: 'Missing packId' }, { status: 400 });

  const user = await getUserFromRequest(req);
  try {
    const payload = await getResults(packId, user?.id);
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ error: 'Could not load results.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const parsed = await parseBody(req, schema);
  if (parsed instanceof NextResponse) return parsed;
  const ranked = bordaCount(parsed.items, parsed.ballots);
  return NextResponse.json({ ranked, controversial: mostControversialItem(ranked), twins: tasteTwins(parsed.items, parsed.ballots) });
}
