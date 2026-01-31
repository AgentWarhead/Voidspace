export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft, Globe, Github, Star, GitFork, AlertCircle, Code, Clock,
  Wallet, Coins, Image as ImageIcon, Landmark, ExternalLink, CheckCircle, XCircle,
} from 'lucide-react';
import { Container, Card, Badge } from '@/components/ui';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { ScanLine } from '@/components/effects/ScanLine';
import { GridPattern } from '@/components/effects/GridPattern';
import { GradientText } from '@/components/effects/GradientText';
import { getProjectBySlug } from '@/lib/queries';
import { formatCurrency, formatNumber, timeAgo } from '@/lib/utils';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: 'Project Not Found — Voidspace' };
  return {
    title: `${project.name} — Voidspace`,
    description: project.description || `Explore ${project.name} on the NEAR ecosystem.`,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const raw = (project.raw_data || {}) as Record<string, unknown>;
  const fastnear = raw.fastnear as Record<string, unknown> | undefined;
  const defillama = raw.defillama as Record<string, unknown> | undefined;
  const github = raw.github as Record<string, unknown> | undefined;
  const pikespeak = raw.pikespeak as Record<string, unknown> | undefined;

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative overflow-hidden py-10 sm:py-14">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, rgba(0,236,151,0.04) 0%, transparent 70%)' }}
        />
        <GridPattern className="opacity-20" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 40%, #0a0a0a 100%)' }}
        />
        <Container size="lg" className="relative z-10">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          <div className="flex items-start gap-4">
            {project.logo_url ? (
              <Image
                src={project.logo_url}
                alt={`${project.name} logo`}
                width={64}
                height={64}
                className="w-16 h-16 rounded-xl object-cover bg-surface-hover shrink-0"
                unoptimized
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-near-green/10 text-near-green flex items-center justify-center text-2xl font-bold shrink-0">
                {project.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <GradientText as="h1" className="text-3xl font-bold">
                  {project.name}
                </GradientText>
                {project.is_active ? (
                  <Badge variant="default" className="bg-near-green/10 text-near-green">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="default" className="bg-red-500/10 text-red-400">
                    <XCircle className="w-3 h-3 mr-1" />
                    Inactive
                  </Badge>
                )}
              </div>
              {project.description && (
                <p className="text-text-secondary mt-2">{project.description}</p>
              )}
              <div className="flex items-center gap-3 mt-3">
                {project.website_url && (
                  <a href={project.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-near-green transition-colors">
                    <Globe className="w-4 h-4" /> Website
                  </a>
                )}
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-near-green transition-colors">
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                )}
                {project.twitter_url && (
                  <a href={project.twitter_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-near-green transition-colors">
                    <ExternalLink className="w-4 h-4" /> Twitter
                  </a>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container size="lg" className="py-8 space-y-8">
        {/* Financial / DeFiLlama Section */}
        <ScrollReveal>
          <SectionHeader title="Financial" badge="DEFILLAMA" />
          <Card variant="glass" padding="lg" className="relative overflow-hidden">
            <ScanLine />
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatBox label="TVL" value={Number(project.tvl_usd) > 0 ? formatCurrency(Number(project.tvl_usd)) : '-'} />
              {defillama && (
                <>
                  <StatBox label="Category" value={String(defillama.category || '-')} />
                  <StatBox label="1d Change" value={defillama.change_1d != null ? `${Number(defillama.change_1d).toFixed(1)}%` : '-'} />
                  <StatBox label="7d Change" value={defillama.change_7d != null ? `${Number(defillama.change_7d).toFixed(1)}%` : '-'} />
                </>
              )}
            </div>
            {defillama?.chains && Array.isArray(defillama.chains) ? (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {(defillama.chains as string[]).map((chain) => (
                  <Badge key={chain} variant="default" className="text-xs">
                    {chain}
                  </Badge>
                ))}
              </div>
            ) : null}
          </Card>
        </ScrollReveal>

        {/* On-Chain / FastNEAR Section */}
        {fastnear && (
          <ScrollReveal delay={0.05}>
            <SectionHeader title="On-Chain Data" badge="FASTNEAR" />
            <Card variant="glass" padding="lg" className="relative overflow-hidden">
              <ScanLine />
              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatBox label="NEAR Balance" value={fastnear.balance_near != null ? `${Number(fastnear.balance_near).toFixed(2)} N` : '-'} icon={<Wallet className="w-4 h-4" />} />
                <StatBox label="FT Count" value={String(fastnear.ft_count || 0)} icon={<Coins className="w-4 h-4" />} />
                <StatBox label="NFT Count" value={String(fastnear.nft_count || 0)} icon={<ImageIcon className="w-4 h-4" />} />
                <StatBox label="Staking Pools" value={String(fastnear.staking_pools || 0)} icon={<Landmark className="w-4 h-4" />} />
              </div>
              {fastnear.account_id ? (
                <p className="mt-3 text-xs text-text-muted font-mono">
                  Account: {String(fastnear.account_id)}
                </p>
              ) : null}
            </Card>
          </ScrollReveal>
        )}

        {/* GitHub Health Section */}
        {project.github_url && (
          <ScrollReveal delay={0.1}>
            <SectionHeader title="GitHub Health" badge="GITHUB" />
            <Card variant="glass" padding="lg" className="relative overflow-hidden">
              <ScanLine />
              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatBox label="Stars" value={formatNumber(project.github_stars)} icon={<Star className="w-4 h-4 text-warning" />} />
                <StatBox label="Forks" value={formatNumber(project.github_forks)} icon={<GitFork className="w-4 h-4" />} />
                <StatBox label="Open Issues" value={String(project.github_open_issues)} icon={<AlertCircle className="w-4 h-4" />} />
                <StatBox label="Language" value={project.github_language || '-'} icon={<Code className="w-4 h-4" />} />
              </div>
              <div className="mt-4 flex items-center gap-4 flex-wrap">
                {project.last_github_commit && (
                  <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                    <Clock className="w-3 h-3" />
                    Last commit: {timeAgo(project.last_github_commit)}
                  </span>
                )}
                {github?.license ? (
                  <Badge variant="default" className="text-xs">
                    License: {String(github.license)}
                  </Badge>
                ) : null}
                {github?.archived ? (
                  <Badge variant="default" className="bg-red-500/10 text-red-400 text-xs">
                    Archived
                  </Badge>
                ) : null}
              </div>
              {github?.topics && Array.isArray(github.topics) && (github.topics as string[]).length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(github.topics as string[]).map((topic) => (
                    <Badge key={topic} variant="default" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </Card>
          </ScrollReveal>
        )}

        {/* Pikespeak Section */}
        {pikespeak && (
          <ScrollReveal delay={0.15}>
            <SectionHeader title="Balance Analytics" badge="PIKESPEAK" />
            <Card variant="glass" padding="lg" className="relative overflow-hidden">
              <ScanLine />
              <div className="relative z-10">
                <p className="text-xs text-text-muted font-mono mb-2">
                  Account: {String(pikespeak.account_id || '-')}
                </p>
                <p className="text-sm text-text-secondary">
                  Balance data enriched via Pikespeak analytics.
                </p>
              </div>
            </Card>
          </ScrollReveal>
        )}
      </Container>
    </div>
  );
}

function StatBox({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-text-muted uppercase tracking-wide font-mono flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className="text-lg font-bold text-text-primary font-mono">{value}</p>
    </div>
  );
}
