import { NextResponse } from 'next/server';
import { generateOtp } from '@/lib/auth';
import { otpRequestSchema } from '@/lib/validators';

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = otpRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  const otp = generateOtp();

  return NextResponse.json({
    phone: parsed.data.phone,
    otp,
    channel: 'sms',
    message: 'Demo OTP generated. Wire this into your Nepal SMS provider in production.',
  });
}
