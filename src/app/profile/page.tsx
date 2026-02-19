import { Container } from '@/components/ui';
import { ProfileContent } from '@/components/profile/ProfileContent';
import { GridPattern } from '@/components/effects/GridPattern';

export const metadata = {
  title: 'Your Profile — Voidspace',
  description: 'Track your Voidspace progress, saved opportunities, learning achievements, and usage stats.',
  openGraph: {
    title: 'Your Profile — Voidspace',
    description: 'Track your Voidspace progress, saved opportunities, learning achievements, and usage stats.',
    url: 'https://voidspace.io/profile',
    siteName: 'Voidspace',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://voidspace.io/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Voidspace Profile',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Profile — Voidspace',
    description: 'Track your progress, learning achievements, and NEAR ecosystem activity.',
    creator: '@VoidSpaceIO',
    images: ['https://voidspace.io/og-image.jpg'],
  },
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
