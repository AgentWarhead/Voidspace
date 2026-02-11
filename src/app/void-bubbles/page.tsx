import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamic import — avoid loading D3 + framer-motion in the initial server bundle
const VoidBubblesPageClient = dynamic(
  () => import('./VoidBubblesPageClient').then(mod => ({ default: mod.VoidBubblesPageClient })),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center h-screen bg-[#04060b]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full border-2 border-[#00EC97]/30 border-t-[#00EC97] mx-auto animate-spin" />
          <p className="text-gray-400 text-sm font-mono">Loading Void Bubbles...</p>
        </div>
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: 'Void Bubbles — Live NEAR Ecosystem Visualization | Voidspace',
  description: 'Watch the NEAR ecosystem breathe in real-time. Every token as a living bubble — price action, health scores, whale alerts, and rug detection. Powered by Ref Finance + DexScreener.',
  keywords: ['NEAR', 'tokens', 'visualization', 'DeFi', 'bubbles', 'real-time', 'crypto', 'market', 'whale alerts'],
};

export default function VoidBubblesPage() {
  return (
    <>
      <link rel="preconnect" href="https://api.dexscreener.com" />
      <link rel="preconnect" href="https://indexer.ref.finance" />
      <link rel="dns-prefetch" href="https://api.dexscreener.com" />
      <link rel="dns-prefetch" href="https://indexer.ref.finance" />
      <VoidBubblesPageClient />
    </>
  );
}
