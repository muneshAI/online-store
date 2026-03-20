import { NextResponse } from 'next/server';
import { calculateOrder } from '@/lib/order-service';
import { createOrderSchema } from '@/lib/validators';

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const order = calculateOrder(parsed.data);
    return NextResponse.json({
      ...order,
      status: parsed.data.paymentMethod === 'COD' ? 'awaiting_confirmation' : 'payment_pending_verification',
      securePaymentFlow: true,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Unable to create order' },
      { status: 404 }
    );
  }
}
