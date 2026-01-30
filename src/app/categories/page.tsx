import { Container } from '@/components/ui';
import { CategoryGrid } from '@/components/dashboard/CategoryGrid';
import { getCategoriesWithStats } from '@/lib/queries';

export const metadata = {
  title: 'Categories — Voidspace',
  description: 'Browse NEAR ecosystem categories and identify gaps.',
};

export default async function CategoriesPage() {
  const categories = await getCategoriesWithStats();

  return (
    <div className="min-h-screen">
      <Container size="xl" className="py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Categories</h1>
          <p className="text-text-secondary mt-1">
            Browse the NEAR ecosystem by category. Green bars indicate high opportunity gaps.
          </p>
        </div>

        <CategoryGrid categories={categories} />
      </Container>
    </div>
  );
}
