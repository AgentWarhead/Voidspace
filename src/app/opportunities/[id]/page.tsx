import { notFound } from 'next/navigation';
import { Container } from '@/components/ui';
import { OpportunityDetail } from '@/components/opportunities/OpportunityDetail';
import { getOpportunityById, getRelatedProjects } from '@/lib/queries';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props) {
  const opportunity = await getOpportunityById(params.id);
  if (!opportunity) return { title: 'Opportunity Not Found — Voidspace' };

  return {
    title: `${opportunity.title} — Voidspace`,
    description: opportunity.description || `Gap opportunity in the NEAR ecosystem.`,
  };
}

export default async function OpportunityDetailPage({ params }: Props) {
  const opportunity = await getOpportunityById(params.id);
  if (!opportunity) notFound();

  const category = opportunity.category!;
  const relatedProjects = await getRelatedProjects(opportunity.category_id, 10);

  return (
    <div className="min-h-screen">
      <Container size="lg" className="py-8">
        <OpportunityDetail
          opportunity={opportunity}
          relatedProjects={relatedProjects}
          category={category}
        />
      </Container>
    </div>
  );
}
