import { Container } from '@/components/ui/Container';

export default function SanctumLoading() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-6 sm:py-8 md:py-12 border-b border-border">
        <Container size="xl">
          <div className="flex items-center gap-3 mb-4 px-4 sm:px-0">
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 animate-pulse flex-shrink-0" />
            <div className="h-8 w-48 max-w-[60%] animate-pulse bg-white/5 rounded" />
          </div>
          <div className="h-5 w-80 max-w-full animate-pulse bg-white/5 rounded px-4 sm:px-0" />
        </Container>
      </section>
      <Container size="xl" className="py-6 sm:py-8 px-4 sm:px-0">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="h-48 sm:h-64 animate-pulse bg-white/5 rounded-xl" />
          <div className="h-24 sm:h-32 animate-pulse bg-white/5 rounded-xl" />
        </div>
      </Container>
    </div>
  );
}
