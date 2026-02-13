import { Container } from '@/components/ui/Container';

export default function SanctumLoading() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-8 sm:py-12 border-b border-border">
        <Container size="xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 animate-pulse" />
            <div className="h-8 w-48 animate-pulse bg-white/5 rounded" />
          </div>
          <div className="h-5 w-80 max-w-full animate-pulse bg-white/5 rounded" />
        </Container>
      </section>
      <Container size="xl" className="py-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="h-64 animate-pulse bg-white/5 rounded-xl" />
          <div className="h-32 animate-pulse bg-white/5 rounded-xl" />
        </div>
      </Container>
    </div>
  );
}
