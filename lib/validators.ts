import { z } from 'zod';

export const generateStoreSchema = z.object({
  prompt: z.string().min(10),
  name: z.string().optional(),
  category: z.string().optional(),
  city: z.string().optional(),
});

export const createOrderSchema = z.object({
  storeSlug: z.string().min(2),
  customerName: z.string().min(2),
  phone: z.string().regex(/^(\+977|0)?9\d{9}$/),
  city: z.string().min(2),
  address: z.string().min(10),
  paymentMethod: z.enum(['ESEWA', 'KHALTI', 'FONEPAY', 'COD']),
  promoCode: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive(),
    })
  ).min(1),
});

export const otpRequestSchema = z.object({
  phone: z.string().regex(/^(\+977|0)?9\d{9}$/),
});

export const otpVerifySchema = z.object({
  phone: z.string().regex(/^(\+977|0)?9\d{9}$/),
  otp: z.string().length(6),
  role: z.enum(['ADMIN', 'CUSTOMER', 'VENDOR']).default('CUSTOMER'),
});
