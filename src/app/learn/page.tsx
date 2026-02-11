import { Metadata } from 'next';
import { Container } from '@/components/ui';
import {
  HeroSection,
  LearningTracks,
  WhyNEAR,
  KeyTechnologies,
  RustSection,
  VoidspaceMetrics,
  VoidBubblesGuide,
  ResourceHub,
} from '@/components/learn';

export const metadata: Metadata = {
  title: 'Learn — Voidspace',
  description: 'Master NEAR Protocol: learning tracks, Rust smart contracts, key technologies, AI-powered void briefs, and everything you need to start building.',
};

export default function LearnPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />

      <Container className="pb-20 space-y-16">
        <LearningTracks />
        <WhyNEAR />
        <KeyTechnologies />
        <RustSection />
        <VoidspaceMetrics />
        <VoidBubblesGuide />
        <ResourceHub />
      </Container>
    </div>
  );
}
