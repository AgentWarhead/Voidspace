'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, Shield, Bookmark, FileText, Calendar, ExternalLink } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { PageTransition } from '@/components/effects/PageTransition';
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
      <Card padding="lg" className="text-center py-16">
        <User className="w-12 h-12 text-text-muted mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-text-secondary mb-6 max-w-md mx-auto">
          Connect your NEAR wallet to view your profile, saved opportunities, and usage stats.
        </p>
        <Button variant="primary" size="lg" onClick={openModal}>
          Connect Wallet
        </Button>
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

  return (
    <PageTransition className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Profile</h1>

      {/* User Info */}
      <Card padding="lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-near-green/20 flex items-center justify-center shrink-0">
            <User className="w-6 h-6 text-near-green" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-text-primary truncate">
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

      {/* Tier + Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Plan */}
        <Card padding="lg">
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
              <span className="text-text-primary">{tierConfig.briefsPerMonth}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Max Saved</span>
              <span className="text-text-primary">{tierConfig.maxSaved}</span>
            </div>
            {tierConfig.price !== null && tierConfig.price > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Price</span>
                <span className="text-text-primary">${tierConfig.price}/mo</span>
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
        </Card>

        {/* Usage Stats */}
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-near-green" />
            <h3 className="font-semibold text-text-primary">Usage This Month</h3>
          </div>
          {usage ? (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-secondary">Briefs Generated</span>
                  <span className="text-text-primary">
                    {usage.briefsThisMonth}/{tierConfig.briefsPerMonth}
                  </span>
                </div>
                <div className="h-1.5 bg-surface-hover rounded-full overflow-hidden">
                  <div
                    className="h-full bg-near-green rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        (usage.briefsThisMonth / tierConfig.briefsPerMonth) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Saved Opportunities</span>
                <span className="text-text-primary">
                  {usage.savedCount}/{tierConfig.maxSaved}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Previews Today</span>
                <span className="text-text-primary">{usage.previewsToday}</span>
              </div>
            </div>
          ) : (
            <div className="h-20 flex items-center justify-center">
              <span className="text-sm text-text-muted">Loading usage...</span>
            </div>
          )}
        </Card>
      </div>

      {/* Saved Opportunities */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <Bookmark className="w-5 h-5 text-near-green" />
          <h3 className="font-semibold text-text-primary">Saved Opportunities</h3>
        </div>

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
                className="flex items-center gap-3 px-4 py-3 hover:bg-surface-hover transition-colors"
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
          <p className="text-sm text-text-muted text-center py-6">
            No saved opportunities yet. Browse opportunities and click the heart to save them.
          </p>
        )}
      </Card>
    </PageTransition>
  );
}
