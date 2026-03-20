import { NextResponse } from 'next/server';
import { createGeneratedStore } from '@/lib/data/stores';
import { generateStoreSchema } from '@/lib/validators';

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = generateStoreSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  const generated = createGeneratedStore(
    parsed.data.prompt,
    parsed.data.name,
    parsed.data.category,
    parsed.data.city
  );

  return NextResponse.json(generated, { status: 201 });
}
