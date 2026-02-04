import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { PulseStreams } from '@/components/features/PulseStreams';

export const metadata: Metadata = {
  title: 'Pulse Streams - Real-time Transaction Feed | Voidspace',
  description: 'Real-time NEAR blockchain transaction feed with advanced filtering and live updates. Monitor ecosystem activity as it happens.',
  keywords: ['NEAR', 'transactions', 'real-time', 'blockchain', 'live', 'monitoring'],
};

export default function PulseStreamsPage() {
  return (
    <Container className="py-12">
      <PulseStreams />
    </Container>
  );
}