import { Container } from '@/components/ui';
import { ProfileContent } from '@/components/profile/ProfileContent';
import { GridPattern } from '@/components/effects/GridPattern';

export const metadata = {
  title: 'Your Profile — Voidspace',
  description: 'Track your Voidspace progress, saved opportunities, learning achievements, and usage stats.',
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen relative">
      <GridPattern className="opacity-10" />
      <Container size="lg" className="relative z-10 py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <ProfileContent />
      </Container>
    </div>
  );
}
