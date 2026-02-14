'use client';

import { Suspense } from 'react';
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
import { SocialProof } from './components/SocialProof';
import { ContractDNA } from './components/ContractDNA';
import { GasEstimatorCompact } from './components/GasEstimator';
import { ContractComparison } from './components/ContractComparison';
import { SimulationSandbox } from './components/SimulationSandbox';
import { PairProgramming } from './components/PairProgramming';
import { DownloadButton } from './components/DownloadContract';
import { FileStructure, FileStructureToggle } from './components/FileStructure';
import { DeployInstructions } from './components/DeployInstructions';
import { ProjectManager } from './components/ProjectManager';
import { WebappBuilder } from './components/WebappBuilder';
import { ImportContract } from './components/ImportContract';
import { WebappSession } from './components/WebappSession';
import { ScratchWebappSession } from './components/ScratchWebappSession';
import { ScratchTemplates, SCRATCH_TEMPLATES } from './components/ScratchTemplates';
import { useSanctumState } from './hooks/useSanctumState';
import { useWallet } from '@/hooks/useWallet';
import { consumeStoredBrief, briefToSanctumPrompt } from '@/lib/brief-to-sanctum';
// @ts-ignore
import { Sparkles, Zap, Code2, Rocket, ChevronLeft, Flame, Hammer, Share2, GitCompare, Play, Users, Globe, Palette, Wallet, Shield, Star, ArrowRight, Wand2 } from 'lucide-react';
import { RoastMode } from './components/RoastMode';
import { VisualMode } from './components/VisualMode';
import { BuilderShowcase } from './components/BuilderShowcase';
import { VoidBriefCard } from './components/VoidBriefCard';
import { PERSONA_LIST } from './lib/personas';

