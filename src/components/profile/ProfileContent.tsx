'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, Shield, FileText, Calendar, ExternalLink, Bookmark } from 'lucide-react';
import { Card, Badge, Button, Progress, VoidEmptyState } from '@/components/ui';
import { PageTransition } from '@/components/effects/PageTransition';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GradientText } from '@/components/effects/GradientText';
import { AnimatedBorderCard } from '@/components/effects/AnimatedBorderCard';
import { ScanLine } from '@/components/effects/ScanLine';
import { useWallet } from '@/hooks/useWallet';
import { useUser } from '@/hooks/useUser';
import { TIERS } from '@/lib/tiers';
import { timeAgo } from '@/lib/utils';
import type { TierName, SavedOpportunity } from '@/types';

interface UsageStats {
  briefsThisMonth: number;
  previewsToday: number;
  savedCount: number;
}

export function ProfileContent() {
  const { isConnected, accountId, openModal } = useWallet();
  const { user, isLoading } = useUser();
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [saved, setSaved] = useState<SavedOpportunity[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      // Fetch usage
      fetch(`/api/usage?userId=${user.id}`)
        .then((r) => r.json())
        .then(setUsage)
        .catch(() => {});

      // Fetch saved opportunities
      setSavedLoading(true);
      fetch(`/api/saved?userId=${user.id}`)
        .then((r) => r.json())
        .then((data) => setSaved(data.saved || []))
        .catch(() => {})
        .finally(() => setSavedLoading(false));
    }
  }, [user?.id]);

  if (!isConnected) {
    return (
      <Card variant="glass" padding="lg">
        <VoidEmptyState
          icon={User}
          title="Connect Your Wallet"
          description="Connect your NEAR wallet to view your profile, saved opportunities, and usage stats."
          action={
            <Button variant="primary" size="lg" onClick={openModal} className="hover:shadow-[0_0_24px_rgba(0,236,151,0.4)]">
              Connect Wallet
            </Button>
          }
        />
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-surface rounded-xl animate-pulse" />
        <div className="h-48 bg-surface rounded-xl animate-pulse" />
      </div>
    );
  }

  const tier = (user?.tier as TierName) || 'shade';
  const tierConfig = TIERS[tier];

  // Extract display name from account ID (e.g. "alice.near" → "Alice")
  const displayName = accountId
    ? accountId.replace(/\.(near|testnet)$/, '').replace(/^\w/, (c: string) => c.toUpperCase())
    : 'Explorer';

  return (
    <PageTransition className="space-y-8">
      <GradientText as="h1" className="text-3xl font-bold">
        Welcome back, {displayName}
      </GradientText>

      {/* User Info */}
      <ScrollReveal>
        <Card variant="glass" padding="lg" className="relative overflow-hidden">
          <ScanLine />
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-near-green/20 flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-near-green" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-text-primary truncate font-mono">
                {accountId}
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <Badge variant="tier" tier={tier}>
                  {tierConfig.name}
                </Badge>
                {user?.created_at && (
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Joined {timeAgo(user.created_at)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </ScrollReveal>

      {/* Tier + Usage */}
      <ScrollReveal delay={0.1}>
        <SectionHeader title="Plan & Usage" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Plan */}
          <AnimatedBorderCard padding="lg">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-near-green" />
              <h3 className="font-semibold text-text-primary">Current Plan</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Tier</span>
                <Badge variant="tier" tier={tier}>{tierConfig.name}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Briefs/Month</span>
                <span className="text-text-primary font-mono">{tierConfig.briefsPerMonth}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Max Saved</span>
                <span className="text-text-primary font-mono">{tierConfig.maxSaved}</span>
              </div>
              {tierConfig.price !== null && tierConfig.price > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Price</span>
                  <span className="text-text-primary font-mono">${tierConfig.price}/mo</span>
                </div>
              )}
            </div>
            {tier === 'shade' && (
              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-xs text-text-muted mb-2">
                  Upgrade to generate AI project briefs and save unlimited opportunities.
                </p>
                <Button variant="primary" size="sm" className="w-full">
                  Upgrade to Specter — $14.99/mo
                </Button>
              </div>
            )}
          </AnimatedBorderCard>

          {/* Usage Stats */}
          <Card variant="glass" padding="lg" className="relative overflow-hidden">
            <ScanLine />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-near-green" />
                <h3 className="font-semibold text-text-primary">Usage This Month</h3>
              </div>
              {usage ? (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-secondary">Briefs Generated</span>
                      <span className="text-text-primary font-mono">
                        {usage.briefsThisMonth}/{tierConfig.briefsPerMonth}
                      </span>
                    </div>
                    <Progress
                      value={usage.briefsThisMonth}
                      max={tierConfig.briefsPerMonth}
                      size="sm"
                      color="green"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Saved Opportunities</span>
                    <span className="text-text-primary font-mono">
                      {usage.savedCount}/{tierConfig.maxSaved}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Previews Today</span>
                    <span className="text-text-primary font-mono">{usage.previewsToday}</span>
                  </div>
                </div>
              ) : (
                <div className="h-20 flex items-center justify-center">
                  <span className="text-sm text-text-muted">Loading usage...</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </ScrollReveal>

      {/* Saved Opportunities */}
      <ScrollReveal delay={0.15}>
        <SectionHeader title="Saved Opportunities" count={saved.length} badge="LIVE" />
        <Card variant="glass" padding="none">
          <div className="p-4">
            {savedLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-surface-hover rounded-lg animate-pulse" />
                ))}
              </div>
            ) : saved.length > 0 ? (
              <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
                {saved.map((item) => (
                  <Link
                    key={item.id}
                    href={`/opportunities/${item.opportunity_id}`}
                    className="flex items-center gap-3 px-4 py-3 border-l-2 border-transparent hover:border-near-green/50 hover:bg-surface-hover transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {item.opportunity?.title || 'Opportunity'}
                      </p>
                      {item.opportunity?.category && (
                        <p className="text-xs text-text-muted truncate">
                          {item.opportunity.category.name}
                        </p>
                      )}
                    </div>
                    <Badge variant="default">{item.status}</Badge>
                    <ExternalLink className="w-3.5 h-3.5 text-text-muted shrink-0" />
                  </Link>
                ))}
              </div>
            ) : (
              <VoidEmptyState
                icon={Bookmark}
                title="No saved voids yet"
                description="Browse voids and click the bookmark icon to save them here."
                action={
                  <Link href="/opportunities">
                    <Button variant="secondary" size="sm">Browse Voids</Button>
                  </Link>
                }
              />
            )}
          </div>
        </Card>
      </ScrollReveal>
    </PageTransition>
  );
}
