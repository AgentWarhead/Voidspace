'use client';

import Link from 'next/link';
import { 
  Sparkles, 
  Code2, 
  Eye, 
  Share2,
  Search,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface QuickActionsBarProps {
  hasActiveMission?: boolean;
  lastSanctumVoid?: string | null;
  accountId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function QuickActionsBar({ hasActiveMission, lastSanctumVoid, accountId }: QuickActionsBarProps) {
  const handleShare = async () => {
    const url = `${window.location.origin}/profile/${accountId}`;
    if (navigator.share) {
      await navigator.share({
        title: 'My Voidspace Profile',
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      // Could trigger a toast here
    }
  };

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {/* Primary: Continue Building or Start New */}
      {lastSanctumVoid ? (
        <Link href={`/sanctum?void=${lastSanctumVoid}`} className="flex-1 min-w-[160px] sm:min-w-[200px]">
          <Button 
            variant="primary" 
            className="w-full group min-h-[44px] active:scale-[0.97]"
          >
            <Code2 className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm sm:text-base">Continue Building</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </Button>
        </Link>
      ) : (
        <Link href="/opportunities" className="flex-1 min-w-[160px] sm:min-w-[200px]">
          <Button 
            variant="primary" 
            className="w-full group min-h-[44px] active:scale-[0.97]"
          >
            <Search className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm sm:text-base">Find a Void</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </Button>
        </Link>
      )}

      {/* Secondary Actions */}
      <Link href="/sanctum">
        <Button variant="secondary" className="h-full min-h-[44px] min-w-[44px] active:scale-[0.97]">
          <Sparkles className="w-4 h-4 sm:mr-2 flex-shrink-0" />
          <span className="hidden sm:inline">Sanctum</span>
        </Button>
      </Link>

      <Link href="/observatory?tool=void-lens">
        <Button variant="secondary" className="h-full min-h-[44px] min-w-[44px] active:scale-[0.97]">
          <Eye className="w-4 h-4 sm:mr-2 flex-shrink-0" />
          <span className="hidden sm:inline">Analyze Wallet</span>
        </Button>
      </Link>

      <Button 
        variant="ghost" 
        onClick={handleShare}
        className="h-full min-h-[44px] min-w-[44px] active:scale-[0.97]"
      >
        <Share2 className="w-4 h-4 sm:mr-2 flex-shrink-0" />
        <span className="hidden sm:inline">Share Profile</span>
      </Button>
    </div>
  );
}
