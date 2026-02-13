import { Container } from '@/components/ui/Container';

export default function PricingLoading() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-12 sm:py-16">
        <Container size="xl">
          <div className="text-center mb-12">
            <div className="h-10 w-64 mx-auto animate-pulse bg-white/5 rounded" />
            <div className="h-5 w-96 mx-auto mt-4 animate-pulse bg-white/5 rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 animate-pulse bg-white/5 rounded-xl border border-border" />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
