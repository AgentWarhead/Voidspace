import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sanctum — AI Development Studio | Voidspace',
  description: 'AI-powered development studio for NEAR Protocol. Build smart contracts, web apps, and deploy dApps through conversation with Claude AI.',
  openGraph: {
    title: 'Sanctum — AI Development Studio | Voidspace',
    description: 'Build on NEAR through conversation. Smart contracts, web apps, deployment — all AI-powered.',
  },
};

export default function SanctumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
