'use client';

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { ChevronDown, Cpu, Zap, Brain, Lock, Sparkles } from 'lucide-react';
import { createPortal } from 'react-dom';
import { SANCTUM_TIERS, type SanctumTier, type AvailableModel } from '@/lib/sanctum-tiers';

const MODEL_PREF_KEY = 'sanctum-model-preference';

interface ModelSelectorProps {
  tier: SanctumTier;
  onModelChange?: (modelId: string) => void;
}

export function ModelSelector({ tier, onModelChange }: ModelSelectorProps) {
  const tierConfig = SANCTUM_TIERS[tier];
  const availableModels = tierConfig.availableModels;
  const isFreeTier = tier === 'shade';

  // Always start with the tier's default model — no localStorage override
  const [selectedModel, setSelectedModel] = useState<string>(tierConfig.aiModel);

  // Re-sync when tier changes (e.g. user loads after initial render)
  useEffect(() => {
    setSelectedModel(tierConfig.aiModel);
  }, [tierConfig.aiModel]);

  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Position the dropdown after it renders (measures actual size)
  const positionDropdown = useCallback(() => {
    if (!buttonRef.current || !dropdownRef.current) return;
    const btnRect = buttonRef.current.getBoundingClientRect();
    const dd = dropdownRef.current;
    const ddHeight = dd.offsetHeight;
    const ddWidth = Math.min(288, window.innerWidth - 16);

    // Default: position above the button, aligned left
    let top = btnRect.top - ddHeight - 4;
    let left = btnRect.left;

    // Clamp horizontal
    if (left < 8) left = 8;
    if (left + ddWidth > window.innerWidth - 8) {
      left = window.innerWidth - ddWidth - 8;
    }

    // If not enough room above, show below
    if (top < 8) {
      top = btnRect.bottom + 4;
    }

    dd.style.top = `${top}px`;
    dd.style.left = `${left}px`;
    dd.style.width = `${ddWidth}px`;
  }, []);

  // Reposition on open, scroll, resize
  useLayoutEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(positionDropdown);

    const handleUpdate = () => requestAnimationFrame(positionDropdown);
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);
    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [isOpen, positionDropdown]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        buttonRef.current && !buttonRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const handleSelect = (modelId: string) => {
    if (modelId === selectedModel) {
      setIsOpen(false);
      return;
    }

    setSelectedModel(modelId);
    onModelChange?.(modelId);
    setIsOpen(false);
  };

  const currentModel = availableModels.find((m: AvailableModel) => m.id === selectedModel) || availableModels[0];
  const isOpus = selectedModel.includes('opus');

  // Free tier: just show a label
  if (isFreeTier) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-400">
        <Cpu className="w-3 h-3" />
        <span>{currentModel.name}</span>
        <Lock className="w-3 h-3 ml-0.5 text-gray-500" />
      </div>
    );
  }

  // Portal dropdown
  const dropdown = isOpen && typeof document !== 'undefined' ? createPortal(
    <div
      ref={dropdownRef}
      className="fixed z-[9999] rounded-lg border border-white/10 bg-gray-900/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150"
      style={{ top: -9999, left: -9999 }}
    >
      <div className="px-3 py-2 border-b border-white/5">
        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Select AI Model</span>
      </div>
      {availableModels.map((model: AvailableModel) => {
        const isSelected = model.id === selectedModel;
        const modelIsOpus = model.id.includes('opus');
        const isComingSoon = model.comingSoon === true;
        return (
          <button
            key={model.id}
            onClick={() => !isComingSoon && handleSelect(model.id)}
            disabled={isComingSoon}
            className={`
              w-full px-3 py-2.5 text-left transition-colors
              ${isComingSoon
                ? 'opacity-50 cursor-not-allowed border-l-2 border-transparent'
                : isSelected
                  ? modelIsOpus
                    ? 'bg-purple-500/15 border-l-2 border-purple-400'
                    : 'bg-emerald-500/15 border-l-2 border-emerald-400'
                  : 'hover:bg-white/5 border-l-2 border-transparent active:bg-white/10'
              }
            `}
          >
            <div className="flex items-center gap-2">
              {isComingSoon ? (
                <Sparkles className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
              ) : modelIsOpus ? (
                <Brain className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-purple-400' : 'text-gray-500'}`} />
              ) : (
                <Zap className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-emerald-400' : 'text-gray-500'}`} />
              )}
              <div className="min-w-0 flex-1">
                <div className={`text-xs font-medium ${isComingSoon ? 'text-gray-500' : isSelected ? 'text-white' : 'text-gray-300'}`}>
                  {model.name}
                  {model.default && !isComingSoon && (
                    <span className="ml-1.5 text-[9px] uppercase tracking-wider px-1 py-0.5 rounded bg-white/10 text-gray-400">default</span>
                  )}
                  {isComingSoon && (
                    <span className="ml-1.5 text-[9px] uppercase tracking-wider px-1 py-0.5 rounded bg-emerald-500/15 text-emerald-500/70 border border-emerald-500/20">coming soon</span>
                  )}
                </div>
                <div className={`text-[11px] mt-0.5 leading-snug ${isComingSoon ? 'text-gray-600' : 'text-gray-500'}`}>{model.description}</div>
              </div>
              {isSelected && !isComingSoon && (
                <div className={`ml-auto flex-shrink-0 w-1.5 h-1.5 rounded-full ${modelIsOpus ? 'bg-purple-400' : 'bg-emerald-400'}`} />
              )}
            </div>
          </button>
        );
      })}
      <div className="px-3 py-1.5 border-t border-white/5">
        <span className="text-[10px] text-gray-600">
          {isOpus ? '💰 Opus uses ~5x more credits than Sonnet' : '⚡ Sonnet is optimized for fast, accurate code generation'}
        </span>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium
          transition-all duration-200 cursor-pointer
          border
          ${isOpus
            ? 'bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/50'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/50'
          }
        `}
      >
        {isOpus ? <Brain className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
        <span>{currentModel.name}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {dropdown}
    </div>
  );
}
