import { Metadata } from 'next';
import { VoidBubblesPageClient } from './VoidBubblesPageClient';

export const metadata: Metadata = {
  title: 'Void Bubbles — Live NEAR Ecosystem Visualization | Voidspace',
  description: 'Watch the NEAR ecosystem breathe in real-time. Every token as a living bubble — price action, health scores, whale alerts, and rug detection. Powered by Ref Finance + DexScreener.',
  keywords: ['NEAR', 'tokens', 'visualization', 'DeFi', 'bubbles', 'real-time', 'crypto', 'market', 'whale alerts'],
};

export default function VoidBubblesPage() {
  return <VoidBubblesPageClient />;
}
