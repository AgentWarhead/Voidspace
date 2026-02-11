import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Void Bubbles — Voidspace Observatory',
  description: 'Live NEAR Protocol ecosystem visualization. 150+ tokens as living, breathing bubbles with AI health scores, whale alerts, and real-time market data.',
  keywords: ['NEAR', 'bubble map', 'cryptocurrency', 'market cap', 'DeFi', 'token visualization'],
};

export default function VoidBubblesPage() {
  redirect('/observatory?tool=void-bubbles');
}
