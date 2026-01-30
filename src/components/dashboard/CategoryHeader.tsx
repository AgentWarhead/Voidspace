import { Badge, Progress } from '@/components/ui';
import { GapScoreIndicator } from '@/components/opportunities/GapScoreIndicator';
import type { Category } from '@/types';

interface CategoryHeaderProps {
  category: Category;
  gapScore: number;
  projectCount: number;
}

export function CategoryHeader({ category, gapScore, projectCount }: CategoryHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <span className="text-4xl">{category.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-text-primary">{category.name}</h1>
            {category.is_strategic && (
              <Badge variant="default" className="bg-near-green/10 text-near-green">
                Strategic 2x
              </Badge>
            )}
          </div>
          <p className="text-text-secondary">{category.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex-1">
          <p className="text-xs text-text-muted mb-1">
            {projectCount} projects in this category
          </p>
          <Progress value={gapScore} size="sm" />
        </div>
        <div className="w-32">
          <GapScoreIndicator score={gapScore} size="md" showLabel />
        </div>
      </div>
    </div>
  );
}
