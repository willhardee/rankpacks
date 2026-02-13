import { NextResponse } from 'next/server';
import { z } from 'zod';
import { parseBody } from '@/lib/api';
import { aggregatePackResults, getPack, listPackSubmissions } from '@/lib/core-flows';

const schema = z.object({ packId: z.string().min(1) });

export async function POST(req: Request) {
  const parsed = await parseBody(req, schema);
  if (parsed instanceof NextResponse) return parsed;

  const pack = await getPack(parsed.packId);
  if (!pack) return NextResponse.json({ error: 'Pack not found' }, { status: 404 });

  const submissions = await listPackSubmissions(parsed.packId);
  const aggregate = aggregatePackResults(pack.items.map((item) => item.id), submissions);

  return NextResponse.json({
    pack: { id: pack.id, title: pack.title, category: pack.category },
    aggregate,
    submissions
  });
}
