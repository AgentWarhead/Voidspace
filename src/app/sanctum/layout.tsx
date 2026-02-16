import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sanctum — AI Builder for NEAR Smart Contracts & dApps | Voidspace',
  description: 'Describe your idea, ship a NEAR dApp. AI writes Rust contracts, builds frontends, and deploys — all through conversation.',
  openGraph: {
    title: 'Sanctum — AI Builder for NEAR Smart Contracts & dApps | Voidspace',
    description: 'Describe your idea, ship a NEAR dApp. AI writes Rust contracts, builds frontends, and deploys.',
  },
};

export default function SanctumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
