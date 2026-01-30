import { Container } from '@/components/ui';
import { ProfileContent } from '@/components/profile/ProfileContent';

export const metadata = {
  title: 'Profile — Voidspace',
  description: 'Your Voidspace profile, saved opportunities, and usage stats.',
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen">
      <Container size="lg" className="py-8">
        <ProfileContent />
      </Container>
    </div>
  );
}
