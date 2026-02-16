import { Container } from '@/components/ui/Container';

export default function PricingLoading() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-10 sm:py-16">
        <Container size="xl" className="px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12">
            <div className="h-8 sm:h-10 w-48 sm:w-64 mx-auto animate-pulse bg-white/5 rounded" />
            <div className="h-4 sm:h-5 w-72 sm:w-96 mx-auto mt-4 animate-pulse bg-white/5 rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-72 sm:h-80 animate-pulse bg-white/5 rounded-xl border border-border" />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
