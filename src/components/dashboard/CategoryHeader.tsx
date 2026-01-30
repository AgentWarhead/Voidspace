import { Badge, Progress, InfoTooltip } from '@/components/ui';
import { GapScoreIndicator } from '@/components/opportunities/GapScoreIndicator';
import { GradientText } from '@/components/effects/GradientText';
import { HELP_CONTENT } from '@/lib/help-content';
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
            <GradientText as="h1" className="text-2xl font-bold">{category.name}</GradientText>
            {category.is_strategic && (
              <span className="flex items-center">
                <Badge variant="default" className="bg-near-green/10 text-near-green">
                  Strategic 2x
                </Badge>
                <InfoTooltip term={HELP_CONTENT.strategicCategory.term}>
                  <p>{HELP_CONTENT.strategicCategory.description}</p>
                </InfoTooltip>
              </span>
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
