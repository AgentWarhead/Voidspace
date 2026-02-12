import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { FounderModuleLayout } from './FounderModuleLayout';

// ─── Module Registry ───────────────────────────────────────────────────────────

export interface FounderModule {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  order: number;
}

export const FOUNDER_MODULES: FounderModule[] = [
  { slug: 'near-grants-funding', title: 'NEAR Grants & Funding', description: 'Navigate the NEAR grants ecosystem — DevHub, Ecosystem Fund, and community funding opportunities.', readTime: '15 min', order: 1 },
  { slug: 'tokenomics-design', title: 'Tokenomics Design', description: 'Design sustainable token economics for your project — supply, distribution, utility, and incentive models.', readTime: '20 min', order: 2 },
  { slug: 'building-in-public', title: 'Building in Public', description: 'Leverage transparency as a growth strategy — sharing progress, gathering feedback, and building community.', readTime: '15 min', order: 3 },
  { slug: 'pitching-your-project', title: 'Pitching Your Project', description: 'Craft compelling pitches for grants, investors, and accelerators in the NEAR ecosystem.', readTime: '15 min', order: 4 },
  { slug: 'revenue-models-for-dapps', title: 'Revenue Models for dApps', description: 'Explore proven revenue models for decentralized applications — fees, subscriptions, and token-based monetization.', readTime: '18 min', order: 5 },
];

// ─── Static Params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return FOUNDER_MODULES.map((mod) => ({ slug: mod.slug }));
}

// ─── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const mod = FOUNDER_MODULES.find((m) => m.slug === slug);
  if (!mod) return { title: 'Module Not Found' };
  return {
    title: `${mod.title} — Founder Track | Voidspace`,
    description: mod.description,
    alternates: {
      canonical: `https://voidspace.io/learn/founder/${mod.slug}`,
    },
  };
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function FounderModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const moduleIndex = FOUNDER_MODULES.findIndex((m) => m.slug === slug);
  if (moduleIndex === -1) notFound();

  const currentModule = FOUNDER_MODULES[moduleIndex];
  const prevModule = moduleIndex > 0 ? FOUNDER_MODULES[moduleIndex - 1] : null;
  const nextModule = moduleIndex < FOUNDER_MODULES.length - 1 ? FOUNDER_MODULES[moduleIndex + 1] : null;

  return (
    <FounderModuleLayout
      currentModule={currentModule}
      prevModule={prevModule}
      nextModule={nextModule}
      totalModules={FOUNDER_MODULES.length}
      currentIndex={moduleIndex}
    />
  );
}
