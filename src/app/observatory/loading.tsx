import { Container } from '@/components/ui/Container';
import { Globe } from 'lucide-react';

export default function ObservatoryLoading() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-8 sm:py-12 border-b border-border">
        <Container size="xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-near-green/10 border border-near-green/20">
                  <Globe className="w-5 h-5 text-near-green" />
                </div>
                <div className="h-8 w-48 animate-pulse bg-white/5 rounded" />
              </div>
              <div className="h-5 w-96 max-w-full animate-pulse bg-white/5 rounded" />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <div className="h-10 w-28 animate-pulse bg-white/5 rounded-lg" />
            <div className="h-10 w-32 animate-pulse bg-white/5 rounded-lg" />
            <div className="h-10 w-28 animate-pulse bg-white/5 rounded-lg" />
          </div>
        </Container>
      </section>
      <Container size="xl" className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 animate-pulse bg-white/5 rounded-xl" />
          ))}
        </div>
      </Container>
    </div>
  );
}
