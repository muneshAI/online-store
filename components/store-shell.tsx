import Link from 'next/link';
import { MessageCircleMore, PercentCircle, ShoppingCart, Store, Truck } from 'lucide-react';
import { StoreTemplate } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

export function StoreShell({ store }: { store: StoreTemplate }) {
  const featuredProduct = store.products[0];
  const vatRate = `${(store.taxRate * 100).toFixed(0)}%`;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 md:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-20">
          <div className="max-w-3xl space-y-5">
            <span className="inline-flex items-center rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-orange-200">
              {store.city}, Nepal • {store.category}
            </span>
            <h1 className="text-4xl font-black leading-tight md:text-6xl">{store.heroTitle}</h1>
            <p className="max-w-2xl text-lg text-slate-300">{store.heroSubtitle}</p>
            <div className="flex flex-wrap gap-3 text-sm text-slate-200">
              <span className="rounded-full border border-white/10 px-3 py-1">English / नेपाली</span>
              <span className="rounded-full border border-white/10 px-3 py-1">VAT {vatRate}</span>
              <span className="rounded-full border border-white/10 px-3 py-1">eSewa • Khalti • COD</span>
            </div>
          </div>
          <div className="card w-full max-w-md p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-sm uppercase tracking-[0.2em] text-slate-400">Featured drop</span>
              <Store className="h-5 w-5 text-orange-300" />
            </div>
            <img
              src={featuredProduct.images[0]}
              alt={featuredProduct.name}
              className="mt-4 h-64 w-full rounded-2xl object-cover"
            />
            <h2 className="mt-4 text-2xl font-bold">{featuredProduct.name}</h2>
            <p className="mt-2 text-sm text-slate-300">{featuredProduct.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xl font-semibold text-orange-200">{formatCurrency(featuredProduct.price)}</span>
              <button className="rounded-2xl bg-orange-500 px-4 py-2 font-semibold text-slate-950">
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:px-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-5 w-5 text-orange-300" />
              <h2 className="text-xl font-bold">Generated storefront pages</h2>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {['Homepage', 'Product listing page', 'Product detail page', 'Cart & checkout', 'About page', 'Contact page'].map((page) => (
                <div key={page} className="rounded-2xl border border-white/10 p-4 text-sm text-slate-300">
                  {page}
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold">Catalog preview</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {store.products.map((product) => (
                <article key={product.id} className="rounded-3xl border border-white/10 bg-slate-900/60 p-4">
                  <img src={product.images[0]} alt={product.name} className="h-52 w-full rounded-2xl object-cover" />
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="mt-1 text-sm text-slate-400">{product.category}</p>
                    </div>
                    <span className="text-orange-200">{formatCurrency(product.price)}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <span key={variant.name} className="rounded-full border border-white/10 px-2 py-1 text-xs text-slate-300">
                        {variant.name}: {variant.values.join(', ')}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-orange-300" />
              <h2 className="text-xl font-bold">Delivery zones</h2>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              {store.deliveryZones.map((zone) => (
                <div key={zone.city} className="rounded-2xl border border-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{zone.city}</span>
                    <span>{formatCurrency(zone.fee)}</span>
                  </div>
                  <p className="mt-1">{zone.district} district • ETA {zone.eta}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3">
              <PercentCircle className="h-5 w-5 text-orange-300" />
              <h2 className="text-xl font-bold">Promo & loyalty engine</h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>• Promo codes: NEW10, DASHAIN15, FLASH20</li>
              <li>• Flash sale scheduling for festive campaigns</li>
              <li>• Vendor commissions and payout tracking hooks</li>
            </ul>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3">
              <MessageCircleMore className="h-5 w-5 text-orange-300" />
              <h2 className="text-xl font-bold">Messaging channels</h2>
            </div>
            <p className="mt-4 text-sm text-slate-300">
              WhatsApp and Viber notifications are pre-wired for order confirmations and customer support.
            </p>
            <div className="mt-4 flex gap-3">
              <Link href="/admin" className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-950">
                Open admin
              </Link>
              <a href="#api" className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-semibold">
                View APIs
              </a>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
