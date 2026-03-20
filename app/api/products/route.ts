import { NextResponse } from 'next/server';
import { defaultStores } from '@/lib/data/stores';

export async function GET() {
  return NextResponse.json({
    stores: defaultStores.map((store) => ({
      slug: store.slug,
      name: store.name,
      category: store.category,
      products: store.products,
    })),
  });
}
