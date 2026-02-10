import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';

export default function VoidBubblesLoading() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-8 border-b border-border">
        <Container size="xl">
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="w-10 h-10 rounded-full animate-pulse bg-white/5" />
            <Skeleton className="h-8 w-48 animate-pulse bg-white/5" />
          </div>
          <Skeleton className="h-5 w-96 max-w-full animate-pulse bg-white/5 mt-2" />
        </Container>
      </section>
      <section className="py-4">
        <Container size="xl">
          <div className="w-full h-[calc(100vh-200px)] min-h-[500px] bg-surface rounded-xl border border-border flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-2 border-near-green/30 border-t-near-green mx-auto animate-spin" />
              <p className="text-text-muted text-sm font-mono">Loading Void Bubbles...</p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
