'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Loader2, Lightbulb, Lock } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { BriefDisplay } from './BriefDisplay';
import { BriefPreview } from './BriefPreview';
import { TierGate } from '@/components/tier/TierGate';
import { useUser } from '@/hooks/useUser';
import { TIERS } from '@/lib/tiers';
import type { ProjectBrief, TierName } from '@/types';
import { useAchievementContext } from '@/contexts/AchievementContext';

export function CustomBriefForm() {
  const { user, isConnected } = useUser();
  const { trackStat } = useAchievementContext();
  const [customIdea, setCustomIdea] = useState('');
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
    if (!customIdea.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customIdea: customIdea.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to generate brief');
        return;
      }

      setBrief(data.brief?.content || data.brief);
      trackStat('briefsGenerated');
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
          AI-Generated Build Plan
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
    <TierGate requiredTier="shade" feature="generate AI build plans">
      <Card padding="lg" id="custom-brief">
        <div className="text-center mb-6">
          <Lightbulb className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-text-primary mb-2">
            What Are You Building?
          </h2>
          <p className="text-sm text-text-secondary max-w-md mx-auto">
            Give us the concept — even a rough idea is enough. Sanctum will map the market,
            design the architecture, and write the roadmap so you can start building immediately.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          <textarea
            value={customIdea}
            onChange={(e) => setCustomIdea(e.target.value)}
            placeholder="Describe your project idea... What problem does it solve? Who is it for?"
            className="w-full h-32 px-4 py-3 rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-muted text-sm resize-none focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-all"
            disabled={loading}
          />

          {isConnected && usage && (
            <p className="text-xs text-text-muted text-center">
              {briefsUsed}/{briefsLimit} briefs used this month
            </p>
          )}

          {error && (
            <p className="text-sm text-error text-center">{error}</p>
          )}

          <div className="text-center space-y-3">
            <Button
              variant="primary"
              size="lg"
              onClick={handleGenerate}
              disabled={loading || !customIdea.trim()}
              leftIcon={
                loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )
              }
            >
              {loading ? 'Generating Your Build Plan...' : 'Generate Build Plan'}
            </Button>
            {/* Paywall note — clear and visible */}
            <p className="text-xs text-text-muted flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3 shrink-0" />
              Free tier shows a preview ·{' '}
              <a href="/pricing" className="text-near-green hover:underline font-medium">Specter plan or credits</a>{' '}
              required for the full 12-section build plan
            </p>
          </div>
        </div>
      </Card>
    </TierGate>
  );
}
