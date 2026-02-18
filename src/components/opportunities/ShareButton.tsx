'use client';

import { useState } from 'react';
import { Share2, Copy, Check, Twitter } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { cn } from '@/lib/utils';

interface ShareButtonProps {
  opportunityId: string;
  title: string;
  gapScore: number;
  size?: 'sm' | 'md';
}

export function ShareButton({ opportunityId, title, gapScore, size = 'md' }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/opportunities/${opportunityId}`
    : `https://voidspace.io/opportunities/${opportunityId}`;

  const tweetText = encodeURIComponent(
    `🌌 Found a high-value void in the NEAR ecosystem: "${title}" — Gap Score ${gapScore}/100\n\nBuilders, this one's wide open. 👇\n${url}\n\n#NEAR #Web3 #BuildOnNEAR`
  );
  const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      addToast('Link copied to clipboard!', 'success');
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1500);
    } catch {
      addToast('Failed to copy link', 'error');
    }
  }

  function handleTwitter(e: React.MouseEvent) {
    e.stopPropagation();
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    setOpen(false);
  }

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const buttonBase = size === 'sm' ? 'min-w-[40px] min-h-[40px]' : 'min-w-[44px] min-h-[44px]';

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        aria-label="Share this Void"
        title="Share this Void"
        className={cn(
          buttonBase,
          'flex items-center justify-center',
          'rounded-lg transition-all active:scale-90 touch-manipulation',
          open
            ? 'text-near-green bg-near-green/10 scale-110'
            : 'text-text-muted hover:text-near-green hover:bg-near-green/10 hover:scale-110'
        )}
      >
        <Share2 className={cn(iconSize, 'transition-transform')} />
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop to close on outside click */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div
            className={cn(
              'absolute right-0 top-full mt-2 z-50',
              'w-44 rounded-xl border border-border bg-surface/95 backdrop-blur-md shadow-xl',
              'overflow-hidden'
            )}
          >
            {/* Copy link */}
            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-near-green shrink-0" />
              ) : (
                <Copy className="w-4 h-4 shrink-0" />
              )}
              <span>{copied ? 'Copied!' : 'Copy link'}</span>
            </button>

            {/* Divider */}
            <div className="h-px bg-border mx-2" />

            {/* Share on X / Twitter */}
            <button
              onClick={handleTwitter}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
            >
              <Twitter className="w-4 h-4 shrink-0" />
              <span>Share on X</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
