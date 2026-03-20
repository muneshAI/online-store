import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { FeatureGrid } from '@/components/feature-grid';
import { StoreGeneratorForm } from '@/components/store-generator-form';
import { defaultStores } from '@/lib/data/stores';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 lg:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-orange-200">
              <Sparkles className="h-4 w-4" /> Nepal-focused AI commerce builder
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">
              Generate a <span className="gradient-text">production-ready online store</span> for Nepal from one prompt.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-300">
              Spin up storefront pages, VAT-aware checkout, eSewa and Khalti payment flows, mobile-first admin tools,
              delivery zoning, analytics, OTP auth, and multi-vendor capabilities tailored to Nepal.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-white/10 px-3 py-2">NPR pricing</span>
              <span className="rounded-full border border-white/10 px-3 py-2">English + Nepali</span>
              <span className="rounded-full border border-white/10 px-3 py-2">PWA + offline-ready</span>
              <span className="rounded-full border border-white/10 px-3 py-2">WhatsApp / Viber</span>
            </div>
            <Link
              href={`/stores/${defaultStores[0].slug}`}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950"
            >
              View demo store
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <StoreGeneratorForm />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <FeatureGrid />
      </section>

      <section id="api" className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="card p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-orange-300">API coverage</p>
          <h2 className="mt-3 text-3xl font-black">Included backend endpoints for store generation, checkout, auth, and catalog ops.</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              'POST /api/generate',
              'GET /api/products',
              'POST /api/orders',
              'POST /api/auth/otp/request',
              'POST /api/auth/otp/verify',
              'GET /stores/[slug]',
            ].map((route) => (
              <div key={route} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 font-mono text-sm text-slate-200">
                {route}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
