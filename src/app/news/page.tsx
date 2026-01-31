import { Container } from '@/components/ui';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { ScanLine } from '@/components/effects/ScanLine';
import { NewsFeed } from '@/components/news/NewsFeed';
import { getRecentNews } from '@/lib/news-queries';

export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  const [nearNews, marketNews] = await Promise.all([
    getRecentNews({ limit: 20, nearOnly: true }),
    getRecentNews({ limit: 30 }),
  ]);

  return (
    <div className="min-h-screen">
      <Container size="xl" className="py-8 space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">NEAR Ecosystem News</h1>
          <p className="text-sm text-text-secondary mt-1">
            Curated news from the NEAR ecosystem and crypto market
          </p>
        </div>

        {/* NEAR & AI News */}
        {nearNews.length > 0 && (
          <ScrollReveal>
            <section className="relative">
              <SectionHeader title="NEAR & AI" badge="NEAR SIGNAL" />
              <div className="relative overflow-hidden rounded-xl border border-near-green/20 bg-near-green/[0.02] p-4">
                <ScanLine />
                <NewsFeed articles={nearNews} />
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* Crypto Market Context */}
        <ScrollReveal delay={0.1}>
          <section>
            <SectionHeader title="Crypto Market" badge="LIVE FEED" count={marketNews.length} />
            <NewsFeed articles={marketNews} />
          </section>
        </ScrollReveal>
      </Container>
    </div>
  );
}
