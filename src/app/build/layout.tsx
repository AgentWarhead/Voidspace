import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Build Plans — AI-Powered Project Blueprints | Voidspace',
  description:
    'Generate comprehensive build plans for NEAR Protocol projects. Market analysis, technical architecture, monetization strategy, and week-by-week roadmap.',
};

export default function BuildLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
