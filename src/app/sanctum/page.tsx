'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Container } from '@/components/ui';
import { GradientText } from '@/components/effects/GradientText';
import { ParticleBackground } from './components/ParticleBackground';
import { CategoryPicker } from './components/CategoryPicker';
import { SanctumChat } from './components/SanctumChat';
import { TypewriterCode } from './components/TypewriterCode';
import { TokenCounter } from './components/TokenCounter';
import { SanctumVisualization } from './components/SanctumVisualization';
import { GlassPanel } from './components/GlassPanel';
import { AchievementPopup } from './components/AchievementPopup';
import { DeployCelebration } from './components/DeployCelebration';
import { TaskProgressInline } from './components/TaskProgressInline';
import { ShareContract } from './components/ShareContract';
import { DeploymentHistory } from './components/DeploymentHistory';
import { SocialProof } from './components/SocialProof';
import { ContractDNA } from './components/ContractDNA';
import { GasEstimatorCompact } from './components/GasEstimator';
import { ContractComparison } from './components/ContractComparison';
import { SimulationSandbox } from './components/SimulationSandbox';
import { PairProgramming } from './components/PairProgramming';
import { DownloadButton } from './components/DownloadContract';
import { FileStructure, FileStructureToggle } from './components/FileStructure';
import { WebappBuilder } from './components/WebappBuilder';
import { ImportContract } from './components/ImportContract';
import { WebappSession } from './components/WebappSession';
import { useSanctumState } from './hooks/useSanctumState';
import { Sparkles, Zap, Code2, Rocket, ChevronLeft, Flame, Hammer, Share2, GitCompare, Play, Users, Globe, Palette } from 'lucide-react';
import { RoastMode } from './components/RoastMode';
import { VisualMode } from './components/VisualMode';

// Template slug → starter message mapping
const TEMPLATE_MESSAGES: Record<string, { message: string; category: string }> = {
  token: {
    message: 'I want to build a NEP-141 fungible token contract on NEAR. Walk me through the template step by step — explain the code structure, key functions, and how to deploy it to testnet.',
    category: 'defi',
  },
  nft: {
    message: 'I want to build an NFT collection on NEAR using NEP-171. Walk me through the template — minting, royalties, metadata, and marketplace integration.',
    category: 'nfts',
  },
  dao: {
    message: 'I want to build a DAO governance contract on NEAR. Walk me through proposals, voting mechanics, treasury management, and role-based access control.',
    category: 'daos',
  },
  vault: {
    message: 'I want to build a DeFi vault contract on NEAR. Walk me through share-based deposits, yield strategies, auto-compounding, and slippage protection.',
    category: 'defi',
  },
  marketplace: {
    message: 'I want to build an NFT marketplace on NEAR. Walk me through listings, escrow payments, the offer system, and fee distribution.',
    category: 'nfts',
  },
  agent: {
    message: 'I want to build an autonomous AI agent on NEAR. Walk me through TEE execution, key management, Chain Signatures, and multi-chain signing.',
    category: 'ai-agents',
  },
};

export default function SanctumPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-void-black" />}>
      <SanctumPageInner />
    </Suspense>
  );
}

