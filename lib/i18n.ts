import { Locale } from '@/lib/types';

export const dictionary: Record<Locale, Record<string, string>> = {
  en: {
    generate: 'Generate store',
    payments: 'Payments',
    logistics: 'Logistics',
    admin: 'Admin dashboard',
    localized: 'Localized for Nepal',
    vatIncluded: 'VAT ready',
    cod: 'Cash on Delivery',
  },
  ne: {
    generate: 'स्टोर बनाउनुहोस्',
    payments: 'भुक्तानी',
    logistics: 'डेलिभरी',
    admin: 'एडमिन ड्यासबोर्ड',
    localized: 'नेपालका लागि तयार',
    vatIncluded: 'भ्याट समर्थन',
    cod: 'क्यास अन डेलिभरी',
  },
};

export const t = (locale: Locale, key: string) => dictionary[locale][key] ?? key;
