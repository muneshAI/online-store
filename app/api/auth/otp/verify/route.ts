import { NextResponse } from 'next/server';
import { signAuthToken } from '@/lib/auth';
import { otpVerifySchema } from '@/lib/validators';

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = otpVerifySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.otp !== '123456') {
    return NextResponse.json({ message: 'Invalid OTP. Use 123456 in the demo environment.' }, { status: 401 });
  }

  const token = signAuthToken({
    sub: parsed.data.phone,
    phone: parsed.data.phone,
    role: parsed.data.role,
  });

  return NextResponse.json({ token, role: parsed.data.role });
}
