'use client';

import { useState, useCallback, useEffect } from 'react';
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
import { TaskProgressInline, CurrentTask } from './components/TaskProgressInline';
import { ShareContract } from './components/ShareContract';
import { DeploymentHistory, saveDeployment, DeployedContract } from './components/DeploymentHistory';
import { SocialProof, LiveBuildersIndicator } from './components/SocialProof';
import { ContractDNA } from './components/ContractDNA';
import { GasEstimatorCompact } from './components/GasEstimator';
import { ContractComparison } from './components/ContractComparison';
import { SimulationSandbox } from './components/SimulationSandbox';
import { PairProgramming, generateSessionId } from './components/PairProgramming';
import { DownloadButton } from './components/DownloadContract';
import { FileStructure, FileStructureToggle } from './components/FileStructure';
import { WebappBuilder } from './components/WebappBuilder';
import { ImportContract, ImportedContract } from './components/ImportContract';
// @ts-expect-error - lucide-react types issue with TS 5.9
import { Sparkles, Zap, Code2, Rocket, ChevronLeft, Flame, Hammer, Share2, Clock, GitCompare, Play, Users, Globe } from 'lucide-react';
import { RoastMode } from './components/RoastMode';

type SanctumStage = 'idle' | 'thinking' | 'generating' | 'complete';
type SanctumMode = 'build' | 'roast' | 'webapp';

