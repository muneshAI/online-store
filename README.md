# Nepal Store Generator

Production-grade, prompt-driven e-commerce store generator built with **Next.js**, **Tailwind CSS**, **TypeScript**, and a **PostgreSQL + Prisma** data model. It is tailored for the Nepal market with NPR pricing, VAT support, local city delivery zoning, mobile-first UX, and wallet payment integrations.

## Highlights

- **AI Store Builder**: Create a store from a prompt such as `Create a clothing store for Kathmandu`.
- **Auto-generated storefront**: Homepage, product list, product detail, cart/checkout, about, and contact surface patterns.
- **Nepal localization**: NPR currency, VAT handling, English + Nepali toggle, Nepal city/district delivery logic.
- **Nepal payment adapters**: eSewa, Khalti, Fonepay (adapter-ready), and Cash on Delivery.
- **Admin dashboard**: Product management, inventory, orders, bulk CSV import workflow, analytics.
- **Security**: Zod input validation, JWT session issuing, OTP login API, role-ready auth model.
- **Growth features**: Multi-vendor foundation, promo/discount engine, WhatsApp/Viber notifications, SEO metadata, PWA support, offline caching, chatbot-ready architecture.

## Tech Stack

- **Frontend**: Next.js 15 App Router, React 19, Tailwind CSS
- **Backend**: Next.js Route Handlers (Node.js runtime)
- **Database**: PostgreSQL with Prisma schema
- **Validation/Auth**: Zod, jsonwebtoken

## Folder Structure

```text
.
├── app/
│   ├── api/
│   │   ├── auth/otp/request/route.ts
│   │   ├── auth/otp/verify/route.ts
│   │   ├── generate/route.ts
│   │   ├── orders/route.ts
│   │   ├── products/route.ts
│   │   └── stores/[slug]/route.ts
│   ├── admin/page.tsx
│   ├── stores/[slug]/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── manifest.ts
│   └── page.tsx
├── components/
│   ├── admin-dashboard.tsx
│   ├── feature-grid.tsx
│   ├── store-generator-form.tsx
│   └── store-shell.tsx
├── lib/
│   ├── auth.ts
│   ├── data/stores.ts
│   ├── db.ts
│   ├── i18n.ts
│   ├── order-service.ts
│   ├── payments.ts
│   ├── types.ts
│   ├── utils.ts
│   └── validators.ts
├── prisma/schema.prisma
├── public/icon.svg
├── public/sw.js
└── README.md
```

## Core User Flows

### 1. Store Generation Engine
1. User submits a prompt to `POST /api/generate`.
2. Server validates request via Zod.
3. Generator infers store name, category, theme, products, delivery zones, and metadata.
4. Frontend redirects to `/stores/[slug]` to render the localized storefront.

### 2. Checkout Flow
1. Product selection happens on the generated storefront.
2. Checkout payload posts to `POST /api/orders`.
3. Backend calculates subtotal, promo discounts, VAT, delivery fee, and total.
4. The response marks secure payment verification for eSewa/Khalti/Fonepay or COD confirmation.

### 3. OTP Authentication Flow
1. `POST /api/auth/otp/request` receives a Nepal mobile number.
2. A demo OTP is generated and returned (wire this to SMS in production).
3. `POST /api/auth/otp/verify` validates the OTP and returns a JWT token with role claims.

## API Routes

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/generate` | Generate an AI-configured Nepal storefront from a prompt |
| GET | `/api/products` | Fetch demo stores and their product catalogs |
| POST | `/api/orders` | Create an order with VAT, promo code, and delivery zone calculation |
| POST | `/api/auth/otp/request` | Request a mobile OTP for login |
| POST | `/api/auth/otp/verify` | Verify OTP and receive JWT token |
| GET | `/api/stores/[slug]` | Fetch a generated store definition |

## Database Schema Overview

The Prisma schema includes:

- `User` with roles for **ADMIN**, **CUSTOMER**, and **VENDOR**.
- `Store` holding localization, branding, SEO, VAT, and feature flags.
- `Vendor` to support Daraz-style multi-vendor storefronts.
- `Category`, `Product`, `Variant`, and `ProductImage` for catalog management.
- `DeliveryZone` for city/district logistics pricing.
- `PromoCode` for discount campaigns.
- `Order` and `OrderItem` for checkout, status tracking, payment refs, and courier refs.

## Payment Integration Notes

### eSewa
- Use `POST /api/orders` as the order pre-creation step.
- Redirect to eSewa payment page with the created order reference.
- Verify payment server-side before moving order status to `PAID`.

### Khalti
- Tokenize payment on the frontend.
- Verify token with Khalti secret key on a secure backend callback.
- Persist `paymentRef` in the `Order` record.

### Fonepay
- Adapter placeholder exists in `lib/payments.ts`.
- Add merchant config, QR/banking callbacks, and status webhooks as needed.

### Cash on Delivery
- Supported as a first-class checkout method.
- Use a confirmation step before dispatch and notify via WhatsApp/Viber.

## Localization Strategy

- **Currency**: `Intl.NumberFormat('en-NP', { currency: 'NPR' })`
- **Languages**: English/Nepali dictionary in `lib/i18n.ts`
- **Cities/Districts**: Delivery zoning examples for Kathmandu, Pokhara, Biratnagar
- **VAT**: Configured as `13%` in demo stores and schema-backed for per-store settings

## Deployment Guide

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
3. Update `DATABASE_URL` and `JWT_SECRET`.
4. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
5. (Optional) Run migrations once PostgreSQL is available:
   ```bash
   npm run prisma:migrate
   ```
6. Start the dev server:
   ```bash
   npm run dev
   ```

### Deploy to Vercel

1. Push the repository to GitHub/GitLab/Bitbucket.
2. Import the project into Vercel.
3. Set environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL`
4. Use a hosted PostgreSQL provider (Neon, Supabase, RDS, etc.).
5. Configure the build command:
   ```bash
   npm run build
   ```
6. Configure the install command:
   ```bash
   npm install
   ```
7. Run `prisma migrate deploy` as part of the deployment pipeline if you have migrations committed.

## SEO & Marketing Coverage

- SEO-friendly slugs for stores/products.
- Auto-generated title/description/keywords per store.
- Open Graph metadata in the root layout.
- Analytics snapshot data surfaced in the admin UI.
- Social-share-ready metadata model included in the store template.

## PWA / Offline / Notifications

- `app/manifest.ts` provides installable PWA metadata.
- `public/sw.js` provides a starter service worker for offline caching.
- Extend with Web Push (Firebase, OneSignal, or custom VAPID) for notifications.

## Production Hardening Checklist

- Replace demo OTP and mock JWT flow with a real SMS gateway and secure session storage.
- Add server-side payment verification callbacks for each wallet provider.
- Persist generated stores and orders into PostgreSQL using Prisma services.
- Add admin authorization middleware and audit logging.
- Add image upload storage (S3, Cloudinary, or Supabase Storage).
- Add rate limiting and bot protection for public APIs.
- Add testing pipelines (unit, integration, e2e) in CI.

## Suggested Next Steps

1. Connect Prisma-backed repositories instead of demo in-memory data.
2. Add vendor onboarding and commission payout UI.
3. Implement cart state, checkout UI forms, and hosted payment redirects.
4. Add CSV parser/import jobs and analytics charts with real data.
5. Add chatbot orchestration using the OpenAI API or another LLM provider.
