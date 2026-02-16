import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — Sanctum AI Builder for NEAR | Voidspace',
  description: 'Start free with $2.50 in credits. Scale your NEAR builds with Claude-powered AI. Plans from $0 to $200/mo.',
  openGraph: {
    title: 'Pricing — Sanctum AI Builder for NEAR | Voidspace',
    description: 'Start free with $2.50 in credits. Scale your NEAR builds with Claude-powered AI.',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
