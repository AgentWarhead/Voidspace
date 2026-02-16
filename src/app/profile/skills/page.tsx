import { Metadata } from 'next';
import { Container } from '@/components/ui';
import { GridPattern } from '@/components/effects/GridPattern';
import { SkillConstellation } from './SkillConstellation';

export const metadata: Metadata = {
  title: 'Skill Constellation — Track Your NEAR Learning Progress | Voidspace',
  description: 'Visualize your NEAR Protocol learning journey. Track progress across Explorer, Builder, Hacker, and Founder tracks with an interactive skill constellation.',
  alternates: {
    canonical: 'https://voidspace.io/profile/skills',
  },
  openGraph: {
    title: 'Skill Constellation — Track Your NEAR Learning Progress | Voidspace',
    description: 'Visualize your learning journey across 4 NEAR Protocol tracks with an interactive skill constellation.',
    url: 'https://voidspace.io/profile/skills',
    siteName: 'Voidspace',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skill Constellation — NEAR Learning Progress | Voidspace',
    description: 'Track your progress across Explorer, Builder, Hacker, and Founder tracks.',
    creator: '@VoidSpaceNear',
  },
};

export default function SkillsPage() {
  return (
    <div className="min-h-screen relative">
      <GridPattern className="opacity-10" />
      <Container size="lg" className="relative z-10 py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <SkillConstellation />
      </Container>
    </div>
  );
}
