import { GeneratedStoreResponse, StoreTemplate } from '@/lib/types';
import { slugify } from '@/lib/utils';

const sampleProducts = (category: string): StoreTemplate['products'] => [
  {
    id: 'p1',
    name: `${category} Signature Drop`,
    slug: `${slugify(category)}-signature-drop`,
    category,
    price: 2499,
    compareAtPrice: 3200,
    currency: 'NPR',
    stock: 24,
    images: ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80'],
    description: `Best-selling ${category.toLowerCase()} item tuned for urban Nepal shoppers.`,
    variants: [
      { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
      { name: 'Color', values: ['Black', 'White', 'Red'] },
    ],
    featured: true,
  },
  {
    id: 'p2',
    name: `${category} Everyday Essential`,
    slug: `${slugify(category)}-everyday-essential`,
    category,
    price: 1799,
    currency: 'NPR',
    stock: 56,
    images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80'],
    description: `Affordable ${category.toLowerCase()} design for delivery across Kathmandu Valley and beyond.`,
    variants: [
      { name: 'Size', values: ['38', '39', '40', '41', '42'] },
      { name: 'Color', values: ['Blue', 'Grey'] },
    ],
  },
  {
    id: 'p3',
    name: `${category} Festival Edition`,
    slug: `${slugify(category)}-festival-edition`,
    category,
    price: 3999,
    currency: 'NPR',
    stock: 18,
    images: ['https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80'],
    description: 'Premium collection designed for festive campaigns and flash sales.',
    variants: [
      { name: 'Size', values: ['Free Size', 'Regular'] },
      { name: 'Color', values: ['Maroon', 'Olive', 'Cream'] },
    ],
  },
];

export const defaultStores: StoreTemplate[] = [
  {
    id: 'store-kathmandu-kicks',
    slug: 'kathmandu-kicks',
    prompt: 'Create a sneaker store for Nepal',
    name: 'Kathmandu Kicks',
    category: 'Sneakers',
    city: 'Kathmandu',
    district: 'Kathmandu',
    heroTitle: 'Nepal-first sneaker commerce that feels premium on every phone.',
    heroSubtitle: 'Launch localized checkout, eSewa, Khalti, COD, and fast delivery zones in minutes.',
    languageSupport: ['en', 'ne'],
    branding: { primary: '#0f172a', secondary: '#f97316', accent: '#22c55e', theme: 'modern' },
    taxRate: 0.13,
    paymentMethods: ['ESEWA', 'KHALTI', 'FONEPAY', 'COD'],
    deliveryZones: [
      { city: 'Kathmandu', district: 'Kathmandu', eta: 'Same day', fee: 150 },
      { city: 'Pokhara', district: 'Kaski', eta: '1-2 days', fee: 250 },
      { city: 'Biratnagar', district: 'Morang', eta: '2-3 days', fee: 300 },
    ],
    products: sampleProducts('Sneakers'),
    analytics: { revenue: 420000, orders: 184, conversionRate: 4.8, returningCustomers: 39 },
    seo: {
      title: 'Kathmandu Kicks | Nepal Sneaker Store Generator Demo',
      description: 'A demo sneaker store with Nepal payment gateways, bilingual UI, VAT, and courier zones.',
      keywords: ['Nepal sneakers', 'Kathmandu ecommerce', 'eSewa checkout'],
    },
    whatsappNumber: '+9779800000001',
    viberNumber: '+9779800000001',
    featureFlags: { multiVendor: true, pwa: true, aiChatbot: true },
  },
];

export const inferTheme = (category: string) => {
  const lower = category.toLowerCase();
  if (lower.includes('fashion') || lower.includes('clothing')) {
    return { primary: '#7c3aed', secondary: '#fb7185', accent: '#f59e0b', theme: 'modern' as const };
  }
  if (lower.includes('grocery') || lower.includes('organic')) {
    return { primary: '#14532d', secondary: '#84cc16', accent: '#facc15', theme: 'classic' as const };
  }
  return { primary: '#0f172a', secondary: '#f97316', accent: '#06b6d4', theme: 'minimal' as const };
};

export const createGeneratedStore = (prompt: string, name?: string, category?: string, city?: string): GeneratedStoreResponse => {
  const inferredCategory = category || (prompt.match(/clothing|fashion|sneaker|grocery|electronics/i)?.[0] ?? 'Lifestyle');
  const inferredCity = city || (prompt.match(/kathmandu|pokhara|biratnagar|lalitpur|butwal/i)?.[0] ?? 'Kathmandu');
  const displayCity = inferredCity.charAt(0).toUpperCase() + inferredCity.slice(1).toLowerCase();
  const storeName = name || `${displayCity} ${inferredCategory.charAt(0).toUpperCase() + inferredCategory.slice(1)} Hub`;

  const store: StoreTemplate = {
    id: `generated-${slugify(storeName)}`,
    slug: slugify(storeName),
    prompt,
    name: storeName,
    category: inferredCategory,
    city: displayCity,
    district: displayCity,
    heroTitle: `${storeName} is ready to sell across Nepal with wallet payments and COD.`,
    heroSubtitle: `Built from your prompt, optimized for ${displayCity}, bilingual shoppers, and low-bandwidth mobile users.`,
    languageSupport: ['en', 'ne'],
    branding: inferTheme(inferredCategory),
    taxRate: 0.13,
    paymentMethods: ['ESEWA', 'KHALTI', 'COD'],
    deliveryZones: [
      { city: displayCity, district: displayCity, eta: 'Same day', fee: 120 },
      { city: 'Pokhara', district: 'Kaski', eta: '1-2 days', fee: 240 },
      { city: 'Biratnagar', district: 'Morang', eta: '2-3 days', fee: 320 },
    ],
    products: sampleProducts(inferredCategory),
    analytics: { revenue: 120000, orders: 48, conversionRate: 3.9, returningCustomers: 16 },
    seo: {
      title: `${storeName} | AI-generated Nepal Store`,
      description: `Shop ${inferredCategory} in ${displayCity} with localized checkout, VAT, and delivery zones.`,
      keywords: [storeName, inferredCategory, displayCity, 'Nepal ecommerce generator'],
    },
    whatsappNumber: '+9779800000002',
    viberNumber: '+9779800000002',
    featureFlags: { multiVendor: true, pwa: true, aiChatbot: true },
  };

  return {
    store,
    generatedAt: new Date().toISOString(),
    suggestions: [
      'Enable multi-vendor onboarding for local suppliers.',
      'Connect eSewa merchant credentials in environment variables.',
      'Use CSV bulk import to seed 100+ SKUs instantly.',
    ],
  };
};

export const getStoreBySlug = (slug: string) => defaultStores.find((store) => store.slug === slug);
