import { CreateOrderInput } from '@/lib/types';
import { getStoreBySlug } from '@/lib/data/stores';

const promoDiscounts: Record<string, number> = {
  NEW10: 0.1,
  DASHAIN15: 0.15,
  FLASH20: 0.2,
};

export const calculateOrder = (input: CreateOrderInput) => {
  const store = getStoreBySlug(input.storeSlug);
  if (!store) {
    throw new Error('Store not found');
  }

  const products = input.items.map((item) => {
    const product = store.products.find((entry) => entry.id === item.productId);
    if (!product) {
      throw new Error(`Product ${item.productId} not found`);
    }
    return { product, quantity: item.quantity, lineTotal: product.price * item.quantity };
  });

  const subtotal = products.reduce((total, entry) => total + entry.lineTotal, 0);
  const deliveryFee = store.deliveryZones.find((zone) => zone.city.toLowerCase() === input.city.toLowerCase())?.fee ?? 350;
  const discountRate = input.promoCode ? promoDiscounts[input.promoCode.toUpperCase()] ?? 0 : 0;
  const discount = subtotal * discountRate;
  const taxableAmount = subtotal - discount;
  const vat = taxableAmount * store.taxRate;
  const total = taxableAmount + vat + deliveryFee;

  return {
    orderId: `NP-${Date.now()}`,
    store: store.name,
    paymentMethod: input.paymentMethod,
    subtotal,
    discount,
    vat,
    deliveryFee,
    total,
    courierReady: true,
    customerNotification: {
      whatsapp: store.whatsappNumber,
      viber: store.viberNumber,
    },
  };
};
