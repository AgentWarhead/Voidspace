'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { useSavedContext } from '@/contexts/SavedOpportunitiesContext';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/contexts/ToastContext';
import { cn } from '@/lib/utils';

interface SaveButtonProps {
  opportunityId: string;
  size?: 'sm' | 'md';
}

export function SaveButton({ opportunityId, size = 'md' }: SaveButtonProps) {
  const { isConnected, openModal } = useWallet();
  const { user } = useUser();
  const { isSaved, save, unsave } = useSavedContext();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const saved = isSaved(opportunityId);
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!isConnected) {
      openModal();
      return;
    }

    if (!user) return;

    setLoading(true);
    try {
      const result = saved
        ? await unsave(opportunityId)
        : await save(opportunityId);

      if (!result.success) {
        addToast(result.error || 'Failed to save', 'error');
      } else {
        addToast(saved ? 'Removed from saved' : 'Saved to profile', 'success');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={cn(
        'min-w-[44px] min-h-[44px] flex items-center justify-center',
        'rounded-lg transition-all active:scale-90 touch-manipulation',
        saved
          ? 'text-red-400 hover:text-red-300 bg-red-400/10 hover:scale-110'
          : 'text-text-muted hover:text-text-secondary hover:bg-surface-hover hover:scale-110',
        loading && 'opacity-50 cursor-not-allowed'
      )}
      title={saved ? 'Unsave' : 'Save'}
      aria-label={saved ? 'Unsave opportunity' : 'Save opportunity'}
    >
      <Heart className={cn(iconSize, saved && 'fill-current', 'transition-transform')} />
    </button>
  );
}
