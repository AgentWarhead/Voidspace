'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { BriefDisplay } from './BriefDisplay';
import { BriefPreview } from './BriefPreview';
import { TierGate } from '@/components/tier/TierGate';
import { useUser } from '@/hooks/useUser';
import { TIERS } from '@/lib/tiers';
import type { ProjectBrief, TierName } from '@/types';

interface BriefGeneratorProps {
  opportunityId: string;
}

export function BriefGenerator({ opportunityId }: BriefGeneratorProps) {
  const { user, isConnected } = useUser();
  const [brief, setBrief] = useState<ProjectBrief | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<{ briefsThisMonth: number } | null>(null);

  // Fetch usage stats
  useEffect(() => {
    if (user?.id) {
      fetch('/api/usage')
        .then((r) => r.json())
        .then(setUsage)
        .catch(() => {});
    }
  }, [user?.id]);

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to generate brief');
        return;
      }

      setBrief(data.brief?.content || data.brief);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // If brief has been generated, show it
  if (brief) {
    const userTier = (user?.tier as TierName) || 'shade';
    const canViewFull = userTier !== 'shade';

    return (
      <Card padding="lg">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          AI-Generated Project Brief
        </h2>
        {canViewFull ? (
          <BriefDisplay brief={brief} />
        ) : (
          <BriefPreview brief={brief} />
        )}
      </Card>
    );
  }

  const userTier = (user?.tier as TierName) || 'shade';
  const tierConfig = TIERS[userTier];
  const briefsUsed = usage?.briefsThisMonth || 0;
  const briefsLimit = tierConfig.briefsPerMonth;

  return (
    <TierGate requiredTier="shade" feature="generate AI mission briefs">
      <Card padding="lg" className="text-center">
        <Sparkles className="w-8 h-8 text-near-green mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          Ready to Build?
        </h2>
        <p className="text-sm text-text-secondary mb-2 max-w-md mx-auto">
          Generate an AI-powered mission brief with market analysis, technical specs, NEAR integration, monetization strategies, and your first week&apos;s action plan.
        </p>

        {isConnected && usage && (
          <p className="text-xs text-text-muted mb-4">
            {briefsUsed}/{briefsLimit} briefs used this month
          </p>
        )}

        {error && (
          <p className="text-sm text-error mb-4">{error}</p>
        )}

        <Button
          variant="primary"
          size="lg"
          onClick={handleGenerate}
          disabled={loading}
          leftIcon={
            loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )
          }
        >
          {loading ? 'Generating Your Mission Brief...' : 'Generate Your Mission Brief'}
        </Button>
      </Card>
    </TierGate>
  );
}
