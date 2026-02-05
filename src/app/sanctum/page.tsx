'use client';

import { useState, useCallback } from 'react';
import { Container } from '@/components/ui';
import { GradientText } from '@/components/effects/GradientText';
import { ParticleBackground } from './components/ParticleBackground';
import { CategoryPicker } from './components/CategoryPicker';
import { SanctumChat } from './components/SanctumChat';
import { TypewriterCode } from './components/TypewriterCode';
import { TokenCounter } from './components/TokenCounter';
import { SanctumVisualization } from './components/SanctumVisualization';
import { GlassPanel } from './components/GlassPanel';
import { AchievementPopup, Achievement, ACHIEVEMENTS } from './components/AchievementPopup';
import { DeployCelebration } from './components/DeployCelebration';
import { Sparkles, Zap, Code2, Rocket, ChevronLeft } from 'lucide-react';

type SanctumStage = 'idle' | 'thinking' | 'generating' | 'complete';

export default function SanctumPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [tokensUsed, setTokensUsed] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(50000);
  const [sanctumStage, setSanctumStage] = useState<SanctumStage>('idle');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [messageCount, setMessageCount] = useState(0);
  const [deployCount, setDeployCount] = useState(0);
  const [showDeployCelebration, setShowDeployCelebration] = useState(false);
  const [deployedContractId, setDeployedContractId] = useState<string | null>(null);

  const unlockAchievement = useCallback((achievementId: string) => {
    if (unlockedAchievements.has(achievementId)) return;
    
    const achievement = ACHIEVEMENTS[achievementId];
    if (achievement) {
      setUnlockedAchievements(prev => new Set(Array.from(prev).concat([achievementId])));
      setCurrentAchievement(achievement);
      
      // Play sound if enabled
      if (soundEnabled) {
        const audio = new Audio('/sounds/achievement.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      }
    }
  }, [unlockedAchievements, soundEnabled]);

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setSessionStarted(true);
    
    // Check for category-specific achievements
    if (categorySlug === 'chain-signatures') {
      setTimeout(() => unlockAchievement('chain_signatures'), 2000);
    } else if (categorySlug === 'ai-agents') {
      setTimeout(() => unlockAchievement('shade_agent'), 2000);
    }
  };

  const handleCustomStart = () => {
    if (customPrompt.trim()) {
      setSelectedCategory('custom');
      setSessionStarted(true);
    }
  };

  const handleTokensUsed = (input: number, output: number) => {
    const total = input + output;
    setTokensUsed(prev => prev + total);
    setTokenBalance(prev => prev - total);
    setMessageCount(prev => prev + 1);
    
    // First message achievement
    if (messageCount === 0) {
      unlockAchievement('first_message');
    }
  };

  const handleCodeGenerated = (code: string) => {
    setSanctumStage('generating');
    setIsGenerating(true);
    setGeneratedCode(code);
    
    // First code achievement
    if (!unlockedAchievements.has('first_code')) {
      setTimeout(() => unlockAchievement('first_code'), 1500);
    }
    
    // Complete after typing animation
    setTimeout(() => {
      setSanctumStage('complete');
      setIsGenerating(false);
    }, code.length * 10 + 500);
  };

  const handleDeploy = async () => {
    setSanctumStage('thinking');
    
    try {
      // Call deploy API
      const response = await fetch('/api/sanctum/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: generatedCode,
          category: selectedCategory,
        }),
      });
      
      const data = await response.json();
      
      setDeployCount(prev => prev + 1);
      
      // First deploy achievement
      if (deployCount === 0) {
        unlockAchievement('first_deploy');
      }
      
      setSanctumStage('complete');
      
      // Show celebration with contract ID
      setDeployedContractId(data.contractId || `sanctum-${Date.now()}.testnet`);
      setShowDeployCelebration(true);
      
      // Play deploy sound
      if (soundEnabled) {
        const audio = new Audio('/sounds/deploy.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {});
      }
    } catch (error) {
      console.error('Deploy error:', error);
      setSanctumStage('complete');
    }
  };

  const handleBack = () => {
    setSessionStarted(false);
    setSelectedCategory(null);
    setGeneratedCode('');
    setSanctumStage('idle');
  };

  return (
    <div className="min-h-screen bg-void-black relative overflow-hidden">
      {/* Animated particle background */}
      <ParticleBackground />

      {/* Achievement popup */}
      <AchievementPopup
        achievement={currentAchievement}
        onClose={() => setCurrentAchievement(null)}
      />

      {/* Deploy celebration with confetti */}
      <DeployCelebration
        isVisible={showDeployCelebration}
        contractId={deployedContractId || undefined}
        explorerUrl={deployedContractId ? `https://explorer.testnet.near.org/accounts/${deployedContractId}` : undefined}
        onClose={() => setShowDeployCelebration(false)}
      />

      {/* Landing / Category Selection */}
      {!sessionStarted && (
        <section className="relative z-10 min-h-screen flex flex-col">
          {/* Hero */}
          <div className="flex-1 flex items-center justify-center py-16">
            <Container size="xl" className="text-center">
              {/* Animated badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-near-green/10 border border-near-green/20 mb-8 animate-pulse-glow">
                <Sparkles className="w-4 h-4 text-near-green" />
                <span className="text-near-green text-sm font-mono font-medium">THE SANCTUM</span>
                <span className="text-text-muted text-sm">by Voidspace</span>
              </div>

              {/* Title */}
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
                <span className="text-text-primary">Build Smart Contracts</span>
                <br />
                <GradientText className="mt-2">By Talking</GradientText>
              </h1>

              {/* Subtitle */}
              <p className="text-text-secondary text-xl max-w-2xl mx-auto mb-12">
                AI-powered contract development for NEAR Protocol.
                <br />
                <span className="text-near-green">Learn Rust as you build.</span> Deploy in minutes.
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 mb-16">
                <div className="text-center">
                  <div className="text-3xl font-bold text-text-primary font-mono">15</div>
                  <div className="text-xs text-text-muted uppercase tracking-wider">Categories</div>
                </div>
                <div className="w-px h-12 bg-border-subtle" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-near-green font-mono">5</div>
                  <div className="text-xs text-text-muted uppercase tracking-wider">NEAR Priorities</div>
                </div>
                <div className="w-px h-12 bg-border-subtle" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-text-primary font-mono">&lt;5m</div>
                  <div className="text-xs text-text-muted uppercase tracking-wider">To Deploy</div>
                </div>
              </div>

              {/* Category Picker */}
              <CategoryPicker
                onSelect={handleCategorySelect}
                customPrompt={customPrompt}
                setCustomPrompt={setCustomPrompt}
                onCustomStart={handleCustomStart}
              />
            </Container>
          </div>

          {/* Features footer */}
          <div className="py-8 border-t border-border-subtle bg-void-black/50 backdrop-blur-sm">
            <Container size="xl">
              <div className="flex items-center justify-center gap-12 text-sm text-text-muted">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-near-green" />
                  <span>Rust Smart Contracts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Chain Signatures</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Shade Agents</span>
                </div>
                <div className="flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-cyan-400" />
                  <span>One-Click Deploy</span>
                </div>
              </div>
            </Container>
          </div>
        </section>
      )}

      {/* Build Session - uses calc to account for header (h-16 = 64px) */}
      {sessionStarted && (
        <div className="fixed top-16 left-0 right-0 bottom-0 z-40 flex flex-col bg-void-black">
          {/* Session background - contained, no bleeding */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-void-black to-near-green/10" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-near-green/10 rounded-full blur-3xl" />
          </div>
          
          {/* Main content - fills available space */}
          <div className="relative z-10 flex flex-1 gap-3 p-3 h-full overflow-hidden">
            {/* Left Panel - Chat */}
            <div className="w-1/2 flex flex-col h-full">
              <GlassPanel className="flex-1 flex flex-col overflow-hidden" glow glowColor="purple">
                {/* Header */}
                <div className="flex-shrink-0 p-4 border-b border-white/[0.08] bg-void-black/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleBack}
                        className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors group"
                      >
                        <ChevronLeft className="w-5 h-5 text-text-muted group-hover:text-near-green transition-colors" />
                      </button>
                      <div>
                        <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                          <span className="text-2xl">🔮</span>
                          <GradientText>
                            {selectedCategory === 'custom' ? 'Custom Build' : selectedCategory?.replace('-', ' ')}
                          </GradientText>
                        </h2>
                        <p className="text-sm text-text-muted">Chat with Sanctum to forge your contract</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* Sound toggle */}
                      <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors text-lg"
                        title={soundEnabled ? 'Sound on' : 'Sound off'}
                      >
                        {soundEnabled ? '🔊' : '🔇'}
                      </button>
                      
                      <TokenCounter 
                        tokensUsed={tokensUsed} 
                        tokenBalance={tokenBalance}
                      />
                    </div>
                  </div>
                </div>

                {/* Chat - fills remaining space */}
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  <SanctumChat 
                    category={selectedCategory}
                    customPrompt={customPrompt}
                    onCodeGenerated={handleCodeGenerated}
                    onTokensUsed={handleTokensUsed}
                  />
                </div>
              </GlassPanel>
            </div>

            {/* Right Panel - Code Preview */}
            <div className="w-1/2 flex flex-col h-full">
              <GlassPanel className="flex-1 flex flex-col overflow-hidden" glow glowColor="green">
                {/* Header */}
                <div className="flex-shrink-0 p-4 border-b border-white/[0.08] bg-void-black/50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                      <span className="text-xl">⚡</span>
                      <span className="text-near-green">Contract</span> Preview
                    </h2>
                    <div className="flex items-center gap-2">
                      <button 
                        className="px-4 py-2 text-sm bg-white/[0.05] hover:bg-white/[0.1] rounded-lg border border-white/[0.1] transition-all flex items-center gap-2 hover:border-purple-500/30"
                        onClick={() => navigator.clipboard.writeText(generatedCode)}
                        disabled={!generatedCode}
                      >
                        <Code2 className="w-4 h-4" />
                        Copy
                      </button>
                      <button 
                        className="px-4 py-2 text-sm bg-near-green/20 hover:bg-near-green/30 text-near-green rounded-lg border border-near-green/30 transition-all flex items-center gap-2 disabled:opacity-50 hover:shadow-lg hover:shadow-near-green/20"
                        onClick={handleDeploy}
                        disabled={!generatedCode || sanctumStage === 'thinking'}
                      >
                        <Rocket className="w-4 h-4" />
                        Deploy to NEAR
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sanctum Visualization */}
                {!generatedCode && (
                  <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <SanctumVisualization
                      isGenerating={isGenerating}
                      progress={0}
                      stage={sanctumStage}
                    />
                    <p className="mt-6 text-text-muted text-center max-w-sm">
                      Start chatting with Sanctum to generate your smart contract code.
                      I&apos;ll teach you Rust as we build together.
                    </p>
                  </div>
                )}

                {/* Code with typing animation */}
                {generatedCode && (
                  <div className="flex-1 min-h-0 overflow-auto">
                    <TypewriterCode 
                      code={generatedCode}
                      speed={8}
                      onComplete={() => setSanctumStage('complete')}
                    />
                  </div>
                )}

                {/* File info */}
                {generatedCode && (
                  <div className="flex-shrink-0 p-3 border-t border-white/[0.08] bg-void-black/50 flex items-center justify-between text-xs text-text-muted">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-near-green animate-pulse" />
                      contract.rs
                    </span>
                    <span>{generatedCode.split('\n').length} lines • {generatedCode.length} chars</span>
                  </div>
                )}
              </GlassPanel>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
