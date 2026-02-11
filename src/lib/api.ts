import { NextResponse } from 'next/server';
import { ZodSchema } from 'zod';

const formDataToObject = (formData: FormData) => {
  const entries = Array.from(formData.entries());
  return entries.reduce<Record<string, string | string[]>>((acc, [key, value]) => {
    const nextValue = String(value);
    const existing = acc[key];

    if (existing === undefined) {
      acc[key] = nextValue;
      return acc;
    }

    acc[key] = Array.isArray(existing) ? [...existing, nextValue] : [existing, nextValue];
    return acc;
  }, {});
};

export async function parseBody<T>(req: Request, schema: ZodSchema<T>) {
  const contentType = req.headers.get('content-type')?.toLowerCase() ?? '';

  const body = contentType.includes('application/json')
    ? await req.json().catch(() => ({}))
    : await req.formData().then(formDataToObject).catch(() => ({}));

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  return parsed.data;
}
