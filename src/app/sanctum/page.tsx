'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Container } from '@/components/ui';
import { GradientText } from '@/components/effects/GradientText';
import { ParticleBackground } from './components/ParticleBackground';
// CategoryPicker moved to SanctumWizard
import { SanctumChat } from './components/SanctumChat';
import { TypewriterCode } from './components/TypewriterCode';
import { TokenCounter } from './components/TokenCounter';
import { SanctumVisualization } from './components/SanctumVisualization';
import { GlassPanel } from './components/GlassPanel';
import { AchievementPopup } from './components/AchievementPopup';
import { DeployCelebration } from './components/DeployCelebration';
import { TaskProgressInline } from './components/TaskProgressInline';
import { ShareContract } from './components/ShareContract';
// SocialProof moved to SanctumLanding
import { ContractDNA } from './components/ContractDNA';
import { GasEstimatorCompact } from './components/GasEstimator';
import { ContractComparison } from './components/ContractComparison';
import { SimulationSandbox } from './components/SimulationSandbox';
import { PairProgramming } from './components/PairProgramming';
import { FileStructure } from './components/FileStructure';
import { DeployInstructions } from './components/DeployInstructions';
import { ContractToolbar } from './components/ContractToolbar';
import { WebappBuilder } from './components/WebappBuilder';
import { ImportContract } from './components/ImportContract';
import { WebappSession } from './components/WebappSession';
import { ScratchWebappSession } from './components/ScratchWebappSession';
import { ScratchTemplates, SCRATCH_TEMPLATES } from './components/ScratchTemplates';
import { useSanctumState, clearPersistedSession } from './hooks/useSanctumState';
import { useWallet } from '@/hooks/useWallet';
import { consumeStoredBrief, briefToSanctumPrompt } from '@/lib/brief-to-sanctum';
// @ts-ignore
import { Sparkles, Zap, Code2, Rocket, ChevronLeft, Flame, Hammer, Share2, GitCompare, Play, Users, Globe, Palette, Wallet, Shield, Star, ArrowRight, Wand2, RefreshCw } from 'lucide-react';
import { RoastMode } from './components/RoastMode';
import { VisualMode } from './components/VisualMode';
import { DownloadButton } from './components/DownloadContract';
import { SanctumLanding } from './components/SanctumLanding';
import { SanctumWizard, WizardConfig } from './components/SanctumWizard';

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

  // Counter to signal chat component to reset
  const [sessionResetCounter, setSessionResetCounter] = useState(0);
  const [showWizard, setShowWizard] = useState(false);

  const handleNewSession = useCallback(() => {
    clearPersistedSession();
    dispatch({ type: 'RESET_SESSION' });
    setSessionResetCounter(c => c + 1);
  }, [dispatch]);

  // Check for saved session
  const hasSavedSession = (() => {
    if (typeof window === 'undefined') return false;
    try {
      const raw = localStorage.getItem('sanctum-session-state');
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return parsed.sessionStarted === true || (parsed.messageCount && parsed.messageCount > 0);
    } catch { return false; }
  })();

  const savedSessionInfo = (() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem('sanctum-session-state');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return {
        mode: parsed.mode,
        selectedCategory: parsed.selectedCategory,
        messageCount: parsed.messageCount,
        tokensUsed: parsed.tokensUsed,
      };
    } catch { return null; }
  })();

  const handleResumeSession = useCallback(() => {
    dispatch({ type: 'SET_SESSION_STARTED', payload: true });
  }, [dispatch]);

  const handleWizardComplete = useCallback((config: WizardConfig) => {
    dispatch({ type: 'SET_MODE', payload: config.mode });
    if (config.category) dispatch({ type: 'SET_SELECTED_CATEGORY', payload: config.category });
    if (config.chatMode) dispatch({ type: 'SET_CHAT_MODE', payload: config.chatMode });
    if (config.customPrompt) dispatch({ type: 'SET_CUSTOM_PROMPT', payload: config.customPrompt });
    if (config.scratchDescription) dispatch({ type: 'SET_SCRATCH_DESCRIPTION', payload: config.scratchDescription });
    if (config.scratchTemplate) dispatch({ type: 'SET_SCRATCH_TEMPLATE', payload: config.scratchTemplate });

    if (config.mode === 'scratch') {
      dispatch({ type: 'SET_SHOW_SCRATCH_SESSION', payload: true });
    } else if (config.mode === 'roast') {
      dispatch({ type: 'SET_SESSION_STARTED', payload: true });
    } else if (config.mode === 'visual') {
      dispatch({ type: 'SET_MODE', payload: 'visual' });
      // Visual mode doesn't start a session; it renders inline on the landing page
      // But since we replaced the landing, we need to handle this differently
      // For now, start session so the visual mode section renders
      dispatch({ type: 'SET_SESSION_STARTED', payload: true });
    } else if (config.mode === 'webapp') {
      dispatch({ type: 'SET_MODE', payload: 'webapp' });
      dispatch({ type: 'SET_SHOW_IMPORT_CONTRACT', payload: true });
      // Don't start session - webapp has its own import flow
    } else {
      handleCategorySelect(config.category || 'custom');
    }
    setShowWizard(false);
  }, [dispatch, handleCategorySelect]);

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

      {/* Landing — Hero */}
      {!state.sessionStarted && !showWalletGate && !showWizard && (
        <SanctumLanding
          onEnterSanctum={() => setShowWizard(true)}
          hasSavedSession={hasSavedSession}
          savedSessionInfo={savedSessionInfo}
          onResumeSession={handleResumeSession}
          onNewSession={() => {
            handleNewSession();
            setShowWizard(true);
          }}
        />
      )}

      {/* Wizard */}
      {showWizard && !state.sessionStarted && (
        <SanctumWizard
          onComplete={handleWizardComplete}
          onBack={() => setShowWizard(false)}
          dispatch={dispatch}
          state={state}
        />
      )}

      {/* Visual Mode (standalone, not inside a session) */}
      {state.sessionStarted && state.mode === 'visual' && (
        <section className="relative z-10 min-h-screen flex flex-col pt-16">
          <Container size="xl">
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={() => {
                  dispatch({ type: 'SET_SESSION_STARTED', payload: false });
                  setShowWizard(false);
                }}
                className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
              >
                ← Back
              </button>
              <h2 className="text-2xl font-bold text-text-primary">Visual Generator</h2>
            </div>
            <VisualMode />
          </Container>
        </section>
      )}

      {/* Webapp Import Flow (standalone, before session) */}
      {!state.sessionStarted && state.mode === 'webapp' && state.showImportContract && (
        <section className="relative z-10 min-h-screen flex flex-col pt-16">
          <Container size="xl">
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={() => {
                  dispatch({ type: 'SET_SHOW_IMPORT_CONTRACT', payload: false });
                  dispatch({ type: 'SET_MODE', payload: 'build' });
                  setShowWizard(true);
                }}
                className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
              >
                ← Back
              </button>
              <h2 className="text-2xl font-bold text-text-primary">Import Contract</h2>
            </div>
            <div className="max-w-2xl mx-auto">
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
                onCancel={() => {
                  dispatch({ type: 'SET_SHOW_IMPORT_CONTRACT', payload: false });
                  dispatch({ type: 'SET_MODE', payload: 'build' });
                  setShowWizard(true);
                }}
              />
            </div>
          </Container>
        </section>
      )}

      {/* REMOVED: Old landing section replaced by SanctumLanding + SanctumWizard above */}


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
                <button
                  onClick={handleNewSession}
                  className="ml-2 flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-muted hover:text-near-green rounded-lg hover:bg-white/[0.05] transition-all"
                  title="Start a new session"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">New Session</span>
                </button>
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
                      sessionReset={sessionResetCounter}
                    />
                  </div>
                </GlassPanel>
              </div>

              {/* Right Panel - Code Preview */}
              <div className="w-1/2 flex flex-col h-full">
                <GlassPanel className="flex-1 flex flex-col" glow glowColor="green">
                  {/* Header with inline task progress */}
                  <div className="flex-shrink-0 p-4 border-b border-white/[0.08] bg-void-black/50 relative z-10">
                    {/* Top row: Title + Buttons */}
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                        <span className="text-xl">⚡</span>
                        <span className="text-near-green">Contract</span> Preview
                      </h2>
                      <ContractToolbar
                        generatedCode={state.generatedCode}
                        selectedCategory={state.selectedCategory}
                        sanctumStage={state.sanctumStage}
                        mode={state.mode}
                        showFileStructure={state.showFileStructure}
                        isThinking={state.isThinking}
                        dispatch={dispatch}
                        handleDeploy={handleDeploy}
                        handleShare={handleShare}
                        onLoadProject={(project) => {
                          dispatch({ type: 'SET_GENERATED_CODE', payload: project.code });
                          dispatch({ type: 'SET_SELECTED_CATEGORY', payload: project.category || 'custom' });
                          dispatch({ type: 'SET_SANCTUM_STAGE', payload: 'complete' });
                        }}
                      />
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
                        sessionReset={sessionResetCounter}
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
