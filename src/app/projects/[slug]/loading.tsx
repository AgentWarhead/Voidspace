import { Container } from '@/components/ui/Container';

export default function ProjectLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Container size="xl" className="py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-8 w-64 animate-pulse bg-white/5 rounded" />
          <div className="h-5 w-96 animate-pulse bg-white/5 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-48 animate-pulse bg-white/5 rounded-xl" />
            <div className="h-48 animate-pulse bg-white/5 rounded-xl" />
          </div>
          <div className="h-64 animate-pulse bg-white/5 rounded-xl" />
        </div>
      </Container>
    </div>
  );
}
