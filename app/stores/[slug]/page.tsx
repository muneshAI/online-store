import { notFound } from 'next/navigation';
import { StoreShell } from '@/components/store-shell';
import { createGeneratedStore, defaultStores, getStoreBySlug } from '@/lib/data/stores';

export function generateStaticParams() {
  return defaultStores.map((store) => ({ slug: store.slug }));
}

export default async function StorePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ prompt?: string }>;
}) {
  const { slug } = await params;
  const { prompt } = await searchParams;
  const existingStore = getStoreBySlug(slug);

  if (existingStore) {
    return <StoreShell store={existingStore} />;
  }

  if (prompt) {
    const generated = createGeneratedStore(prompt);
    if (generated.store.slug === slug) {
      return <StoreShell store={generated.store} />;
    }
  }

  notFound();
}
