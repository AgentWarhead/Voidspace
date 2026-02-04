import { Metadata } from 'next';
import { ConstellationMap } from '@/components/features/ConstellationMap';

export const metadata: Metadata = {
  title: 'Constellation Mapping | Voidspace',
  description: 'Explore wallet relationships and transaction patterns on NEAR Protocol through interactive network visualizations.',
  keywords: ['NEAR Protocol', 'blockchain', 'wallet', 'network analysis', 'constellation mapping', 'DeFi'],
};

export default function ConstellationPage() {
  return (
    <div className="min-h-screen bg-background">
      <ConstellationMap />
    </div>
  );
}