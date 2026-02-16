'use client';

import { useState, useCallback } from 'react';
import { ChevronLeft, Download, Rocket, Zap, Clock } from 'lucide-react';
import { WebappChat, WebappComponent } from './WebappChat';
import { WebappPreview } from './WebappPreview';
import { ExtractedMethod } from './ImportContract';
import { GlassPanel } from './GlassPanel';
import { GradientText } from '@/components/effects/GradientText';

interface WebappSessionProps {
  contractName: string;
  contractAddress?: string;
  methods: ExtractedMethod[];
  onBack: () => void;
  onDeploy?: () => void;
}

export function WebappSession({
  contractName,
  contractAddress,
  methods,
  onBack,
  onDeploy,
}: WebappSessionProps) {
  const [previewHtml, setPreviewHtml] = useState('');
  const [components, setComponents] = useState<WebappComponent[]>([]);
  const [tokensUsed, setTokensUsed] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activePanel, setActivePanel] = useState<'chat' | 'preview'>('chat');

  // Track session time
  useState(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  });

  const handlePreviewUpdate = useCallback((html: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      setPreviewHtml(html);
      setIsGenerating(false);
    }, 500);
  }, []);

  const handleComponentAdd = useCallback((component: WebappComponent) => {
    setComponents(prev => [...prev, component].sort((a, b) => a.order - b.order));
  }, []);

  const handleTokensUsed = useCallback((tokens: number) => {
    setTokensUsed(prev => prev + tokens);
  }, []);

  const handleSave = () => {
    // Save to localStorage
    const projectData = {
      contractName,
      contractAddress,
      components,
      previewHtml,
      tokensUsed,
      sessionTime,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(`webapp_project_${contractName}`, JSON.stringify(projectData));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDownload = () => {
    // Generate downloadable project
    const blob = new Blob([previewHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contractName}-webapp.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-void-black flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-3 sm:px-4 py-3 border-b border-void-purple/20 bg-void-darker/80 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              onClick={onBack}
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span className="text-xl hidden sm:inline">🌐</span>
                <GradientText className="truncate">{contractName}</GradientText>
                <span className="text-sm text-gray-500 font-normal hidden md:inline">Webapp Builder</span>
              </h1>
              {contractAddress && (
                <p className="text-xs text-gray-500 font-mono truncate">{contractAddress}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Stats - hidden on mobile */}
            <div className="hidden sm:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Zap className="w-4 h-4" />
                <span>{tokensUsed.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{formatTime(sessionTime)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={handleSave}
                className={`min-h-[44px] px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  isSaved 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-void-purple/20 text-void-purple border border-void-purple/30 hover:bg-void-purple/30'
                }`}
              >
                <span>💾</span>
                <span className="hidden sm:inline">{isSaved ? 'Saved!' : 'Save'}</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={!previewHtml}
                className="min-h-[44px] px-3 sm:px-4 py-2 bg-void-gray border border-void-purple/30 rounded-lg text-gray-300 hover:bg-void-purple/20 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </button>
              <button
                onClick={onDeploy}
                disabled={!previewHtml}
                className="hidden sm:flex min-h-[44px] px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-medium rounded-lg transition-colors disabled:opacity-50 items-center gap-2"
              >
                <Rocket className="w-4 h-4" />
                Deploy to Vercel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex border-b border-white/[0.08] flex-shrink-0">
        <button
          onClick={() => setActivePanel('chat')}
          className={`flex-1 py-3 text-sm min-h-[44px] ${
            activePanel === 'chat'
              ? 'text-purple-400 border-b-2 border-purple-500'
              : 'text-gray-500'
          }`}
        >
          💬 Chat
        </button>
        <button
          onClick={() => setActivePanel('preview')}
          className={`flex-1 py-3 text-sm min-h-[44px] ${
            activePanel === 'preview'
              ? 'text-near-green border-b-2 border-near-green'
              : 'text-gray-500'
          }`}
        >
          👁 Preview
        </button>
      </div>

      {/* Desktop: side by side */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r border-void-purple/20">
          <GlassPanel className="h-full" glow glowColor="blue">
            <WebappChat
              contractName={contractName}
              methods={methods}
              onPreviewUpdate={handlePreviewUpdate}
              onComponentAdd={handleComponentAdd}
              onTokensUsed={handleTokensUsed}
            />
          </GlassPanel>
        </div>
        <div className="w-1/2">
          <GlassPanel className="h-full" glow glowColor="green">
            <WebappPreview
              html={previewHtml}
              components={components}
              isGenerating={isGenerating}
            />
          </GlassPanel>
        </div>
      </div>

      {/* Mobile: show active panel */}
      <div className="md:hidden flex-1 overflow-hidden">
        {activePanel === 'chat' && (
          <GlassPanel className="h-full" glow glowColor="blue">
            <WebappChat
              contractName={contractName}
              methods={methods}
              onPreviewUpdate={handlePreviewUpdate}
              onComponentAdd={handleComponentAdd}
              onTokensUsed={handleTokensUsed}
            />
          </GlassPanel>
        )}
        {activePanel === 'preview' && (
          <GlassPanel className="h-full" glow glowColor="green">
            <WebappPreview
              html={previewHtml}
              components={components}
              isGenerating={isGenerating}
            />
          </GlassPanel>
        )}
      </div>

      {/* Components Bar */}
      {components.length > 0 && (
        <div className="flex-shrink-0 px-4 py-2 border-t border-void-purple/20 bg-void-darker/50">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Components:</span>
            <div className="flex gap-1 overflow-x-auto">
              {components.map((c) => (
                <span
                  key={c.id}
                  className="px-2 py-1 bg-void-purple/20 text-void-purple text-xs rounded-lg flex-shrink-0"
                >
                  {c.name}
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-auto">
              {components.length} total
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
