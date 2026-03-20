import { PaymentMethod } from '@/lib/types';

export interface PaymentGatewayConfig {
  id: PaymentMethod;
  label: string;
  checkoutUrl: string;
  secure: boolean;
  settlement: string;
}

export const paymentGateways: PaymentGatewayConfig[] = [
  {
    id: 'ESEWA',
    label: 'eSewa',
    checkoutUrl: 'https://developer.esewa.com.np/',
    secure: true,
    settlement: 'Instant mobile wallet confirmation',
  },
  {
    id: 'KHALTI',
    label: 'Khalti',
    checkoutUrl: 'https://docs.khalti.com/',
    secure: true,
    settlement: 'Token-based payment verification',
  },
  {
    id: 'FONEPAY',
    label: 'Fonepay',
    checkoutUrl: 'https://www.fonepay.com/',
    secure: true,
    settlement: 'QR and mobile-banking compatible',
  },
  {
    id: 'COD',
    label: 'Cash on Delivery',
    checkoutUrl: '/checkout/cod',
    secure: false,
    settlement: 'Collected by courier at delivery',
  },
];
