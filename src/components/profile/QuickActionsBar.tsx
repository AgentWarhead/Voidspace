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
    <div className="flex flex-wrap gap-2">
      {/* Primary: Continue Building or Start New */}
      {lastSanctumVoid ? (
        <Link href={`/sanctum?void=${lastSanctumVoid}`} className="flex-1 min-w-[200px]">
          <Button 
            variant="primary" 
            className="w-full group"
          >
            <Code2 className="w-4 h-4 mr-2" />
            Continue Building
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      ) : (
        <Link href="/opportunities" className="flex-1 min-w-[200px]">
          <Button 
            variant="primary" 
            className="w-full group"
          >
            <Search className="w-4 h-4 mr-2" />
            Find a Void
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      )}

      {/* Secondary Actions */}
      <Link href="/sanctum">
        <Button variant="secondary" className="h-full">
          <Sparkles className="w-4 h-4 mr-2" />
          Sanctum
        </Button>
      </Link>

      <Link href="/observatory?tool=void-lens">
        <Button variant="secondary" className="h-full">
          <Eye className="w-4 h-4 mr-2" />
          Analyze Wallet
        </Button>
      </Link>

      <Button 
        variant="ghost" 
        onClick={handleShare}
        className="h-full"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share Profile
      </Button>
    </div>
  );
}
