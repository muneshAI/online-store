import { NextResponse } from 'next/server';
import { getStoreBySlug } from '@/lib/data/stores';

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = getStoreBySlug(slug);

  if (!store) {
    return NextResponse.json({ message: 'Store not found' }, { status: 404 });
  }

  return NextResponse.json({ store });
}
