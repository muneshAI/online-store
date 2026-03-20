import { Banknote, Languages, LayoutDashboard, ShieldCheck, Truck, Store } from 'lucide-react';

const features = [
  {
    icon: Store,
    title: 'Store generation engine',
    description: 'Homepage, product list, PDP, cart, checkout, and about/contact pages generated from one prompt.',
  },
  {
    icon: Languages,
    title: 'Nepal localization',
    description: 'NPR pricing, English/Nepali toggle, city-aware fulfillment, and VAT-friendly calculations.',
  },
  {
    icon: Banknote,
    title: 'Nepal payments',
    description: 'eSewa, Khalti, Fonepay-ready adapters, plus COD fallback for higher conversion.',
  },
  {
    icon: Truck,
    title: 'Delivery zoning',
    description: 'District-based fees, ETA rules, and local courier handoff support.',
  },
  {
    icon: LayoutDashboard,
    title: 'Admin suite',
    description: 'Product CRUD, order operations, stock tracking, analytics, and CSV import workflows.',
  },
  {
    icon: ShieldCheck,
    title: 'Security built in',
    description: 'JWT auth, OTP login, Zod validation, payment verification hooks, and role-based access.',
  },
];

export function FeatureGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {features.map(({ icon: Icon, title, description }) => (
        <article key={title} className="card p-5">
          <Icon className="mb-4 h-8 w-8 text-orange-300" />
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
        </article>
      ))}
    </div>
  );
}