function SanctumPageInner() {
  const searchParams = useSearchParams();
  const templateSlug = searchParams.get('template');
  const templateConfig = templateSlug ? TEMPLATE_MESSAGES[templateSlug] : null;
  const templateHandledRef = useRef(false);

  const {
    state,
    dispatch,
    handleCategorySelect,
    handleCustomStart,
    handleTokensUsed,
    handleCodeGenerated,
    handleTaskUpdate,
    handleThinkingChange,
    handleDeploy,
    handleBack,
    handleShare,
    handleShareFromHistory,
    handleRemixFromHistory,
  } = useSanctumState();

  // Auto-start session when template query param is present
  useEffect(() => {
    if (templateConfig && !templateHandledRef.current && !state.sessionStarted) {
      templateHandledRef.current = true;
      // Start the build session with the mapped category
      handleCategorySelect(templateConfig.category);
      // Clean the URL
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('template');
        window.history.replaceState({}, '', url.pathname);
      }
    }
  }, [templateConfig, state.sessionStarted, handleCategorySelect]);

  // Derive the auto-message for SanctumChat (only when template triggered the session)
  const autoMessage = templateHandledRef.current && templateConfig ? templateConfig.message : undefined;

  return (
    <div className="min-h-screen bg-void-black relative overflow-hidden">
      {/* Animated particle background */}
      <ParticleBackground />

      {/* Achievement popup */}
      <AchievementPopup
        achievement={state.currentAchievement}
        onClose={() => dispatch({ type: 'SET_CURRENT_ACHIEVEMENT', payload: null })}
      />

      {/* Deploy celebration with confetti */}
      <DeployCelebration
        isVisible={state.showDeployCelebration}
        contractId={state.deployedContractId || undefined}
        explorerUrl={state.deployedContractId ? `https://explorer.testnet.near.org/accounts/${state.deployedContractId}` : undefined}
        onClose={() => dispatch({ type: 'SET_SHOW_DEPLOY_CELEBRATION', payload: false })}
      />

      {/* Share modal */}
      {state.showShareModal && state.contractToShare && (
        <ShareContract
          code={state.contractToShare.code}
          contractName={state.contractToShare.name}
          category={state.contractToShare.category}
          onClose={() => {
            dispatch({ type: 'SET_SHOW_SHARE_MODAL', payload: false });
            dispatch({ type: 'SET_CONTRACT_TO_SHARE', payload: null });
          }}
        />
      )}

      {/* Comparison modal */}
      {state.showComparison && state.generatedCode && (
        <ContractComparison
          currentCode={state.generatedCode}
          onClose={() => dispatch({ type: 'SET_SHOW_COMPARISON', payload: false })}
        />
      )}

      {/* Simulation modal */}
      {state.showSimulation && state.generatedCode && (
        <SimulationSandbox
          code={state.generatedCode}
          onClose={() => dispatch({ type: 'SET_SHOW_SIMULATION', payload: false })}
        />
      )}

      {/* Pair Programming modal */}
      {state.showPairProgramming && (
        <PairProgramming
          sessionId={state.pairSessionId}
          onClose={() => dispatch({ type: 'SET_SHOW_PAIR_PROGRAMMING', payload: false })}
        />
      )}

      {/* Webapp Builder modal (legacy download mode) */}
      {state.showWebappBuilder && (state.generatedCode || state.importedContract) && (
        <WebappBuilder
          code={state.generatedCode || state.importedContract?.code || ''}
          contractName={state.importedContract?.name || state.selectedCategory || 'my-contract'}
          deployedAddress={state.importedContract?.address || state.deployedContractId || undefined}
          onClose={() => {
            dispatch({ type: 'SET_SHOW_WEBAPP_BUILDER', payload: false });
            dispatch({ type: 'SET_IMPORTED_CONTRACT', payload: null });
          }}
        />
      )}

      {/* Interactive Webapp Session */}
      {state.showWebappSession && state.importedContract && (
        <WebappSession
          contractName={state.importedContract.name}
          contractAddress={state.importedContract.address}
          methods={state.importedContract.methods}
          onBack={() => {
            dispatch({ type: 'SET_SHOW_WEBAPP_SESSION', payload: false });
            dispatch({ type: 'SET_IMPORTED_CONTRACT', payload: null });
          }}
        />
      )}

      {/* Landing / Category Selection */}
      {!state.sessionStarted && (
        <section className="relative z-10 min-h-screen flex flex-col">
          {/* Hero */}
          <div className="flex-1 flex items-center justify-center py-16">
            <Container size="xl" className="text-center">
              {/* Animated badge */}
              <div className="flex items-center justify-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-near-green/10 border border-near-green/20 animate-pulse-glow">
                  <Sparkles className="w-4 h-4 text-near-green" />
                  <span className="text-near-green text-sm font-mono font-medium">THE SANCTUM</span>
                  <span className="text-text-muted text-sm">by Voidspace</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
                <span className="text-text-primary">Build on NEAR</span>
                <br />
                <GradientText className="mt-2">From Idea to Launch</GradientText>
              </h1>

              {/* Subtitle */}
              <p className="text-text-secondary text-xl max-w-2xl mx-auto mb-12">
                AI-powered development studio for NEAR Protocol.
                <br />
                <span className="text-near-green">Contracts, webapps, deployment</span> — all through conversation.
              </p>

              {/* Friendly Mode Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-5xl mx-auto">
                <button
                  onClick={() => dispatch({ type: 'SET_MODE', payload: 'build' })}
                  className={`group p-6 rounded-2xl border-2 transition-all text-center hover:scale-[1.02] hover:shadow-2xl ${
                    state.mode === 'build'
                      ? 'border-near-green/50 bg-near-green/10 shadow-lg shadow-near-green/20'
                      : 'border-border-subtle bg-void-gray/30 hover:border-near-green/30 hover:bg-near-green/5'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center transition-all ${
                    state.mode === 'build' 
                      ? 'bg-near-green/20 text-near-green' 
                      : 'bg-border-subtle text-text-muted group-hover:bg-near-green/20 group-hover:text-near-green'
                  }`}>
                    <Hammer className="w-6 h-6" />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 transition-colors ${
                    state.mode === 'build' ? 'text-near-green' : 'text-text-primary group-hover:text-near-green'
                  }`}>
                    Build a Smart Contract
                  </h3>
                  <p className="text-sm text-text-muted">
                    AI walks you through creating a Rust smart contract step by step
                  </p>
                </button>

                <button
                  onClick={() => dispatch({ type: 'SET_MODE', payload: 'webapp' })}
                  className={`group p-6 rounded-2xl border-2 transition-all text-center hover:scale-[1.02] hover:shadow-2xl ${
                    state.mode === 'webapp'
                      ? 'border-cyan-500/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                      : 'border-border-subtle bg-void-gray/30 hover:border-cyan-500/30 hover:bg-cyan-500/5'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center transition-all ${
                    state.mode === 'webapp' 
                      ? 'bg-cyan-500/20 text-cyan-400' 
                      : 'bg-border-subtle text-text-muted group-hover:bg-cyan-500/20 group-hover:text-cyan-400'
                  }`}>
                    <Globe className="w-6 h-6" />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 transition-colors ${
                    state.mode === 'webapp' ? 'text-cyan-400' : 'text-text-primary group-hover:text-cyan-400'
                  }`}>
                    Build a Web App
                  </h3>
                  <p className="text-sm text-text-muted">
                    Generate a frontend for your existing NEAR contract
                  </p>
                </button>

                <button
                  onClick={() => dispatch({ type: 'SET_MODE', payload: 'roast' })}
                  className={`group p-6 rounded-2xl border-2 transition-all text-center hover:scale-[1.02] hover:shadow-2xl ${
                    state.mode === 'roast'
                      ? 'border-red-500/50 bg-red-500/10 shadow-lg shadow-red-500/20'
                      : 'border-border-subtle bg-void-gray/30 hover:border-red-500/30 hover:bg-red-500/5'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center transition-all ${
                    state.mode === 'roast' 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-border-subtle text-text-muted group-hover:bg-red-500/20 group-hover:text-red-400'
                  }`}>
                    <Flame className="w-6 h-6" />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 transition-colors ${
                    state.mode === 'roast' ? 'text-red-400' : 'text-text-primary group-hover:text-red-400'
                  }`}>
                    Audit Your Code
                  </h3>
                  <p className="text-sm text-text-muted">
                    Paste any contract and get a brutally honest security review
                  </p>
                </button>

                <button
                  onClick={() => dispatch({ type: 'SET_MODE', payload: 'visual' })}
                  className={`group p-6 rounded-2xl border-2 transition-all text-center hover:scale-[1.02] hover:shadow-2xl ${
                    state.mode === 'visual'
                      ? 'border-purple-500/50 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                      : 'border-border-subtle bg-void-gray/30 hover:border-purple-500/30 hover:bg-purple-500/5'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center transition-all ${
                    state.mode === 'visual' 
                      ? 'bg-purple-500/20 text-purple-400' 
                      : 'bg-border-subtle text-text-muted group-hover:bg-purple-500/20 group-hover:text-purple-400'
                  }`}>
                    <Palette className="w-6 h-6" />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 transition-colors ${
                    state.mode === 'visual' ? 'text-purple-400' : 'text-text-primary group-hover:text-purple-400'
                  }`}>
                    Visual Generator
                  </h3>
                  <p className="text-sm text-text-muted">
                    AI-generated diagrams, infographics, and social graphics
                  </p>
                </button>
              </div>

              {/* Category Picker (Build Mode), Webapp Import, or Start Roast */}
              {state.mode === 'build' && (
                <div className="mb-16">
                  <CategoryPicker
                    onSelect={handleCategorySelect}
                    customPrompt={state.customPrompt}
                    setCustomPrompt={(prompt) => dispatch({ type: 'SET_CUSTOM_PROMPT', payload: prompt })}
                    onCustomStart={handleCustomStart}
                  />
                </div>
              )}
              
              {state.mode === 'webapp' && !state.showImportContract && (
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <p className="text-text-secondary mb-8">
                    Build a beautiful frontend for your NEAR smart contract. 
                    <br />
                    <span className="text-cyan-400">Bring your own contract or use one you just built.</span>
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <button
                      onClick={() => dispatch({ type: 'SET_SHOW_IMPORT_CONTRACT', payload: true })}
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
                      onClick={() => dispatch({ type: 'SET_MODE', payload: 'build' })}
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
              
              {state.mode === 'webapp' && state.showImportContract && (
                <div className="mb-16">
                  <ImportContract
                    onImport={(data) => {
                      dispatch({ type: 'SET_IMPORTED_CONTRACT', payload: data });
                      dispatch({ type: 'SET_SHOW_IMPORT_CONTRACT', payload: false });
                      // Start the interactive webapp session
                      if (data.code) {
                        dispatch({ type: 'SET_GENERATED_CODE', payload: data.code });
                      }
                      dispatch({ type: 'SET_SELECTED_CATEGORY', payload: data.name });
                      dispatch({ type: 'SET_SHOW_WEBAPP_SESSION', payload: true });
                    }}
                    onCancel={() => dispatch({ type: 'SET_SHOW_IMPORT_CONTRACT', payload: false })}
                  />
                </div>
              )}
              
              {state.mode === 'roast' && (
                <div className="text-center mb-16">
                  <p className="text-text-secondary mb-6">
                    Paste any NEAR smart contract and watch it get torn apart by our security experts.
                  </p>
                  <button
                    onClick={() => dispatch({ type: 'SET_SESSION_STARTED', payload: true })}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold text-lg hover:from-red-600 hover:to-orange-600 transition-all shadow-lg shadow-red-500/25"
                  >
                    <Flame className="w-6 h-6" />
                    🔥 Enter the Roast Zone 🔥
                  </button>
                </div>
              )}

              {state.mode === 'visual' && (
                <div className="mb-16">
                  <p className="text-text-secondary text-center mb-8">
                    Generate branded visuals for your NEAR project — architecture diagrams, user flows, infographics, and social graphics.
                  </p>
                  <VisualMode />
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 mb-12 flex-wrap">
                <div className="text-center">
                  <div className="text-3xl font-bold text-text-primary font-mono">15+</div>
                  <div className="text-xs text-text-muted uppercase tracking-wider">Contract Types</div>
                </div>
                <div className="w-px h-12 bg-border-subtle hidden sm:block" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400 font-mono">Full</div>
                  <div className="text-xs text-text-muted uppercase tracking-wider">Stack Builder</div>
                </div>
                <div className="w-px h-12 bg-border-subtle hidden sm:block" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-near-green font-mono">&lt;5m</div>
                  <div className="text-xs text-text-muted uppercase tracking-wider">To Deploy</div>
                </div>
              </div>

              {/* Social Proof Banner */}
              <div className="mb-8">
                <SocialProof variant="banner" />
              </div>

              {/* History toggle - smaller and less prominent */}
              <div className="flex justify-center">
                <button
                  onClick={() => dispatch({ type: 'SET_SHOW_HISTORY', payload: !state.showHistory })}
                  className="text-xs text-text-muted hover:text-text-secondary transition-colors underline decoration-dotted underline-offset-4"
                >
                  {state.showHistory ? 'Hide' : 'View'} My Deployments
                </button>
              </div>

              {/* Deployment History (collapsible) */}
              {state.showHistory && (
                <div className="max-w-2xl mx-auto mt-8">
                  <DeploymentHistory
                    onRemix={handleRemixFromHistory}
                    onShare={handleShareFromHistory}
                  />
                </div>
              )}
            </Container>
          </div>

          {/* Features footer */}
          <div className="py-8 border-t border-border-subtle bg-void-black/50 backdrop-blur-sm">
            <Container size="xl">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 lg:gap-12 text-sm text-text-muted">
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
              
              {/* Void Bubbles CTA */}
              <div className="mt-16 max-w-lg mx-auto">
                <Link href="/void-bubbles" className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-cyan/5 border border-accent-cyan/20 hover:border-accent-cyan/40 transition-all">
                  <span className="text-lg">🫧</span>
                  <span className="text-sm text-text-secondary group-hover:text-accent-cyan transition-colors">
                    Track token health in real-time → Void Bubbles
                  </span>
                </Link>
              </div>
            </Container>
          </div>
        </section>
      )}

      {/* Roast Session - full screen */}
      {state.sessionStarted && state.mode === 'roast' && (
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
      {state.sessionStarted && state.mode === 'build' && (
        <div className="relative z-40 flex flex-col bg-void-black h-screen">
          {/* Session background - contained, no bleeding */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-void-black to-near-green/10" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-near-green/10 rounded-full blur-3xl" />
          </div>

          {/* Header with back button - always visible */}
          <div className="relative z-10 flex-shrink-0 p-4 border-b border-white/[0.08] bg-void-black/50 backdrop-blur-sm">
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
                      {state.selectedCategory === 'custom' ? 'Custom Build' : state.selectedCategory?.replace('-', ' ')}
                    </GradientText>
                  </h2>
                  <p className="text-sm text-text-muted">Chat with Sanctum to forge your contract</p>
                </div>
              </div>
              
              {/* Desktop controls */}
              <div className="hidden md:flex items-center gap-4">
                <button
                  onClick={() => dispatch({ type: 'SET_SOUND_ENABLED', payload: !state.soundEnabled })}
                  className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors text-lg"
                  title={state.soundEnabled ? 'Sound on' : 'Sound off'}
                >
                  {state.soundEnabled ? '🔊' : '🔇'}
                </button>
                
                <TokenCounter 
                  tokensUsed={state.tokensUsed} 
                  tokenBalance={state.tokenBalance}
                />
              </div>
            </div>
          </div>

          {/* Mobile Tab Bar */}
          <div className="md:hidden relative z-10 flex-shrink-0 sticky top-0 bg-void-black/80 backdrop-blur-sm border-b border-white/[0.08]">
            <div className="flex">
              <button
                onClick={() => dispatch({ type: 'SET_ACTIVE_PANEL', payload: 'chat' })}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-all ${
                  state.activePanel === 'chat'
                    ? 'text-purple-400 border-b-2 border-purple-500 bg-purple-500/10'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <span>💬</span>
                Chat
              </button>
              <button
                onClick={() => dispatch({ type: 'SET_ACTIVE_PANEL', payload: 'code' })}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-all ${
                  state.activePanel === 'code'
                    ? 'text-near-green border-b-2 border-near-green bg-near-green/10'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <span>⚡</span>
                Code
              </button>
            </div>
          </div>
          
          {/* Main content - responsive layout */}
          <div className="relative z-10 flex-1 flex overflow-hidden">
            {/* Desktop Layout: Side-by-side */}
            <div className="hidden md:flex flex-1 gap-3 p-3 overflow-hidden">
              {/* Left Panel - Chat */}
              <div className="w-1/2 flex flex-col h-full">
                <GlassPanel className="flex-1 flex flex-col overflow-hidden" glow glowColor="purple">
                  {/* Chat - fills remaining space */}
                  <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    <SanctumChat 
                      category={state.selectedCategory}
                      customPrompt={state.customPrompt}
                      autoMessage={autoMessage}
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
                          onClick={() => navigator.clipboard.writeText(state.generatedCode)}
                          disabled={!state.generatedCode}
                          title="Copy code"
                        >
                          <Code2 className="w-4 h-4" />
                        </button>
                        <DownloadButton code={state.generatedCode} contractName={state.selectedCategory || 'contract'} />
                        <FileStructureToggle 
                          code={state.generatedCode} 
                          contractName={state.selectedCategory || 'my-contract'}
                          isOpen={state.showFileStructure}
                          onToggle={() => dispatch({ type: 'SET_SHOW_FILE_STRUCTURE', payload: !state.showFileStructure })}
                        />
                        <button 
                          className="px-3 py-2 text-sm bg-white/[0.05] hover:bg-blue-500/20 rounded-lg border border-white/[0.1] transition-all flex items-center gap-2 hover:border-blue-500/30 disabled:opacity-50"
                          onClick={() => dispatch({ type: 'SET_SHOW_COMPARISON', payload: true })}
                          disabled={!state.generatedCode}
                          title="Compare versions"
                        >
                          <GitCompare className="w-4 h-4" />
                        </button>
                        <button 
                          className="px-3 py-2 text-sm bg-white/[0.05] hover:bg-green-500/20 rounded-lg border border-white/[0.1] transition-all flex items-center gap-2 hover:border-green-500/30 disabled:opacity-50"
                          onClick={() => dispatch({ type: 'SET_SHOW_SIMULATION', payload: true })}
                          disabled={!state.generatedCode}
                          title="Test in sandbox"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button 
                          className="px-3 py-2 text-sm bg-white/[0.05] hover:bg-pink-500/20 rounded-lg border border-white/[0.1] transition-all flex items-center gap-2 hover:border-pink-500/30"
                          onClick={() => dispatch({ type: 'SET_SHOW_PAIR_PROGRAMMING', payload: true })}
                          title="Pair programming"
                        >
                          <Users className="w-4 h-4" />
                        </button>
                        <button 
                          className="px-3 py-2 text-sm bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg border border-purple-500/30 transition-all flex items-center gap-2 disabled:opacity-50 hover:shadow-lg hover:shadow-purple-500/20"
                          onClick={handleShare}
                          disabled={!state.generatedCode}
                          title="Share contract"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button 
                          className="px-4 py-2 text-sm bg-near-green/20 hover:bg-near-green/30 text-near-green rounded-lg border border-near-green/30 transition-all flex items-center gap-2 disabled:opacity-50 hover:shadow-lg hover:shadow-near-green/20"
                          onClick={handleDeploy}
                          disabled={!state.generatedCode || state.sanctumStage === 'thinking'}
                        >
                          <Rocket className="w-4 h-4" />
                          Deploy
                        </button>
                        <button 
                          className="px-4 py-2 text-sm bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg border border-cyan-500/30 transition-all flex items-center gap-2 disabled:opacity-50 hover:shadow-lg hover:shadow-cyan-500/20"
                          onClick={() => dispatch({ type: 'SET_SHOW_WEBAPP_BUILDER', payload: true })}
                          disabled={!state.generatedCode}
                          title="Generate webapp for this contract"
                        >
                          <Globe className="w-4 h-4" />
                          Webapp
                        </button>
                      </div>
                    </div>
                    {/* Task progress row */}
                    <TaskProgressInline task={state.currentTask} isThinking={state.isThinking} />
                  </div>

                  {/* Error banner - Desktop */}
                  {state.deployError && (
                    <div className="mx-4 mt-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-red-400">{state.deployError}</span>
                      <button onClick={() => dispatch({ type: 'SET_DEPLOY_ERROR', payload: null })} className="text-red-400 hover:text-red-300 ml-2">✕</button>
                    </div>
                  )}

                  {/* File Structure Panel */}
                  {state.showFileStructure && state.generatedCode && (
                    <div className="p-4 border-b border-white/[0.08]">
                      <FileStructure 
                        code={state.generatedCode} 
                        contractName={state.selectedCategory || 'my-contract'}
                      />
                    </div>
                  )}

                  {/* Sanctum Visualization */}
                  {!state.generatedCode && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                      <SanctumVisualization
                        isGenerating={state.isGenerating}
                        progress={0}
                        stage={state.sanctumStage}
                      />
                      <p className="mt-6 text-text-muted text-center max-w-sm">
                        Start chatting with Sanctum to generate your smart contract code.
                        I&apos;ll teach you Rust as we build together.
                      </p>
                    </div>
                  )}

                  {/* Code with typing animation */}
                  {state.generatedCode && (
                    <div className="flex-1 min-h-0 overflow-auto">
                      <TypewriterCode 
                        code={state.generatedCode}
                        speed={8}
                        onComplete={() => dispatch({ type: 'SET_SANCTUM_STAGE', payload: 'complete' })}
                      />
                    </div>
                  )}

                  {/* Contract DNA + Gas + File info */}
                  {state.generatedCode && (
                    <div className="flex-shrink-0 border-t border-white/[0.08] bg-void-black/50">
                      {/* DNA and Gas row */}
                      <div className="p-3 flex items-center justify-between border-b border-white/[0.05]">
                        <ContractDNA code={state.generatedCode} size="sm" showLabel={true} />
                        <GasEstimatorCompact code={state.generatedCode} />
                      </div>
                      {/* File info row */}
                      <div className="px-3 py-2 flex items-center justify-between text-xs text-text-muted">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-near-green animate-pulse" />
                          contract.rs
                        </span>
                        <span>{state.generatedCode.split('\n').length} lines • {state.generatedCode.length} chars</span>
                      </div>
                    </div>
                  )}
                </GlassPanel>
              </div>
            </div>

            {/* Mobile Layout: Stacked with tabs */}
            <div className="md:hidden flex-1 flex flex-col overflow-hidden">
              {/* Chat Panel */}
              {state.activePanel === 'chat' && (
                <div className="flex-1 p-3 overflow-hidden">
                  <GlassPanel className="flex-1 flex flex-col overflow-hidden" glow glowColor="purple">
                    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                      <SanctumChat 
                        category={state.selectedCategory}
                        customPrompt={state.customPrompt}
                        autoMessage={autoMessage}
                        onCodeGenerated={handleCodeGenerated}
                        onTokensUsed={handleTokensUsed}
                        onTaskUpdate={handleTaskUpdate}
                        onThinkingChange={handleThinkingChange}
                      />
                    </div>
                  </GlassPanel>
                </div>
              )}

              {/* Code Panel */}
              {state.activePanel === 'code' && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 p-3 overflow-hidden">
                    <GlassPanel className="flex-1 flex flex-col overflow-hidden" glow glowColor="green">
                      {/* Mobile Code Header */}
                      <div className="flex-shrink-0 p-4 border-b border-white/[0.08] bg-void-black/50">
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                            <span className="text-xl">⚡</span>
                            <span className="text-near-green">Contract</span>
                          </h2>
                          <div className="flex items-center gap-2">
                            <button 
                              className="px-3 py-2 text-sm bg-white/[0.05] hover:bg-white/[0.1] rounded-lg border border-white/[0.1] transition-all flex items-center gap-2"
                              onClick={() => navigator.clipboard.writeText(state.generatedCode)}
                              disabled={!state.generatedCode}
                              title="Copy"
                            >
                              <Code2 className="w-4 h-4" />
                            </button>
                            <DownloadButton code={state.generatedCode} contractName={state.selectedCategory || 'contract'} />
                          </div>
                        </div>
                        <TaskProgressInline task={state.currentTask} isThinking={state.isThinking} />
                      </div>

                      {/* Error banner - Mobile */}
                      {state.deployError && (
                        <div className="mx-4 mt-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-between">
                          <span className="text-sm text-red-400">{state.deployError}</span>
                          <button onClick={() => dispatch({ type: 'SET_DEPLOY_ERROR', payload: null })} className="text-red-400 hover:text-red-300 ml-2">✕</button>
                        </div>
                      )}

                      {/* File Structure Panel */}
                      {state.showFileStructure && state.generatedCode && (
                        <div className="p-4 border-b border-white/[0.08]">
                          <FileStructure 
                            code={state.generatedCode} 
                            contractName={state.selectedCategory || 'my-contract'}
                          />
                        </div>
                      )}

                      {/* Sanctum Visualization */}
                      {!state.generatedCode && (
                        <div className="flex-1 flex flex-col items-center justify-center p-6">
                          <SanctumVisualization
                            isGenerating={state.isGenerating}
                            progress={0}
                            stage={state.sanctumStage}
                          />
                          <p className="mt-4 text-text-muted text-center text-sm">
                            Switch to Chat to start building your contract.
                          </p>
                        </div>
                      )}

                      {/* Code with typing animation */}
                      {state.generatedCode && (
                        <div className="flex-1 min-h-0 overflow-auto">
                          <TypewriterCode 
                            code={state.generatedCode}
                            speed={8}
                            onComplete={() => dispatch({ type: 'SET_SANCTUM_STAGE', payload: 'complete' })}
                          />
                        </div>
                      )}

                      {/* Contract info footer */}
                      {state.generatedCode && (
                        <div className="flex-shrink-0 border-t border-white/[0.08] bg-void-black/50">
                          <div className="p-3 flex items-center justify-between border-b border-white/[0.05]">
                            <ContractDNA code={state.generatedCode} size="sm" showLabel={false} />
                            <GasEstimatorCompact code={state.generatedCode} />
                          </div>
                          <div className="px-3 py-2 flex items-center justify-between text-xs text-text-muted">
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-near-green animate-pulse" />
                              contract.rs
                            </span>
                            <span>{state.generatedCode.split('\n').length} lines</span>
                          </div>
                        </div>
                      )}
                    </GlassPanel>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Bottom Toolbar */}
          <div className="md:hidden relative z-10 flex-shrink-0 border-t border-white/[0.08] bg-void-black/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 p-3 overflow-x-auto">
              <button 
                className="flex items-center gap-2 px-3 py-2 text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg border border-purple-500/30 transition-all disabled:opacity-50 whitespace-nowrap"
                onClick={handleShare}
                disabled={!state.generatedCode}
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button 
                className="flex items-center gap-2 px-3 py-2 text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg border border-blue-500/30 transition-all disabled:opacity-50 whitespace-nowrap"
                onClick={() => dispatch({ type: 'SET_SHOW_COMPARISON', payload: true })}
                disabled={!state.generatedCode}
              >
                <GitCompare className="w-4 h-4" />
                Compare
              </button>
              <button 
                className="flex items-center gap-2 px-3 py-2 text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg border border-green-500/30 transition-all disabled:opacity-50 whitespace-nowrap"
                onClick={() => dispatch({ type: 'SET_SHOW_SIMULATION', payload: true })}
                disabled={!state.generatedCode}
              >
                <Play className="w-4 h-4" />
                Test
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2 text-xs bg-near-green/20 hover:bg-near-green/30 text-near-green rounded-lg border border-near-green/30 transition-all disabled:opacity-50 whitespace-nowrap font-medium"
                onClick={handleDeploy}
                disabled={!state.generatedCode || state.sanctumStage === 'thinking'}
              >
                <Rocket className="w-4 h-4" />
                Deploy
              </button>
              <button 
                className="flex items-center gap-2 px-3 py-2 text-xs bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg border border-cyan-500/30 transition-all disabled:opacity-50 whitespace-nowrap"
                onClick={() => dispatch({ type: 'SET_SHOW_WEBAPP_BUILDER', payload: true })}
                disabled={!state.generatedCode}
              >
                <Globe className="w-4 h-4" />
                Webapp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
