import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Void Bubbles — Live NEAR Token Intelligence | Voidspace',
  description: '150+ NEAR tokens visualized as living bubbles — AI health scores, whale alerts, and market signals the rest of the ecosystem hasn\'t noticed yet. Free to use.',
  keywords: ['NEAR analytics', 'token bubble map', 'NEAR DeFi', 'whale alerts', 'AI health score', 'NEAR token tracker', 'live market data'],
};

export default function VoidBubblesPage() {
  redirect('/observatory?tool=void-bubbles');
}
