import { NextResponse } from 'next/server';
import { z } from 'zod';
import { bordaCount, mostControversialItem, tasteTwins } from '@/lib/ranking';
import { parseBody } from '@/lib/api';

const schema = z.object({ items: z.array(z.string()), ballots: z.array(z.object({ userId: z.string(), orderedItemIds: z.array(z.string()) })) });

export async function POST(req: Request) {
  const parsed = await parseBody(req, schema);
  if (parsed instanceof NextResponse) return parsed;
  const ranked = bordaCount(parsed.items, parsed.ballots);
  return NextResponse.json({ ranked, controversial: mostControversialItem(ranked), twins: tasteTwins(parsed.items, parsed.ballots) });
}
