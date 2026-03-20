import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nepal Store Generator',
  description: 'AI-powered e-commerce store builder optimized for Nepal payments, VAT, and logistics.',
  openGraph: {
    title: 'Nepal Store Generator',
    description: 'Launch localized online stores for Kathmandu, Pokhara, and beyond in minutes.',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
