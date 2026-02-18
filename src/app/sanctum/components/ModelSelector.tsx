'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Cpu, Zap, Brain, Lock } from 'lucide-react';
import { SANCTUM_TIERS, type SanctumTier, type AvailableModel } from '@/lib/sanctum-tiers';

interface ModelSelectorProps {
  tier: SanctumTier;
  onModelChange?: (modelId: string) => void;
}

export function ModelSelector({ tier, onModelChange }: ModelSelectorProps) {
  const tierConfig = SANCTUM_TIERS[tier];
  const availableModels = tierConfig.availableModels;
  const isFreeTier = tier === 'shade';
  const [selectedModel, setSelectedModel] = useState<string>(tierConfig.aiModel);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load saved preference on mount
  useEffect(() => {
    async function loadPreference() {
      try {
        const res = await fetch('/api/sanctum/model-preference');
        if (res.ok) {
          const data = await res.json();
          if (data.preferredModel && availableModels.some((m: AvailableModel) => m.id === data.preferredModel)) {
            setSelectedModel(data.preferredModel);
          }
        }
      } catch {
        // Silently fail — use default
      }
    }
    if (!isFreeTier) {
      loadPreference();
    }
  }, [tier, isFreeTier, availableModels]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = async (modelId: string) => {
    if (modelId === selectedModel) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/sanctum/model-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelId }),
      });

      if (res.ok) {
        setSelectedModel(modelId);
        onModelChange?.(modelId);
      }
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
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

  // Paid tier: interactive toggle
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`
          flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium
          transition-all duration-200 cursor-pointer
          border
          ${isOpus
            ? 'bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/50'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/50'
          }
          ${isLoading ? 'opacity-50' : ''}
        `}
      >
        {isOpus ? <Brain className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
        <span>{currentModel.name}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 z-50 w-72 rounded-lg border border-white/10 bg-gray-900/95 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="px-3 py-2 border-b border-white/5">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Select AI Model</span>
          </div>
          {availableModels.map((model: AvailableModel) => {
            const isSelected = model.id === selectedModel;
            const modelIsOpus = model.id.includes('opus');
            return (
              <button
                key={model.id}
                onClick={() => handleSelect(model.id)}
                className={`
                  w-full px-3 py-2.5 text-left transition-colors
                  ${isSelected
                    ? modelIsOpus
                      ? 'bg-purple-500/15 border-l-2 border-purple-400'
                      : 'bg-emerald-500/15 border-l-2 border-emerald-400'
                    : 'hover:bg-white/5 border-l-2 border-transparent'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  {modelIsOpus ? (
                    <Brain className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-400' : 'text-gray-500'}`} />
                  ) : (
                    <Zap className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-gray-500'}`} />
                  )}
                  <div>
                    <div className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      {model.name}
                      {model.default && (
                        <span className="ml-1.5 text-[9px] uppercase tracking-wider px-1 py-0.5 rounded bg-white/10 text-gray-400">default</span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{model.description}</div>
                  </div>
                  {isSelected && (
                    <div className={`ml-auto w-1.5 h-1.5 rounded-full ${modelIsOpus ? 'bg-purple-400' : 'bg-emerald-400'}`} />
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
        </div>
      )}
    </div>
  );
}
