'use client';

import { useState, useRef, useEffect } from 'react';
import { Flag, X, Loader2 } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { cn } from '@/lib/utils';

interface FlagVoidButtonProps {
  opportunityId: string;
}

type FlagState = 'idle' | 'open' | 'submitting' | 'success' | 'error';

export function FlagVoidButton({ opportunityId }: FlagVoidButtonProps) {
  const { isConnected, accountId, openModal } = useWallet();
  const [state, setState] = useState<FlagState>('idle');
  const [projectName, setProjectName] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [note, setNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (state !== 'open') return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setState('idle');
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [state]);

  function handleOpen(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isConnected) {
      openModal();
      return;
    }
    setState('open');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accountId) return;

    setState('submitting');
    setErrorMsg('');

    try {
      const res = await fetch(`/api/voids/${opportunityId}/flag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: accountId,
          projectName: projectName.trim() || undefined,
          projectUrl: projectUrl.trim() || undefined,
          note: note.trim() || undefined,
        }),
      });

      if (res.status === 409) {
        // Already flagged
        setState('success');
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit flag');
      }

      setState('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setState('error');
    }
  }

  return (
    <div className="relative" ref={panelRef}>
      {/* Trigger button */}
      <button
        onClick={handleOpen}
        title="Flag as filled"
        aria-label="Flag this void as already filled"
        className={cn(
          'min-w-[44px] min-h-[44px] flex items-center justify-center gap-1.5',
          'rounded-lg transition-all active:scale-90 touch-manipulation',
          'text-text-muted hover:text-amber-400 hover:bg-amber-400/10 hover:scale-110',
          state === 'success' && 'text-amber-400 bg-amber-400/10',
        )}
      >
        <Flag className="w-4 h-4" />
        <span className="text-[10px] font-mono hidden sm:inline">Flag</span>
      </button>

      {/* Dropdown panel */}
      {(state === 'open' || state === 'submitting' || state === 'error') && (
        <div
          className={cn(
            'absolute right-0 top-full mt-2 z-50',
            'w-72 rounded-xl border border-amber-400/20 bg-[#0f0f0f]',
            'shadow-xl shadow-black/60 p-4',
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flag className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-semibold text-text-primary">
                Flag as filled
              </span>
            </div>
            <button
              onClick={() => setState('idle')}
              className="text-text-muted hover:text-text-primary transition-colors"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-text-muted mb-3 leading-relaxed">
            Know a project that already fills this void? Let us know so we can
            keep the list accurate.
          </p>

          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* Project name */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wide text-text-muted block mb-1">
                Project name <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Ref Finance"
                required
                disabled={state === 'submitting'}
                className={cn(
                  'w-full rounded-lg border border-white/[0.08] bg-white/[0.03]',
                  'px-3 py-2 text-xs text-text-primary placeholder-text-muted',
                  'focus:outline-none focus:border-amber-400/40 transition-colors',
                  'disabled:opacity-50',
                )}
              />
            </div>

            {/* Project URL */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wide text-text-muted block mb-1">
                Project URL <span className="text-text-muted/50">(optional)</span>
              </label>
              <input
                type="url"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                placeholder="https://..."
                disabled={state === 'submitting'}
                className={cn(
                  'w-full rounded-lg border border-white/[0.08] bg-white/[0.03]',
                  'px-3 py-2 text-xs text-text-primary placeholder-text-muted',
                  'focus:outline-none focus:border-amber-400/40 transition-colors',
                  'disabled:opacity-50',
                )}
              />
            </div>

            {/* Note */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wide text-text-muted block mb-1">
                Note <span className="text-text-muted/50">(optional, max 200 chars)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 200))}
                placeholder="What does this project do that fills the void?"
                rows={2}
                disabled={state === 'submitting'}
                className={cn(
                  'w-full rounded-lg border border-white/[0.08] bg-white/[0.03]',
                  'px-3 py-2 text-xs text-text-primary placeholder-text-muted',
                  'focus:outline-none focus:border-amber-400/40 transition-colors',
                  'resize-none disabled:opacity-50',
                )}
              />
              <p className="text-[10px] text-text-muted text-right mt-0.5">
                {note.length}/200
              </p>
            </div>

            {/* Error message */}
            {state === 'error' && errorMsg && (
              <p className="text-[11px] text-rose-400">{errorMsg}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={state === 'submitting' || !projectName.trim()}
              className={cn(
                'w-full rounded-lg px-3 py-2 text-xs font-semibold transition-all',
                'bg-amber-400/10 border border-amber-400/30 text-amber-400',
                'hover:bg-amber-400/20 hover:border-amber-400/50',
                'disabled:opacity-40 disabled:cursor-not-allowed',
                'flex items-center justify-center gap-2',
              )}
            >
              {state === 'submitting' ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Submitting…
                </>
              ) : (
                'Flag this Void'
              )}
            </button>
          </form>
        </div>
      )}

      {/* Success overlay */}
      {state === 'success' && (
        <div
          className={cn(
            'absolute right-0 top-full mt-2 z-50',
            'w-64 rounded-xl border border-near-green/20 bg-[#0f0f0f]',
            'shadow-xl shadow-black/60 p-4 text-center',
          )}
        >
          <div className="text-2xl mb-2">🙏</div>
          <p className="text-xs font-semibold text-near-green mb-1">
            Thanks — flagged!
          </p>
          <p className="text-[11px] text-text-muted">
            Our team will review this and update the void status.
          </p>
          <button
            onClick={() => setState('idle')}
            className="mt-3 text-[10px] text-text-muted hover:text-text-primary transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
