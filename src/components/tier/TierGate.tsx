'use client';

import { Lock } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { useWallet } from '@/hooks/useWallet';
import { useUser } from '@/hooks/useUser';
import { TIERS } from '@/lib/tiers';
import type { TierName } from '@/types';

interface TierGateProps {
  requiredTier: TierName;
  feature: string;
  children: React.ReactNode;
}

const TIER_ORDER: TierName[] = ['shade', 'specter', 'legion', 'leviathan'];

export function TierGate({ requiredTier, feature, children }: TierGateProps) {
  const { isConnected, openModal } = useWallet();
  const { user } = useUser();

  if (!isConnected) {
    return (
      <Card padding="lg" className="text-center">
        <Lock className="w-8 h-8 text-text-muted mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Connect Wallet
        </h3>
        <p className="text-sm text-text-secondary mb-4">
          Connect your NEAR wallet to {feature}.
        </p>
        <Button variant="primary" onClick={openModal}>
          Connect Wallet
        </Button>
      </Card>
    );
  }

  const userTier = user?.tier as TierName || 'shade';
  const userTierIndex = TIER_ORDER.indexOf(userTier);
  const requiredTierIndex = TIER_ORDER.indexOf(requiredTier);

  if (userTierIndex >= requiredTierIndex) {
    return <>{children}</>;
  }

  const requiredConfig = TIERS[requiredTier];

  return (
    <Card padding="lg" className="text-center">
      <Lock className="w-8 h-8 text-text-muted mx-auto mb-3" />
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        Upgrade Required
      </h3>
      <p className="text-sm text-text-secondary mb-4">
        {feature} requires the{' '}
        <Badge
          variant="tier"
          tier={requiredTier}
        >
          {requiredConfig.name}
        </Badge>{' '}
        plan or higher.
      </p>
      <div className="inline-block px-4 py-2 rounded-lg bg-surface-hover text-sm text-text-secondary">
        Starting at ${requiredConfig.price}/month
      </div>
    </Card>
  );
}
