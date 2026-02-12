import { Metadata } from 'next';
import { Container } from '@/components/ui';
import { GridPattern } from '@/components/effects/GridPattern';
import { SkillConstellation } from './SkillConstellation';

export const metadata: Metadata = {
  title: 'Skill Constellation — Voidspace',
  description: 'Track your NEAR learning progress across Explorer, Builder, Hacker, and Founder tracks.',
  alternates: {
    canonical: 'https://voidspace.io/profile/skills',
  },
};

export default function SkillsPage() {
  return (
    <div className="min-h-screen relative">
      <GridPattern className="opacity-10" />
      <Container size="lg" className="relative z-10 py-8">
        <SkillConstellation />
      </Container>
    </div>
  );
}
