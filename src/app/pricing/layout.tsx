import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — Voidspace',
  description: 'Sanctum AI builder pricing. Free tier with $2.50 credits. Upgrade for unlimited NEAR development with Claude AI.',
  openGraph: {
    title: 'Pricing — Voidspace',
    description: 'Sanctum AI builder pricing. Free tier with $2.50 credits. Upgrade for unlimited NEAR development.',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
