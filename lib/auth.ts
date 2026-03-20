import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'development-secret';

export interface AuthPayload {
  sub: string;
  role: 'ADMIN' | 'CUSTOMER' | 'VENDOR';
  phone: string;
}

export const signAuthToken = (payload: AuthPayload) =>
  jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '7d' });

export const verifyAuthToken = (token: string) => jwt.verify(token, secret) as AuthPayload;

export const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