export default function SanctumPage() {
  const [mode, setMode] = useState<SanctumMode>('build');
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
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [currentTask, setCurrentTask] = useState<CurrentTask | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [contractToShare, setContractToShare] = useState<{ code: string; name: string; category?: string } | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [showSimulation, setShowSimulation] = useState(false);
  const [showPairProgramming, setShowPairProgramming] = useState(false);
  const [pairSessionId] = useState(() => generateSessionId());
  const [showFileStructure, setShowFileStructure] = useState(false);
  const [showWebappBuilder, setShowWebappBuilder] = useState(false);
  const [showImportContract, setShowImportContract] = useState(false);
  const [importedContract, setImportedContract] = useState<ImportedContract | null>(null);

  // Lock body scroll and enable immersive mode when session is active
  useEffect(() => {
    if (sessionStarted) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.setAttribute('data-immersive', 'true');
      // Start session timer
      if (!sessionStartTime) {
        setSessionStartTime(Date.now());
      }
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.removeAttribute('data-immersive');
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.removeAttribute('data-immersive');
    };
  }, [sessionStarted, sessionStartTime]);

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

  // Task tracking for live progress display
  const handleTaskUpdate = useCallback((task: CurrentTask | null) => {
    setCurrentTask(task);
  }, []);

  const handleThinkingChange = useCallback((thinking: boolean) => {
    setIsThinking(thinking);
  }, []);

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
      const contractId = data.contractId || `sanctum-${Date.now()}.testnet`;
      setDeployedContractId(contractId);
      setShowDeployCelebration(true);
      
      // Save to deployment history
      saveDeployment({
        name: selectedCategory === 'custom' ? 'Custom Contract' : (selectedCategory || 'My Contract'),
        category: selectedCategory || 'custom',
        network: 'testnet',
        contractAddress: contractId,
        txHash: data.txHash || `tx-${Date.now()}`,
        code: generatedCode,
      });
      
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

  const handleShare = useCallback(() => {
    if (generatedCode) {
      setContractToShare({
        code: generatedCode,
        name: selectedCategory === 'custom' ? 'Custom Contract' : (selectedCategory || 'My Contract'),
        category: selectedCategory || undefined,
      });
      setShowShareModal(true);
    }
  }, [generatedCode, selectedCategory]);

  const handleShareFromHistory = useCallback((contract: DeployedContract) => {
    setContractToShare({
      code: contract.code,
      name: contract.name,
      category: contract.category,
    });
    setShowShareModal(true);
  }, []);

  const handleRemixFromHistory = useCallback((code: string, name: string) => {
    setGeneratedCode(code);
    setSelectedCategory('custom');
    setCustomPrompt(`Remix: ${name}`);
    setSessionStarted(true);
    setShowHistory(false);
  }, []);

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

      {/* Share modal */}
      {showShareModal && contractToShare && (
        <ShareContract
          code={contractToShare.code}
          contractName={contractToShare.name}
          category={contractToShare.category}
          onClose={() => {
            setShowShareModal(false);
            setContractToShare(null);
          }}
        />
      )}

      {/* Comparison modal */}
      {showComparison && generatedCode && (
        <ContractComparison
          currentCode={generatedCode}
          onClose={() => setShowComparison(false)}
        />
      )}

      {/* Simulation modal */}
      {showSimulation && generatedCode && (
        <SimulationSandbox
          code={generatedCode}
          onClose={() => setShowSimulation(false)}
        />
      )}

      {/* Pair Programming modal */}
      {showPairProgramming && (
        <PairProgramming
          sessionId={pairSessionId}
          onClose={() => setShowPairProgramming(false)}
        />
      )}

      {/* Webapp Builder modal */}
      {showWebappBuilder && (generatedCode || importedContract) && (
        <WebappBuilder
          code={generatedCode || importedContract?.code || ''}
          contractName={importedContract?.name || selectedCategory || 'my-contract'}
          deployedAddress={importedContract?.address || deployedContractId || undefined}
          onClose={() => {
            setShowWebappBuilder(false);
            setImportedContract(null);
          }}
        />
      )}

      {/* Landing / Category Selection */}
      {!sessionStarted && (
        <section className="relative z-10 min-h-screen flex flex-col">
          {/* Hero */}
          <div className="flex-1 flex items-center justify-center py-16">
            <Container size="xl" className="text-center">
              {/* Animated badge + Live indicator */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-near-green/10 border border-near-green/20 animate-pulse-glow">
                  <Sparkles className="w-4 h-4 text-near-green" />
                  <span className="text-near-green text-sm font-mono font-medium">THE SANCTUM</span>
                  <span className="text-text-muted text-sm">by Voidspace</span>
                </div>
                <LiveBuildersIndicator />
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

              {/* Mode Switcher */}
              <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
                <button
                  onClick={() => setMode('build')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    mode === 'build'
                      ? 'bg-near-green/20 text-near-green border border-near-green/30 shadow-lg shadow-near-green/20'
                      : 'bg-void-gray text-text-muted border border-border-subtle hover:border-near-green/30'
                  }`}
                >
                  <Hammer className="w-5 h-5" />
                  Build Contract
                </button>
                <button
                  onClick={() => setMode('webapp')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    mode === 'webapp'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/20'
                      : 'bg-void-gray text-text-muted border border-border-subtle hover:border-cyan-500/30'
                  }`}
                >
                  <Globe className="w-5 h-5" />
                  Build Webapp
                </button>
                <button
                  onClick={() => setMode('roast')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    mode === 'roast'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-lg shadow-red-500/20'
                      : 'bg-void-gray text-text-muted border border-border-subtle hover:border-red-500/30'
                  }`}
                >
                  <Flame className="w-5 h-5" />
                  Roast Mode
                </button>
              </div>

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

              {/* Social Proof Banner */}
              <div className="mb-12">
                <SocialProof variant="banner" />
              </div>

              {/* History toggle */}
              <div className="flex justify-center mb-8">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:text-white bg-void-gray/50 hover:bg-void-gray border border-border-subtle hover:border-purple-500/30 rounded-lg transition-all"
                >
                  <Clock className="w-4 h-4" />
                  {showHistory ? 'Hide' : 'View'} My Deployments
                </button>
              </div>

              {/* Deployment History (collapsible) */}
              {showHistory && (
                <div className="max-w-2xl mx-auto mb-12">
                  <DeploymentHistory
                    onRemix={handleRemixFromHistory}
                    onShare={handleShareFromHistory}
                  />
                </div>
              )}

              {/* Category Picker (Build Mode), Webapp Import, or Start Roast */}
              {mode === 'build' && (
                <CategoryPicker
                  onSelect={handleCategorySelect}
                  customPrompt={customPrompt}
                  setCustomPrompt={setCustomPrompt}
                  onCustomStart={handleCustomStart}
                />
              )}
              
              {mode === 'webapp' && !showImportContract && (
                <div className="text-center max-w-2xl mx-auto">
                  <p className="text-text-secondary mb-8">
                    Build a beautiful frontend for your NEAR smart contract. 
                    <br />
                    <span className="text-cyan-400">Bring your own contract or use one you just built.</span>
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <button
                      onClick={() => setShowImportContract(true)}
                      className="p-6 rounded-xl bg-void-gray/50 border border-cyan-500/30 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all text-left group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
                        <Globe className="w-6 h-6 text-cyan-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">Import Existing Contract</h3>
                      <p className="text-sm text-gray-400">
                        Have a contract already? Paste the address or code and we&apos;ll build a webapp for it.
                      </p>
                    </button>
                    
                    <button
                      onClick={() => setMode('build')}
                      className="p-6 rounded-xl bg-void-gray/50 border border-near-green/30 hover:border-near-green/50 hover:bg-near-green/10 transition-all text-left group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-near-green/20 flex items-center justify-center mb-4 group-hover:bg-near-green/30 transition-colors">
                        <Hammer className="w-6 h-6 text-near-green" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">Build Contract First</h3>
                      <p className="text-sm text-gray-400">
                        Don&apos;t have a contract yet? Build one with Sanctum, then come back for the webapp.
                      </p>
                    </button>
                  </div>
                </div>
              )}
              
              {mode === 'webapp' && showImportContract && (
                <ImportContract
                  onImport={(data) => {
                    setImportedContract(data);
                    setShowImportContract(false);
                    // If they imported code, set it as generated code and go to webapp builder
                    if (data.code) {
                      setGeneratedCode(data.code);
                    }
                    setSelectedCategory(data.name);
                    setShowWebappBuilder(true);
                  }}
                  onCancel={() => setShowImportContract(false)}
                />
              )}
              
              {mode === 'roast' && (
                <div className="text-center">
                  <p className="text-text-secondary mb-6">
                    Paste any NEAR smart contract and watch it get torn apart by our security experts.
                  </p>
                  <button
                    onClick={() => setSessionStarted(true)}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold text-lg hover:from-red-600 hover:to-orange-600 transition-all shadow-lg shadow-red-500/25"
                  >
                    <Flame className="w-6 h-6" />
                    🔥 Enter the Roast Zone 🔥
                  </button>
                </div>
              )}
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

      {/* Roast Session - full screen */}
      {sessionStarted && mode === 'roast' && (
        <div className="relative z-40 flex flex-col bg-void-black h-screen">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-void-black to-orange-900/10" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10 flex flex-1 p-3 overflow-hidden">
            <div className="w-full max-w-4xl mx-auto">
              <GlassPanel className="flex-1 flex flex-col h-full overflow-hidden" glow glowColor="red">
                {/* Header with back button */}
                <div className="flex-shrink-0 p-4 border-b border-white/[0.08] bg-void-black/50">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleBack}
                      className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors group"
                    >
                      <ChevronLeft className="w-5 h-5 text-text-muted group-hover:text-red-400 transition-colors" />
                    </button>
                    <span className="text-text-muted">Back to modes</span>
                  </div>
                </div>
                
                {/* Roast Mode Component */}
                <RoastMode />
              </GlassPanel>
            </div>
          </div>
        </div>
      )}

      {/* Build Session - full screen immersive mode */}
      {sessionStarted && mode === 'build' && (
        <div 
          className="relative z-40 flex flex-col bg-void-black h-screen"
        >
          {/* Session background - contained, no bleeding */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-void-black to-near-green/10" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-near-green/10 rounded-full blur-3xl" />
          </div>
          
          {/* Main content - fills available space */}
          <div className="relative z-10 flex flex-1 gap-3 p-3 overflow-hidden">
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
                    onTaskUpdate={handleTaskUpdate}
                    onThinkingChange={handleThinkingChange}
                  />
                </div>
              </GlassPanel>
            </div>

            {/* Right Panel - Code Preview */}
            <div className="w-1/2 flex flex-col h-full">
              <GlassPanel className="flex-1 flex flex-col overflow-hidden" glow glowColor="green">
                {/* Header with inline task progress */}
                <div className="flex-shrink-0 p-4 border-b border-white/[0.08] bg-void-black/50">
                  {/* Top row: Title + Buttons */}
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                      <span className="text-xl">⚡</span>
                      <span className="text-near-green">Contract</span> Preview
                    </h2>
                    <div className="flex items-center gap-2">
                      <button 
                        className="px-3 py-2 text-sm bg-white/[0.05] hover:bg-white/[0.1] rounded-lg border border-white/[0.1] transition-all flex items-center gap-2 hover:border-purple-500/30"
                        onClick={() => navigator.clipboard.writeText(generatedCode)}
                        disabled={!generatedCode}
                        title="Copy code"
                      >
                        <Code2 className="w-4 h-4" />
                      </button>
                      <DownloadButton code={generatedCode} contractName={selectedCategory || 'contract'} />
                      <FileStructureToggle 
                        code={generatedCode} 
                        contractName={selectedCategory || 'my-contract'}
                        isOpen={showFileStructure}
                        onToggle={() => setShowFileStructure(!showFileStructure)}
                      />
                      <button 
                        className="px-3 py-2 text-sm bg-white/[0.05] hover:bg-blue-500/20 rounded-lg border border-white/[0.1] transition-all flex items-center gap-2 hover:border-blue-500/30 disabled:opacity-50"
                        onClick={() => setShowComparison(true)}
                        disabled={!generatedCode}
                        title="Compare versions"
                      >
                        <GitCompare className="w-4 h-4" />
                      </button>
                      <button 
                        className="px-3 py-2 text-sm bg-white/[0.05] hover:bg-green-500/20 rounded-lg border border-white/[0.1] transition-all flex items-center gap-2 hover:border-green-500/30 disabled:opacity-50"
                        onClick={() => setShowSimulation(true)}
                        disabled={!generatedCode}
                        title="Test in sandbox"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button 
                        className="px-3 py-2 text-sm bg-white/[0.05] hover:bg-pink-500/20 rounded-lg border border-white/[0.1] transition-all flex items-center gap-2 hover:border-pink-500/30"
                        onClick={() => setShowPairProgramming(true)}
                        title="Pair programming"
                      >
                        <Users className="w-4 h-4" />
                      </button>
                      <button 
                        className="px-3 py-2 text-sm bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg border border-purple-500/30 transition-all flex items-center gap-2 disabled:opacity-50 hover:shadow-lg hover:shadow-purple-500/20"
                        onClick={handleShare}
                        disabled={!generatedCode}
                        title="Share contract"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="px-4 py-2 text-sm bg-near-green/20 hover:bg-near-green/30 text-near-green rounded-lg border border-near-green/30 transition-all flex items-center gap-2 disabled:opacity-50 hover:shadow-lg hover:shadow-near-green/20"
                        onClick={handleDeploy}
                        disabled={!generatedCode || sanctumStage === 'thinking'}
                      >
                        <Rocket className="w-4 h-4" />
                        Deploy
                      </button>
                      <button 
                        className="px-4 py-2 text-sm bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg border border-cyan-500/30 transition-all flex items-center gap-2 disabled:opacity-50 hover:shadow-lg hover:shadow-cyan-500/20"
                        onClick={() => setShowWebappBuilder(true)}
                        disabled={!generatedCode}
                        title="Generate webapp for this contract"
                      >
                        <Globe className="w-4 h-4" />
                        Webapp
                      </button>
                    </div>
                  </div>
                  {/* Task progress row */}
                  <TaskProgressInline task={currentTask} isThinking={isThinking} />
                </div>

                {/* File Structure Panel */}
                {showFileStructure && generatedCode && (
                  <div className="p-4 border-b border-white/[0.08]">
                    <FileStructure 
                      code={generatedCode} 
                      contractName={selectedCategory || 'my-contract'}
                    />
                  </div>
                )}

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

                {/* Contract DNA + Gas + File info */}
                {generatedCode && (
                  <div className="flex-shrink-0 border-t border-white/[0.08] bg-void-black/50">
                    {/* DNA and Gas row */}
                    <div className="p-3 flex items-center justify-between border-b border-white/[0.05]">
                      <ContractDNA code={generatedCode} size="sm" showLabel={true} />
                      <GasEstimatorCompact code={generatedCode} />
                    </div>
                    {/* File info row */}
                    <div className="px-3 py-2 flex items-center justify-between text-xs text-text-muted">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-near-green animate-pulse" />
                        contract.rs
                      </span>
                      <span>{generatedCode.split('\n').length} lines • {generatedCode.length} chars</span>
                    </div>
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
