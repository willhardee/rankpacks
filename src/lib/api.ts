import { NextResponse } from 'next/server';
import { ZodSchema } from 'zod';

export async function parseBody<T>(req: Request, schema: ZodSchema<T>) {
  const json = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  return parsed.data;
}
