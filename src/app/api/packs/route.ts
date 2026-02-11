import { NextResponse } from 'next/server';
import { packSchema } from '@/lib/schemas';
import { parseBody } from '@/lib/api';

export async function POST(req: Request) {
  const parsed = await parseBody(req, packSchema);
  if (parsed instanceof NextResponse) return parsed;
  return NextResponse.json({ ok: true, pack: parsed });
}
