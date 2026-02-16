import { Container } from '@/components/ui/Container';

export default function VoidLensLoading() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-8 border-b border-border">
        <Container size="xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full animate-pulse bg-white/5" />
            <div className="h-8 w-48 animate-pulse bg-white/5 rounded" />
          </div>
          <div className="h-5 w-96 max-w-full animate-pulse bg-white/5 rounded mt-2" />
        </Container>
      </section>
      <section className="py-6">
        <Container size="lg">
          <div className="max-w-xl mx-auto">
            <div className="h-12 w-full animate-pulse bg-white/5 rounded-lg mb-6" />
            <div className="h-64 w-full animate-pulse bg-white/5 rounded-xl" />
          </div>
        </Container>
      </section>
    </div>
  );
}