// Template slug → starter message mapping
const TEMPLATE_MESSAGES: Record<string, { message: string; category: string; title: string; subtitle: string }> = {
  token: {
    message: 'I want to build a NEP-141 fungible token contract on NEAR. Walk me through the template step by step — explain the code structure, key functions, and how to deploy it to testnet.',
    category: 'defi',
    title: 'Token Contract',
    subtitle: 'Launch your own fungible token on NEAR',
  },
  nft: {
    message: 'I want to build an NFT collection on NEAR using NEP-171. Walk me through the template — minting, royalties, metadata, and marketplace integration.',
    category: 'nfts',
    title: 'NFT Collection',
    subtitle: 'Create and mint NFTs on NEAR',
  },
  dao: {
    message: 'I want to build a DAO governance contract on NEAR. Walk me through proposals, voting mechanics, treasury management, and role-based access control.',
    category: 'daos',
    title: 'DAO Governance',
    subtitle: 'Decentralized governance on NEAR',
  },
  vault: {
    message: 'I want to build a DeFi vault contract on NEAR. Walk me through share-based deposits, yield strategies, auto-compounding, and slippage protection.',
    category: 'defi',
    title: 'DeFi Vault',
    subtitle: 'Yield strategies and staking on NEAR',
  },
  marketplace: {
    message: 'I want to build an NFT marketplace on NEAR. Walk me through listings, escrow payments, the offer system, and fee distribution.',
    category: 'nfts',
    title: 'Marketplace',
    subtitle: 'Buy, sell, and trade on NEAR',
  },
  agent: {
    message: 'I want to build an autonomous AI agent on NEAR. Walk me through TEE execution, key management, Chain Signatures, and multi-chain signing.',
    category: 'ai-agents',
    title: 'AI Agent',
    subtitle: 'Autonomous on-chain agent on NEAR',
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
  const { isConnected, isLoading: walletLoading, openModal } = useWallet();

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

  // Auto-start session when template query param is present AND wallet is connected
  useEffect(() => {
    if (templateConfig && !templateHandledRef.current && !state.sessionStarted && isConnected) {
      templateHandledRef.current = true;
      // Start the build session with the mapped category
      handleCategorySelect(templateConfig.category);
      // Clean the URL (but keep template in case they need to refresh)
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('template');
        window.history.replaceState({}, '', url.pathname);
      }
    }
  }, [templateConfig, state.sessionStarted, handleCategorySelect, isConnected]);

  // Auto-start session when arriving from a Void Brief (?from=brief)
  const briefHandledRef = useRef(false);
  useEffect(() => {
    const fromBrief = searchParams.get('from') === 'brief';
    if (fromBrief && !briefHandledRef.current && !state.sessionStarted) {
      const storedBrief = consumeStoredBrief();
      if (storedBrief) {
        briefHandledRef.current = true;
        const prompt = briefToSanctumPrompt(storedBrief);
        dispatch({ type: 'SET_CUSTOM_PROMPT', payload: prompt });
        // Small delay to ensure state is set before starting
        setTimeout(() => {
          dispatch({ type: 'SET_SELECTED_CATEGORY', payload: 'custom' });
          dispatch({ type: 'SET_SESSION_STARTED', payload: true });
        }, 50);
        // Clean URL
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.delete('from');
          window.history.replaceState({}, '', url.pathname);
        }
      }
    }
  }, [searchParams, state.sessionStarted, dispatch]);

  // Derive the auto-message for SanctumChat (only when template triggered the session)
  const autoMessage = templateHandledRef.current && templateConfig ? templateConfig.message : undefined;

  // Show wallet gate for template arrivals without wallet connected
  const showWalletGate = templateConfig && !isConnected && !walletLoading && !state.sessionStarted;

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
          category={state.selectedCategory || undefined}
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

      {/* Scratch Webapp Session */}
      {state.showScratchSession && state.scratchDescription && (
        <ScratchWebappSession
          initialPrompt={state.scratchDescription}
          templateName={
            state.scratchTemplate
              ? SCRATCH_TEMPLATES.find(t => t.id === state.scratchTemplate)?.name
              : undefined
          }
          onBack={() => {
            dispatch({ type: 'SET_SHOW_SCRATCH_SESSION', payload: false });
          }}
        />
      )}

      {/* Wallet Gate for Template Walkthroughs */}
      {showWalletGate && (
        <section className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="max-w-lg mx-auto px-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-near-green/10 border border-near-green/20 mb-6">
                <Sparkles className="w-4 h-4 text-near-green" />
                <span className="text-near-green text-sm font-mono font-medium">TEMPLATE WALKTHROUGH</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
                {templateConfig.title}
              </h1>
              <p className="text-text-secondary text-lg">
                {templateConfig.subtitle}
              </p>
            </div>

            <div className="rounded-2xl border-2 border-near-green/30 bg-void-gray/50 backdrop-blur-sm p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-near-green/20 flex items-center justify-center mx-auto mb-5">
                <Wallet className="w-8 h-8 text-near-green" />
              </div>
              
              <h2 className="text-xl font-semibold text-text-primary mb-3">
                Connect your wallet to begin
              </h2>
              
              <p className="text-text-secondary mb-6 leading-relaxed">
                Sanctum uses your NEAR wallet to track your learning progress, 
                save builds, and earn XP as you complete walkthroughs.
              </p>

              <button
                onClick={openModal}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-near-green text-void-black font-semibold text-lg hover:bg-near-green/90 transition-all shadow-lg shadow-near-green/25 mb-6 w-full justify-center"
              >
                <Wallet className="w-5 h-5" />
                Connect NEAR Wallet
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-center gap-6 text-sm text-text-muted">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-near-green/60" />
                  Tracks progress
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400/60" />
                  Earns XP
                </span>
                <span className="flex items-center gap-1.5">
                  <Rocket className="w-4 h-4 text-cyan-400/60" />
                  Deploy to testnet
                </span>
              </div>
            </div>

            <p className="text-center text-xs text-text-muted mt-4">
              Don&apos;t have a wallet? The connection modal will help you create one.
            </p>
          </div>
        </section>
      )}

      {/* Landing / Category Selection */}
      {!state.sessionStarted && !showWalletGate && (
        <section className="relative z-10 min-h-screen flex flex-col">
          {/* Hero — Compact */}
          <div className="pt-16 pb-8">
            <Container size="xl" className="text-center">
              {/* Animated badge */}
              <div className="flex items-center justify-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-near-green/10 border border-near-green/20 animate-pulse-glow">
                  <Sparkles className="w-4 h-4 text-near-green" />
                  <span className="text-near-green text-sm font-mono font-medium">THE SANCTUM</span>
                  <span className="text-text-muted text-sm">by Voidspace</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4">
                <span className="text-text-primary">Build on NEAR</span>
                <br />
                <GradientText className="mt-2">From Idea to Launch</GradientText>
              </h1>

              {/* Subtitle */}
              <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                AI-powered development studio for NEAR Protocol.
                <br />
                <span className="text-near-green">Contracts, webapps, deployment</span> — all through conversation.
              </p>
            </Container>
          </div>

          {/* Social Proof Bar */}
          <div className="pb-8">
            <Container size="xl">
              <SocialProof variant="banner" />
            </Container>
          </div>

          {/* Step 1: "What brings you to the Sanctum?" — 3 Path Cards */}
          <div className="pb-8">
            <Container size="xl">
              <div className="text-center mb-8">
                <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-text-muted/60 mb-2">
                  Step 1
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
                  What brings you to the Sanctum?
                </h2>
              </div>

              <div id="modes" className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
                {/* Path 1: Idea — PRIMARY (slightly larger on md+) */}
                <button
                  onClick={() => {
                    dispatch({ type: 'SET_MODE', payload: 'scratch' });
                    setTimeout(() => {
                      document.getElementById('sanctum-revealed')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }}
                  className={`group relative p-7 md:p-8 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-[1.02] ${
                    state.mode === 'scratch'
                      ? 'border-amber-500/60 bg-gradient-to-br from-amber-500/15 to-orange-500/10 shadow-lg shadow-amber-500/20'
                      : ['build', 'roast', 'webapp', 'visual'].includes(state.mode)
                        ? 'border-border-subtle bg-void-gray/30 opacity-60 hover:opacity-100 hover:border-amber-500/30'
                        : 'border-border-subtle bg-void-gray/30 hover:border-amber-500/40 hover:bg-gradient-to-br hover:from-amber-500/10 hover:to-orange-500/5'
                  }`}
                  style={{ animationDelay: '0ms', animation: 'sanctumFadeInUp 0.5s ease-out backwards' }}
                >
                  {/* Glow effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 blur-xl transition-opacity duration-300 -z-10 ${
                    state.mode === 'scratch' ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                  }`} />
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className={`text-lg font-bold mb-2 transition-colors ${
                    state.mode === 'scratch' ? 'text-amber-400' : 'text-text-primary group-hover:text-amber-400'
                  }`}>
                    I have an idea — build it for me
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    No code needed. Describe your idea, we&apos;ll handle everything.
                  </p>
                  {state.mode !== 'scratch' && (
                    <span className="inline-block mt-3 text-[10px] font-mono uppercase tracking-wider text-amber-400/60 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      ✨ Most Popular
                    </span>
                  )}
                </button>

                {/* Path 2: Learn & Build */}
                <button
                  onClick={() => {
                    dispatch({ type: 'SET_MODE', payload: 'build' });
                    setTimeout(() => {
                      document.getElementById('sanctum-revealed')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }}
                  className={`group relative p-7 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-[1.02] ${
                    state.mode === 'build'
                      ? 'border-near-green/60 bg-near-green/10 shadow-lg shadow-near-green/20'
                      : ['scratch', 'roast', 'webapp', 'visual'].includes(state.mode)
                        ? 'border-border-subtle bg-void-gray/30 opacity-60 hover:opacity-100 hover:border-near-green/30'
                        : 'border-border-subtle bg-void-gray/30 hover:border-near-green/40 hover:bg-near-green/5'
                  }`}
                  style={{ animationDelay: '100ms', animation: 'sanctumFadeInUp 0.5s ease-out backwards' }}
                >
                  <div className={`absolute inset-0 rounded-2xl bg-near-green/10 blur-xl transition-opacity duration-300 -z-10 ${
                    state.mode === 'build' ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                  }`} />
                  <div className="text-4xl mb-4">🔨</div>
                  <h3 className={`text-lg font-bold mb-2 transition-colors ${
                    state.mode === 'build' ? 'text-near-green' : 'text-text-primary group-hover:text-near-green'
                  }`}>
                    I want to learn &amp; build a smart contract
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    AI guides you through Rust on NEAR, step by step.
                  </p>
                </button>

                {/* Path 3: Already have code */}
                <button
                  onClick={() => {
                    // Toggle to show sub-options — use 'roast' as initial selection for path 3
                    if (state.mode !== 'roast' && state.mode !== 'webapp') {
                      dispatch({ type: 'SET_MODE', payload: 'roast' });
                    }
                    setTimeout(() => {
                      document.getElementById('sanctum-revealed')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }}
                  className={`group relative p-7 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-[1.02] ${
                    state.mode === 'roast' || state.mode === 'webapp'
                      ? 'border-red-500/40 bg-gradient-to-br from-red-500/10 to-cyan-500/10 shadow-lg shadow-red-500/10'
                      : ['scratch', 'build', 'visual'].includes(state.mode)
                        ? 'border-border-subtle bg-void-gray/30 opacity-60 hover:opacity-100 hover:border-red-500/30'
                        : 'border-border-subtle bg-void-gray/30 hover:border-red-500/30 hover:bg-gradient-to-br hover:from-red-500/5 hover:to-cyan-500/5'
                  }`}
                  style={{ animationDelay: '200ms', animation: 'sanctumFadeInUp 0.5s ease-out backwards' }}
                >
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/10 to-cyan-500/10 blur-xl transition-opacity duration-300 -z-10 ${
                    state.mode === 'roast' || state.mode === 'webapp' ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                  }`} />
                  <div className="text-4xl mb-4">🛠️</div>
                  <h3 className={`text-lg font-bold mb-2 transition-colors ${
                    state.mode === 'roast' || state.mode === 'webapp' ? 'text-text-primary' : 'text-text-primary group-hover:text-text-primary'
                  }`}>
                    I already have code
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Audit for security vulnerabilities or generate a frontend.
                  </p>
                </button>
              </div>
            </Container>
          </div>

          {/* Revealed Content — Based on selected path */}
          <div id="sanctum-revealed">
            {/* Path 3 sub-options: Roast or Webapp */}
            {(state.mode === 'roast' || state.mode === 'webapp') && (
              <div className="pb-8" style={{ animation: 'sanctumSlideUp 0.4s ease-out' }}>
                <Container size="xl">
                  <div className="text-center mb-6">
                    <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-text-muted/60 mb-2">
                      Step 2
                    </p>
                    <h2 className="text-xl font-bold text-text-primary">
                      What do you want to do with your code?
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <button
                      onClick={() => {
                        dispatch({ type: 'SET_MODE', payload: 'roast' });
                        dispatch({ type: 'SET_SESSION_STARTED', payload: true });
                      }}
                      className={`group p-6 rounded-xl border-2 transition-all text-left hover:scale-[1.02] ${
                        state.mode === 'roast'
                          ? 'border-red-500/50 bg-red-500/10 shadow-lg shadow-red-500/20'
                          : 'border-border-subtle bg-void-gray/30 hover:border-red-500/30 hover:bg-red-500/5'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                          <Flame className="w-5 h-5 text-red-400" />
                        </div>
                        <h3 className="text-lg font-bold text-red-400">Roast Zone</h3>
                      </div>
                      <p className="text-sm text-text-muted">
                        Paste any contract for a brutal security audit
                      </p>
                    </button>

                    <button
                      onClick={() => {
                        dispatch({ type: 'SET_MODE', payload: 'webapp' });
                        setTimeout(() => {
                          document.getElementById('sanctum-webapp-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                      }}
                      className={`group p-6 rounded-xl border-2 transition-all text-left hover:scale-[1.02] ${
                        state.mode === 'webapp'
                          ? 'border-cyan-500/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                          : 'border-border-subtle bg-void-gray/30 hover:border-cyan-500/30 hover:bg-cyan-500/5'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                          <Globe className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h3 className="text-lg font-bold text-cyan-400">Build a Web App</h3>
                      </div>
                      <p className="text-sm text-text-muted">
                        Generate a frontend for your contract
                      </p>
                    </button>
                  </div>
                </Container>
              </div>
            )}

            {/* Webapp import section */}
            {state.mode === 'webapp' && (
              <div id="sanctum-webapp-section" className="pb-8" style={{ animation: 'sanctumSlideUp 0.4s ease-out' }}>
                <Container size="xl">
                  <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-6">
                      <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-text-muted/60 mb-2">
                        Step 2
                      </p>
                      <h2 className="text-xl font-bold text-text-primary">
                        Import your contract
                      </h2>
                    </div>
                    {!state.showImportContract ? (
                      <div className="text-center">
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
                    ) : (
                      <ImportContract
                        onImport={(data) => {
                          dispatch({ type: 'SET_IMPORTED_CONTRACT', payload: data });
                          dispatch({ type: 'SET_SHOW_IMPORT_CONTRACT', payload: false });
                          if (data.code) {
                            dispatch({ type: 'SET_GENERATED_CODE', payload: data.code });
                          }
                          dispatch({ type: 'SET_SELECTED_CATEGORY', payload: data.name });
                          dispatch({ type: 'SET_SHOW_WEBAPP_SESSION', payload: true });
                        }}
                        onCancel={() => dispatch({ type: 'SET_SHOW_IMPORT_CONTRACT', payload: false })}
                      />
                    )}
                  </div>
                </Container>
              </div>
            )}

            {/* Build mode — Category Picker */}
            {state.mode === 'build' && (
              <div className="pb-8" style={{ animation: 'sanctumSlideUp 0.4s ease-out' }}>
                <Container size="xl">
                  <div className="text-center mb-6">
                    <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-text-muted/60 mb-2">
                      Step 2
                    </p>
                    <h2 className="text-xl font-bold text-text-primary">
                      Choose a contract category
                    </h2>
                  </div>
                  <CategoryPicker
                    onSelect={handleCategorySelect}
                    customPrompt={state.customPrompt}
                    setCustomPrompt={(prompt) => dispatch({ type: 'SET_CUSTOM_PROMPT', payload: prompt })}
                    onCustomStart={handleCustomStart}
                  />
                </Container>
              </div>
            )}

            {/* Scratch / Vibe Code */}
            {state.mode === 'scratch' && (
              <div className="pb-8" style={{ animation: 'sanctumSlideUp 0.4s ease-out' }}>
                <Container size="xl">
                  <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-6">
                      <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-text-muted/60 mb-2">
                        Step 2
                      </p>
                      <h2 className="text-xl font-bold text-text-primary mb-2">
                        Describe your idea
                      </h2>
                      <p className="text-text-muted text-sm">
                        Full-stack NEAR dApp — React, Tailwind, wallet connect — generated from your description.
                      </p>
                    </div>

                    {/* Description input */}
                    <div className="mb-8">
                      <textarea
                        value={state.scratchDescription}
                        onChange={(e) => dispatch({ type: 'SET_SCRATCH_DESCRIPTION', payload: e.target.value })}
                        placeholder="I want to build an NFT marketplace where users can mint, list, and trade digital art on NEAR..."
                        rows={4}
                        className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-5 py-4 text-text-primary placeholder-text-muted/50 resize-none focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm leading-relaxed"
                      />
                    </div>

                    {/* Template quick-starts */}
                    <div className="mb-8">
                      <p className="text-xs font-mono uppercase tracking-wider text-text-muted mb-4">
                        Or pick a template to start fast
                      </p>
                      <ScratchTemplates
                        selectedId={state.scratchTemplate}
                        onSelect={(template) => {
                          dispatch({ type: 'SET_SCRATCH_TEMPLATE', payload: template.id });
                          dispatch({ type: 'SET_SCRATCH_DESCRIPTION', payload: template.starterPrompt });
                        }}
                      />
                    </div>

                    {/* Start button */}
                    <div className="text-center">
                      <button
                        onClick={() => {
                          if (state.scratchDescription.trim()) {
                            dispatch({ type: 'SET_SHOW_SCRATCH_SESSION', payload: true });
                          }
                        }}
                        disabled={!state.scratchDescription.trim()}
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-void-black font-semibold text-lg hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-amber-500 disabled:hover:to-orange-500"
                      >
                        <Rocket className="w-5 h-5" />
                        Start Building
                      </button>
                    </div>
                  </div>
                </Container>
              </div>
            )}

            {/* Visual mode content */}
            {state.mode === 'visual' && (
              <div className="pb-8" style={{ animation: 'sanctumSlideUp 0.4s ease-out' }}>
                <Container size="xl">
                  <p className="text-text-secondary text-center mb-8">
                    Generate branded visuals for your NEAR project — architecture diagrams, user flows, infographics, and social graphics.
                  </p>
                  <VisualMode />
                </Container>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="py-4">
            <Container size="xl">
              <div className="border-t border-white/[0.06]" />
            </Container>
          </div>

          {/* Visual Generator — Premium Feature Showcase */}
          <div className="pb-12">
            <Container size="xl">
              <div className="max-w-4xl mx-auto">
                <button
                  onClick={() => {
                    dispatch({ type: 'SET_MODE', payload: 'visual' });
                    setTimeout(() => {
                      document.getElementById('sanctum-revealed')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }}
                  className={`w-full group relative overflow-hidden rounded-2xl border-2 transition-all hover:scale-[1.01] ${
                    state.mode === 'visual'
                      ? 'border-purple-500/50 bg-gradient-to-br from-purple-900/30 via-void-black to-pink-900/20 shadow-2xl shadow-purple-500/20'
                      : 'border-purple-500/20 bg-gradient-to-br from-purple-900/10 via-void-black to-pink-900/5 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/10'
                  }`}
                >
                  {/* Animated background glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 group-hover:bg-purple-500/15 transition-all duration-700" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 group-hover:bg-pink-500/15 transition-all duration-700" />
                  
                  <div className="relative p-8 md:p-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center transition-all ${
                        state.mode === 'visual'
                          ? 'bg-purple-500/25 text-purple-300 shadow-lg shadow-purple-500/20'
                          : 'bg-purple-500/15 text-purple-400 group-hover:bg-purple-500/25 group-hover:text-purple-300 group-hover:shadow-lg group-hover:shadow-purple-500/20'
                      }`}>
                        <Palette className="w-8 h-8" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={`text-xl md:text-2xl font-bold transition-colors ${
                            state.mode === 'visual' ? 'text-purple-300' : 'text-text-primary group-hover:text-purple-300'
                          }`}>
                            Visual Generator
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-purple-500/15 text-purple-400 border border-purple-500/25">
                            🍌 Powered by Nano Banana Pro
                          </span>
                        </div>
                        <p className="text-sm md:text-base text-text-secondary leading-relaxed max-w-xl">
                          Generate stunning architecture diagrams, user flows, infographics, and social graphics for your NEAR project — all Nano Banana Pro powered, production-ready.
                        </p>
                      </div>

                      {/* CTA arrow */}
                      <div className={`hidden md:flex items-center justify-center w-12 h-12 rounded-full transition-all ${
                        state.mode === 'visual'
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-white/[0.05] text-text-muted group-hover:bg-purple-500/20 group-hover:text-purple-400'
                      }`}>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Visual type pills */}
                    <div className="flex flex-wrap gap-2 mt-6">
                      {['🏗️ Architecture', '🔀 User Flows', '📊 Infographics', '📣 Social Graphics'].map((label) => (
                        <span key={label} className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/[0.05] text-text-muted border border-white/[0.08] group-hover:border-purple-500/20 group-hover:text-purple-400/70 transition-all">
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              </div>
            </Container>
          </div>

          {/* Void Brief — Discovery CTA + Brief Generator */}
          <div className="pb-12">
            <Container size="xl">
              {/* Big CTA heading for the undecided */}
              <div className="text-center mb-8 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-near-green/10 border border-near-green/20 mb-5">
                  <Sparkles className="w-4 h-4 text-near-green" />
                  <span className="text-near-green text-sm font-mono font-medium">NOT SURE WHAT TO BUILD?</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
                  Let the <GradientText>Void</GradientText> decide your mission
                </h2>
                <p className="text-text-secondary text-base md:text-lg leading-relaxed">
                  Get an AI-generated project brief with market analysis, technical specs, and a week-one action plan. 
                  Roll the dice or describe your vision — we&apos;ll map the entire journey.
                </p>
              </div>

              <VoidBriefCard
                isConnected={isConnected}
                openModal={openModal}
                onStartBuild={(brief) => {
                  const prompt = briefToSanctumPrompt(brief);
                  dispatch({ type: 'SET_CUSTOM_PROMPT', payload: prompt });
                  dispatch({ type: 'SET_SELECTED_CATEGORY', payload: 'custom' });
                  dispatch({ type: 'SET_SESSION_STARTED', payload: true });
                }}
              />
            </Container>
          </div>

          {/* Builder Showcase */}
          <div className="pb-8">
            <Container size="xl">
              <BuilderShowcase />
            </Container>
          </div>

          {/* The Sanctum Council */}
          <div className="pb-16">
            <Container size="xl">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-6">
                  <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-purple-400/60">
                    The Sanctum Council
                  </p>
                  <p className="text-sm text-text-muted mt-1">Guided by 8 AI Experts</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2.5">
                  {PERSONA_LIST.map((persona, i) => (
                    <div
                      key={persona.id}
                      className="group relative inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:border-white/[0.15] transition-all duration-300 hover:bg-white/[0.06] cursor-default"
                      style={{
                        animationDelay: `${i * 80}ms`,
                        animation: 'sanctumFadeInUp 0.5s ease-out backwards',
                      }}
                    >
                      <div
                        className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${persona.bgColor} blur-xl -z-10`}
                      />
                      <span className="text-base">{persona.emoji}</span>
                      <span className={`text-sm font-medium ${persona.color}`}>{persona.name}</span>
                      <span className="text-[11px] text-text-muted hidden sm:inline">· {persona.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Container>
          </div>

          {/* Animations */}
          <style jsx>{`
            @keyframes sanctumFadeInUp {
              from {
                opacity: 0;
                transform: translateY(12px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes sanctumSlideUp {
              from {
                opacity: 0;
                transform: translateY(16px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>

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
              <p className="text-center text-[11px] text-text-muted/50 mt-4">
                By using Sanctum, you agree to our{' '}
                <a href="/legal/terms" className="text-near-green/50 hover:text-near-green/80 underline underline-offset-2 transition-colors">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="/legal/acceptable-use" className="text-near-green/50 hover:text-near-green/80 underline underline-offset-2 transition-colors">
                  Acceptable Use Policy
                </a>.
              </p>
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
                      chatMode={state.chatMode}
                      onChatModeChange={(m) => dispatch({ type: 'SET_CHAT_MODE', payload: m })}
                      onQuizAnswer={(correct) => dispatch({ type: 'UPDATE_QUIZ_SCORE', payload: { correct } })}
                      onConceptLearned={(c) => dispatch({ type: 'ADD_CONCEPT_LEARNED', payload: c })}
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
                        <DownloadButton code={state.generatedCode} contractName={state.selectedCategory || 'contract'} category={state.selectedCategory || undefined} />
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
                        <ProjectManager
                          code={state.generatedCode}
                          category={state.selectedCategory}
                          mode={state.mode}
                          onLoadProject={(project) => {
                            dispatch({ type: 'SET_GENERATED_CODE', payload: project.code });
                            dispatch({ type: 'SET_SELECTED_CATEGORY', payload: project.category || 'custom' });
                            dispatch({ type: 'SET_SANCTUM_STAGE', payload: 'complete' });
                          }}
                        />
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

                  {/* Deploy Instructions Panel */}
                  {state.generatedCode && (
                    <div className="px-4 pt-3 border-b border-white/[0.08]">
                      <DeployInstructions
                        contractName={state.selectedCategory || 'my-contract'}
                        category={state.selectedCategory || undefined}
                        code={state.generatedCode}
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
                        chatMode={state.chatMode}
                        onChatModeChange={(m) => dispatch({ type: 'SET_CHAT_MODE', payload: m })}
                        onQuizAnswer={(correct) => dispatch({ type: 'UPDATE_QUIZ_SCORE', payload: { correct } })}
                        onConceptLearned={(c) => dispatch({ type: 'ADD_CONCEPT_LEARNED', payload: c })}
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
                            <DownloadButton code={state.generatedCode} contractName={state.selectedCategory || 'contract'} category={state.selectedCategory || undefined} />
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
