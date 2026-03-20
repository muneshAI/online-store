import { BarChart3, Boxes, FileSpreadsheet, PackageSearch, Shield, ShoppingBag } from 'lucide-react';
import { defaultStores } from '@/lib/data/stores';
import { formatCurrency } from '@/lib/utils';

const store = defaultStores[0];

export function AdminDashboard() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-orange-300">Admin dashboard</p>
            <h1 className="mt-2 text-4xl font-black">Operate your Nepal-ready commerce stack.</h1>
            <p className="mt-3 max-w-3xl text-slate-300">
              Manage inventory, orders, vendors, OTP-based access, and analytics from a mobile-first control center.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
            <div className="card p-4"><p className="text-slate-400">Revenue</p><p className="mt-2 text-xl font-bold">{formatCurrency(store.analytics.revenue)}</p></div>
            <div className="card p-4"><p className="text-slate-400">Orders</p><p className="mt-2 text-xl font-bold">{store.analytics.orders}</p></div>
            <div className="card p-4"><p className="text-slate-400">Conversion</p><p className="mt-2 text-xl font-bold">{store.analytics.conversionRate}%</p></div>
            <div className="card p-4"><p className="text-slate-400">Returning</p><p className="mt-2 text-xl font-bold">{store.analytics.returningCustomers}%</p></div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            { title: 'Products', value: store.products.length, icon: ShoppingBag, note: 'Variants, images, bulk CSV import' },
            { title: 'Inventory', value: store.products.reduce((sum, p) => sum + p.stock, 0), icon: Boxes, note: 'Track stock per SKU and vendor' },
            { title: 'Orders', value: 42, icon: PackageSearch, note: 'Status workflow: paid, packed, dispatched' },
            { title: 'Analytics', value: '7d', icon: BarChart3, note: 'Sales, AOV, channel performance' },
            { title: 'OTP Access', value: '2FA', icon: Shield, note: 'Phone-first login with JWT sessions' },
            { title: 'Bulk Import', value: 'CSV', icon: FileSpreadsheet, note: 'Map supplier sheets into product records' },
          ].map(({ title, value, icon: Icon, note }) => (
            <div key={title} className="card p-6">
              <Icon className="h-8 w-8 text-orange-300" />
              <h2 className="mt-4 text-2xl font-bold">{title}</h2>
              <p className="mt-2 text-3xl font-black text-orange-100">{value}</p>
              <p className="mt-2 text-sm text-slate-300">{note}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
          <div className="card p-6">
            <h2 className="text-2xl font-bold">Product management workflow</h2>
            <div className="mt-4 space-y-4 text-sm text-slate-300">
              <p>• Add and edit products with categories, size/color variants, pricing, compare-at pricing, and image galleries.</p>
              <p>• Bulk import supplier inventories via CSV mapping.</p>
              <p>• Support multi-vendor catalog ownership and commission percentages.</p>
              <p>• Schedule flash sales and promo code activation by city or nationwide campaign.</p>
            </div>
          </div>
          <div className="card p-6">
            <h2 className="text-2xl font-bold">Order operations</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>• eSewa/Khalti/Fonepay verification before fulfillment.</p>
              <p>• COD confirmation workflow with WhatsApp/Viber notifications.</p>
              <p>• Courier handoff metadata for district delivery zones.</p>
              <p>• Refund and cancellation status tracking.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
