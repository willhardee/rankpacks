import { NextResponse } from 'next/server';
import { packSchema } from '@/lib/schemas';
import { parseBody } from '@/lib/api';
import { createPackRecord } from '@/lib/core-flows';

const parseItems = (value: unknown, text?: string) => {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (text) {
    return text
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

export async function POST(req: Request) {
  const parsed = await parseBody(req, packSchema);
  if (parsed instanceof NextResponse) return parsed;

  const items = parseItems(parsed.items, parsed.itemsText);
  if (items.length < 2) {
    return NextResponse.json({ error: 'Add at least two items to create a pack.' }, { status: 400 });
  }

  try {
    const pack = await createPackRecord({
      title: parsed.title,
      category: parsed.category,
      visibility: parsed.visibility,
      items,
      creatorName: parsed.creatorName
    });

    const isFormPost = (req.headers.get('content-type') ?? '').includes('form');
    if (isFormPost) {
      return NextResponse.redirect(new URL(`/p/${pack.id}?created=1`, req.url), { status: 303 });
    }

    return NextResponse.json({ ok: true, pack: { id: pack.id } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to create pack' }, { status: 500 });
  }
}
