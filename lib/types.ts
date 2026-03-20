export type Locale = 'en' | 'ne';
export type PaymentMethod = 'ESEWA' | 'KHALTI' | 'FONEPAY' | 'COD';

export interface Variant {
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  currency: 'NPR';
  stock: number;
  images: string[];
  description: string;
  variants: Variant[];
  featured?: boolean;
}

export interface DeliveryZone {
  city: string;
  district: string;
  eta: string;
  fee: number;
}

export interface StoreBranding {
  primary: string;
  secondary: string;
  accent: string;
  theme: 'modern' | 'classic' | 'minimal';
}

export interface AnalyticsSnapshot {
  revenue: number;
  orders: number;
  conversionRate: number;
  returningCustomers: number;
}

export interface StoreTemplate {
  id: string;
  slug: string;
  prompt: string;
  name: string;
  category: string;
  city: string;
  district: string;
  heroTitle: string;
  heroSubtitle: string;
  languageSupport: Locale[];
  branding: StoreBranding;
  taxRate: number;
  paymentMethods: PaymentMethod[];
  deliveryZones: DeliveryZone[];
  products: Product[];
  analytics: AnalyticsSnapshot;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  whatsappNumber: string;
  viberNumber: string;
  featureFlags: {
    multiVendor: boolean;
    pwa: boolean;
    aiChatbot: boolean;
  };
}

export interface GeneratedStoreResponse {
  store: StoreTemplate;
  generatedAt: string;
  suggestions: string[];
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  storeSlug: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  paymentMethod: PaymentMethod;
  items: OrderItemInput[];
  promoCode?: string;
}
