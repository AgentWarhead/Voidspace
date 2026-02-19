'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Container } from '@/components/ui';
import { ParticleBackground } from './components/ParticleBackground';
// CategoryPicker moved to SanctumWizard
import { SanctumChat } from './components/SanctumChat';
import Image from 'next/image';
import { ModeSelector } from './components/ModeSelector';
import { TypewriterCode } from './components/TypewriterCode';
// TokenCounter removed
import { SanctumVisualization } from './components/SanctumVisualization';
import { GlassPanel } from './components/GlassPanel';
// AchievementPopup removed — global AchievementToastLayer (in Providers) handles all popups
import { DeployCelebration } from './components/DeployCelebration';
import { TaskProgressInline } from './components/TaskProgressInline';
import { ShareContract } from './components/ShareContract';
// SocialProof moved to SanctumLanding
import { GasEstimatorCompact } from './components/GasEstimator';
import { ContractComparison } from './components/ContractComparison';
import { SimulationSandbox } from './components/SimulationSandbox';
import { PairProgramming } from './components/PairProgramming';
import { FileStructure } from './components/FileStructure';
import { ContractToolbar } from './components/ContractToolbar';
import { WebappBuilder } from './components/WebappBuilder';
import { ImportContract } from './components/ImportContract';
import { WebappSession } from './components/WebappSession';
import { ScratchWebappSession } from './components/ScratchWebappSession';
// LearnSession removed — original build chat handles all modes via Learn/Build/Expert toggle
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
// BuilderProgress kept for /profile and /learn pages; XPHeaderBar used in Sanctum header
import { XPHeaderBar } from './components/XPHeaderBar';

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
    checkMessageForAchievements,
    handleConceptLearned,
    handleQuizAnswer,
  } = useSanctumState();

  // Counter to signal chat component to reset
  const [sessionResetCounter, setSessionResetCounter] = useState(0);
  const [showWizard, setShowWizard] = useState(false);

  // External message injection from code panel → chat
  const [externalMessage, setExternalMessage] = useState('');
  const [externalMessageSeq, setExternalMessageSeq] = useState(0);
  const [externalMessageNoCode, setExternalMessageNoCode] = useState(false);
  const [loadedProjectMessages, setLoadedProjectMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [loadedProjectSeq, setLoadedProjectSeq] = useState(0);

  // Track code selection from TypewriterCode
  const [codeSelection, setCodeSelection] = useState<string | null>(null);

  const sendToChat = useCallback((message: string, options?: { noCodeExtraction?: boolean }) => {
    setExternalMessage(message);
    setExternalMessageNoCode(!!options?.noCodeExtraction);
    setExternalMessageSeq(prev => prev + 1);
    // On mobile, switch to chat panel to show the response
    if (state.activePanel === 'code') {
      dispatch({ type: 'SET_ACTIVE_PANEL', payload: 'chat' });
    }
  }, [state.activePanel, dispatch]);

  // Build a prompt for the bottom action bar.
  // KEY DESIGN: Never embed the full contract in the message — the AI already has it in context
  // from the conversation history. Embedding it causes truncation on large contracts and clutters
  // the chat. Only include code when the user has a specific selection highlighted.
  const buildActionPrompt = useCallback((action: string) => {
    const hasSelection = codeSelection && codeSelection.length >= 3;

    const prompts: Record<string, string> = hasSelection ? {
      // Selection mode — include the highlighted snippet (small, targeted)
      explain:  `Explain this selected code in detail — what does it do, why is it written this way, and what NEAR concepts does it use?\n\n\`\`\`rust\n${codeSelection}\n\`\`\``,
      tests:    `Simulate running tests on this selected code. Analyze the logic and give me a test execution report:\n- List each test scenario (happy path + edge cases + failure cases)\n- For each: show ✅ PASS, ⚠️ WARN, or ❌ FAIL with a one-line reason\n- Flag any bugs you find that would cause real test failures\n- At the end, give the test suite a score (e.g. 8/10) and the top 2 things to fix\n\nCode to test:\n\`\`\`rust\n${codeSelection}\n\`\`\``,
      optimize: `How can I optimize this selected code for gas efficiency on NEAR? Suggest specific improvements.\n\n\`\`\`rust\n${codeSelection}\n\`\`\``,
      security: `Audit this selected code for security vulnerabilities — check for reentrancy, access control, overflow, and NEAR-specific issues.\n\n\`\`\`rust\n${codeSelection}\n\`\`\``,
    } : {
      // Full-contract mode — reference the preview, no code paste.
      // The AI has the full contract in context from generation — no truncation, no clutter, scales to any size.
      explain:  `Explain the full contract in the preview panel — walk through its structure, what each section does, and the NEAR concepts it demonstrates.`,
      tests:    `Simulate running the test suite for the full contract in the preview panel. Analyze each public method and give me a test execution report:\n- List each test scenario (happy path + edge cases + failure cases) for every public method\n- For each scenario: show ✅ PASS, ⚠️ WARN, or ❌ FAIL with a one-line reason\n- Flag any bugs you find that would cause real test failures\n- At the end: overall score (X/10), top 3 issues to fix before deploying`,
      optimize: `Analyze the full contract in the preview panel for gas efficiency — identify the most impactful optimizations and show the improved code.`,
      security: `Perform a complete security audit of the full contract in the preview panel — check for reentrancy, access control issues, integer overflow, storage vulnerabilities, and any NEAR-specific attack vectors. Give me a prioritized findings list.`,
    };

    // ALL analysis actions stay in chat — never overwrite the code preview.
    // tests = simulation report in chat, not code generation.
    const analysisActions = ['explain', 'optimize', 'security', 'tests'];
    sendToChat(prompts[action] || prompts.explain, {
      noCodeExtraction: analysisActions.includes(action),
    });
  }, [codeSelection, state.generatedCode, sendToChat]);

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
      return parsed.sessionStarted === true || (parsed.messageCount != null && parsed.messageCount > 0);
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
        briefing: parsed.projectBriefing || null,
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

  // Derive the auto-message for SanctumChat (template walkthrough OR custom prompt from wizard)
  const autoMessage = templateHandledRef.current && templateConfig
    ? templateConfig.message
    : state.customPrompt || undefined;

  // Show wallet gate for template arrivals without wallet connected
  const showWalletGate = templateConfig && !isConnected && !walletLoading && !state.sessionStarted;

  return (
    <div className={`min-h-screen bg-void-black relative ${state.sessionStarted && state.mode === 'visual' ? '' : 'overflow-hidden'}`}>
      {/* Animated particle background */}
      <ParticleBackground />

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
                className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-4 rounded-xl bg-near-green text-void-black font-semibold text-base sm:text-lg hover:bg-near-green/90 transition-all shadow-lg shadow-near-green/25 mb-6 w-full justify-center min-h-[48px]"
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
      {!state.sessionStarted && !showWalletGate && !showWizard && !state.showImportContract && (
        <SanctumLanding
          onEnterSanctum={() => {
            setShowWizard(true);
          }}
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
          isConnected={isConnected}
          openModal={openModal}
          hasSavedSession={hasSavedSession}
          savedSessionInfo={savedSessionInfo}
          onResumeSession={handleResumeSession}
        />
      )}

      {/* Visual Mode (standalone, not inside a session) */}
      {state.sessionStarted && state.mode === 'visual' && (
        <section className="relative z-10 min-h-screen flex flex-col pt-16 pb-24">
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
        <div className="relative z-40 flex flex-col bg-void-black h-dvh overflow-hidden overscroll-none touch-manipulation">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-void-black to-orange-900/10" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10 flex flex-col flex-1 min-h-0 p-3 overflow-hidden">
            <div className="w-full max-w-4xl mx-auto flex-1 min-h-0 flex flex-col">
              <GlassPanel className="flex-1 min-h-0 flex flex-col overflow-hidden" glow glowColor="red">
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

      {/* Build Session - full screen immersive mode (green identity) */}
      {state.sessionStarted && state.mode === 'build' && (
        <div className="relative z-40 flex flex-col bg-void-black h-dvh overflow-hidden overscroll-none touch-manipulation">
          {/* Session background - contained, no bleeding */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-void-black to-near-green/10" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-near-green/10 rounded-full blur-3xl" />
          </div>

          {/* Premium consolidated header */}
          <div className="relative z-10 flex-shrink-0 bg-void-black/60 backdrop-blur-xl border-b border-white/[0.06]">
            {/* Subtle gradient accent line at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
            
            {/* Desktop header */}
            <div className="hidden md:flex items-center justify-between px-4 py-3 gap-4">
              {/* Left: Back + Sanctum Logo */}
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={handleBack}
                  className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors group flex-shrink-0"
                >
                  <ChevronLeft className="w-5 h-5 text-text-muted group-hover:text-near-green transition-colors" />
                </button>
                <a href="/sanctum" className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0">
                  <Image src="/voidspace-logo-sm.png" alt="Voidspace" width={28} height={28} className="rounded-md" />
                  <span className="text-sm font-semibold text-text-primary tracking-wide">Sanctum</span>
                </a>
              </div>

              {/* Center: Mode Selector */}
              <div className="flex-shrink-0">
                <ModeSelector
                  mode={state.chatMode}
                  onModeChange={(m) => dispatch({ type: 'SET_CHAT_MODE', payload: m })}
                  disabled={false}
                />
              </div>

              {/* Right: XP Bar + New Session */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <XPHeaderBar
                  messagesCount={state.messageCount}
                  codeGenerations={state.contractsBuilt}
                  deploysCount={state.deployCount}
                  tokensUsed={state.tokensUsed}
                  conceptsLearned={state.conceptsLearned.length}
                  quizScore={state.quizScore}
                  sessionStartTime={state.sessionStartTime}
                />
                <button
                  onClick={handleNewSession}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-text-muted hover:text-near-green rounded-lg hover:bg-white/[0.06] border border-white/[0.06] hover:border-near-green/20 transition-all"
                  title="Start a new session"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>New Session</span>
                </button>
              </div>
            </div>

            {/* Mobile header */}
            <div className="md:hidden px-3 py-2.5 space-y-2">
              {/* Top row: Back + Persona + New Session */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <button
                    onClick={handleBack}
                    className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors group flex-shrink-0"
                  >
                    <ChevronLeft className="w-5 h-5 text-text-muted group-hover:text-near-green transition-colors" />
                  </button>
                  <a href="/sanctum" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                    <Image src="/voidspace-logo-sm.png" alt="Voidspace" width={24} height={24} className="rounded-md" />
                    <span className="text-sm font-semibold text-text-primary tracking-wide">Sanctum</span>
                  </a>
                </div>
                <button
                  onClick={handleNewSession}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-text-muted hover:text-near-green rounded-lg hover:bg-white/[0.06] border border-white/[0.06] hover:border-near-green/20 transition-all flex-shrink-0"
                  title="Start a new session"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
              {/* Bottom row: Mode Selector + compact XP bar */}
              <div className="flex items-center justify-between gap-3">
                <ModeSelector
                  mode={state.chatMode}
                  onModeChange={(m) => dispatch({ type: 'SET_CHAT_MODE', payload: m })}
                  disabled={false}
                />
                <XPHeaderBar
                  messagesCount={state.messageCount}
                  codeGenerations={state.contractsBuilt}
                  deploysCount={state.deployCount}
                  tokensUsed={state.tokensUsed}
                  conceptsLearned={state.conceptsLearned.length}
                  quizScore={state.quizScore}
                  sessionStartTime={state.sessionStartTime}
                />
              </div>
            </div>
          </div>

          {/* Mobile Tab Bar */}
          <div className="md:hidden relative z-10 flex-shrink-0 sticky top-0 bg-void-black/80 backdrop-blur-sm border-b border-white/[0.08]">
            <div className="flex">
              <button
                onClick={() => dispatch({ type: 'SET_ACTIVE_PANEL', payload: 'chat' })}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 min-h-[48px] text-sm font-medium transition-all ${
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
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 min-h-[48px] text-sm font-medium transition-all ${
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
          <div className="relative z-10 flex-1 flex min-h-0 overflow-hidden">
            {/* Desktop Layout: Side-by-side */}
            <div className="hidden md:flex flex-1 min-h-0 gap-3 p-3 overflow-hidden">
              {/* Left Panel - Chat */}
              <div className="w-1/2 min-h-0 flex flex-col h-full">
                <GlassPanel className="flex-1 min-h-0 flex flex-col overflow-hidden" glow glowColor="purple">
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
                      personaId={state.personaId}
                      onPersonaChange={(id) => dispatch({ type: 'SET_PERSONA_ID', payload: id })}
                      onQuizAnswer={(correct) => handleQuizAnswer(correct)}
                      onConceptLearned={(c) => { dispatch({ type: 'ADD_CONCEPT_LEARNED', payload: c }); handleConceptLearned(); }}
                      onUserMessage={checkMessageForAchievements}
                      sessionReset={sessionResetCounter}
                      externalMessage={externalMessage}
                      externalMessageSeq={externalMessageSeq}
                      externalMessageNoCode={externalMessageNoCode}
                      loadedProjectMessages={loadedProjectMessages}
                      loadedProjectSeq={loadedProjectSeq}
                      sessionBriefing={state.projectBriefing}
                      onBriefingUpdate={(b) => dispatch({ type: 'SET_BRIEFING', payload: b })}
                    />
                  </div>
                </GlassPanel>

                {/* XP HUD moved to header bar */}
              </div>

              {/* Right Panel - Code Preview */}
              <div className="w-1/2 min-h-0 flex flex-col h-full">
                <GlassPanel className="flex-1 min-h-0 flex flex-col overflow-hidden" glow glowColor="green">
                  {/* Header with inline task progress */}
                  <div className="flex-shrink-0 p-2.5 sm:p-4 border-b border-white/[0.08] bg-void-black/50 relative z-30">
                    {/* Top row: Title + Buttons */}
                    <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-text-primary flex items-center gap-1.5 sm:gap-2 flex-shrink-0 whitespace-nowrap">
                        <span className="text-lg sm:text-xl">⚡</span>
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
                          dispatch({ type: 'SET_GENERATED_CODE', payload: project.code || '' });
                          dispatch({ type: 'SET_SELECTED_CATEGORY', payload: project.category || 'custom' });
                          if (project.code) {
                            dispatch({ type: 'SET_SANCTUM_STAGE', payload: 'complete' });
                          }
                          if (project.persona) {
                            dispatch({ type: 'SET_PERSONA_ID', payload: project.persona });
                          }
                          if (project.mode) {
                            dispatch({ type: 'SET_MODE', payload: project.mode });
                          }
                          // Restore chat messages from the project
                          if (project.messages && project.messages.length > 0) {
                            setLoadedProjectMessages(project.messages);
                            setLoadedProjectSeq(prev => prev + 1);
                          }
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
                    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                      <TypewriterCode 
                        code={state.generatedCode}
                        speed={8}
                        instant={state.sanctumStage === 'complete'}
                        onComplete={() => dispatch({ type: 'SET_SANCTUM_STAGE', payload: 'complete' })}
                        onSelectionChange={setCodeSelection}
                      />
                    </div>
                  )}

                  {/* Smart action bar + gas badge */}
                  {state.generatedCode && (
                    <div className="flex-shrink-0 border-t border-white/[0.08] bg-void-black/50">
                      <div className="px-2 sm:px-3 py-2 sm:py-2.5 flex items-center gap-2 min-w-0" data-preserve-selection>
                        {/* Quick actions — selection-aware, scrollable when tight */}
                        <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 overflow-x-auto scrollbar-none flex-1">
                          <span className="text-[10px] sm:text-xs mr-0.5 sm:mr-1 whitespace-nowrap flex-shrink-0">
                            {codeSelection ? (
                              <span className="text-near-green">✦ Selection</span>
                            ) : (
                              <span className="text-text-muted">Ask AI:</span>
                            )}
                          </span>
                          <button
                            onClick={() => buildActionPrompt('explain')}
                            className="px-2 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 border border-purple-500/20 hover:border-purple-500/30 transition-all whitespace-nowrap flex-shrink-0"
                          >
                            💡 Explain
                          </button>
                          <button
                            onClick={() => buildActionPrompt('tests')}
                            className="px-2 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 border border-cyan-500/20 hover:border-cyan-500/30 transition-all whitespace-nowrap flex-shrink-0"
                          >
                            🧪 Tests
                          </button>
                          <button
                            onClick={() => buildActionPrompt('optimize')}
                            className="px-2 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 border border-amber-500/20 hover:border-amber-500/30 transition-all whitespace-nowrap flex-shrink-0"
                          >
                            ⚡ Optimize
                          </button>
                          <button
                            onClick={() => buildActionPrompt('security')}
                            className="px-2 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/30 transition-all whitespace-nowrap flex-shrink-0"
                          >
                            🔒 Audit
                          </button>
                        </div>
                        {/* Gas badge — flex-shrink-0 to prevent truncation */}
                        <div className="flex-shrink-0">
                          <GasEstimatorCompact code={state.generatedCode} />
                        </div>
                      </div>
                    </div>
                  )}
                </GlassPanel>
              </div>
            </div>

            {/* Mobile Layout: Stacked with tabs */}
            <div className="md:hidden flex-1 min-h-0 flex flex-col overflow-hidden">
              {/* Chat Panel */}
              {state.activePanel === 'chat' && (
                <div className="flex-1 min-h-0 p-3 flex flex-col overflow-hidden">
                  <GlassPanel className="flex-1 min-h-0 flex flex-col overflow-hidden" glow glowColor="purple">
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
                        personaId={state.personaId}
                        onPersonaChange={(id) => dispatch({ type: 'SET_PERSONA_ID', payload: id })}
                        onQuizAnswer={(correct) => handleQuizAnswer(correct)}
                        onConceptLearned={(c) => { dispatch({ type: 'ADD_CONCEPT_LEARNED', payload: c }); handleConceptLearned(); }}
                        onUserMessage={checkMessageForAchievements}
                        sessionReset={sessionResetCounter}
                        externalMessage={externalMessage}
                        externalMessageSeq={externalMessageSeq}
                        externalMessageNoCode={externalMessageNoCode}
                        loadedProjectMessages={loadedProjectMessages}
                        loadedProjectSeq={loadedProjectSeq}
                        sessionBriefing={state.projectBriefing}
                        onBriefingUpdate={(b) => dispatch({ type: 'SET_BRIEFING', payload: b })}
                      />
                    </div>
                  </GlassPanel>

                  {/* Mobile XP HUD moved to header bar */}
                </div>
              )}

              {/* Code Panel */}
              {state.activePanel === 'code' && (
                <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                  <div className="flex-1 min-h-0 p-3 flex flex-col overflow-hidden">
                    <GlassPanel className="flex-1 min-h-0 flex flex-col overflow-hidden" glow glowColor="green">
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
                        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                          <TypewriterCode 
                            code={state.generatedCode}
                            speed={8}
                            instant={state.sanctumStage === 'complete'}
                            onComplete={() => dispatch({ type: 'SET_SANCTUM_STAGE', payload: 'complete' })}
                            onSelectionChange={setCodeSelection}
                          />
                        </div>
                      )}

                      {/* Smart action bar — mobile */}
                      {state.generatedCode && (
                        <div className="flex-shrink-0 border-t border-white/[0.08] bg-void-black/50">
                          <div className="px-3 py-2 flex items-center gap-1.5 overflow-x-auto" data-preserve-selection>
                            <span className="text-xs whitespace-nowrap flex-shrink-0">
                              {codeSelection ? (
                                <span className="text-near-green">✦</span>
                              ) : (
                                <span className="text-text-muted">AI:</span>
                              )}
                            </span>
                            <button
                              onClick={() => buildActionPrompt('explain')}
                              className="px-2 py-1.5 text-xs rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 transition-all whitespace-nowrap flex-shrink-0"
                            >
                              💡 Explain
                            </button>
                            <button
                              onClick={() => buildActionPrompt('tests')}
                              className="px-2 py-1.5 text-xs rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 transition-all whitespace-nowrap flex-shrink-0"
                            >
                              🧪 Tests
                            </button>
                            <button
                              onClick={() => buildActionPrompt('optimize')}
                              className="px-2 py-1.5 text-xs rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 transition-all whitespace-nowrap flex-shrink-0"
                            >
                              ⚡ Gas
                            </button>
                            <button
                              onClick={() => buildActionPrompt('security')}
                              className="px-2 py-1.5 text-xs rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 transition-all whitespace-nowrap flex-shrink-0"
                            >
                              🔒 Audit
                            </button>
                            <div className="ml-auto flex-shrink-0">
                              <GasEstimatorCompact code={state.generatedCode} />
                            </div>
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
          <div className="md:hidden relative z-10 flex-shrink-0 border-t border-white/[0.08] bg-void-black/80 backdrop-blur-sm safe-area-bottom">
            <div className="flex items-center gap-2 p-2 sm:p-3 overflow-x-auto">
              <button 
                className="flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg border border-purple-500/30 transition-all disabled:opacity-50 whitespace-nowrap"
                onClick={handleShare}
                disabled={!state.generatedCode}
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button 
                className="flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg border border-blue-500/30 transition-all disabled:opacity-50 whitespace-nowrap"
                onClick={() => dispatch({ type: 'SET_SHOW_COMPARISON', payload: true })}
                disabled={!state.generatedCode}
              >
                <GitCompare className="w-4 h-4" />
                Compare
              </button>
              <button 
                className="flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg border border-green-500/30 transition-all disabled:opacity-50 whitespace-nowrap"
                onClick={() => dispatch({ type: 'SET_SHOW_SIMULATION', payload: true })}
                disabled={!state.generatedCode}
              >
                <Play className="w-4 h-4" />
                Test
              </button>
              <button 
                className="flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] text-xs bg-near-green/20 hover:bg-near-green/30 text-near-green rounded-lg border border-near-green/30 transition-all disabled:opacity-50 whitespace-nowrap font-medium"
                onClick={handleDeploy}
                disabled={!state.generatedCode || state.sanctumStage === 'thinking'}
              >
                <Rocket className="w-4 h-4" />
                Deploy
              </button>
              <button 
                className="flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] text-xs bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg border border-cyan-500/30 transition-all disabled:opacity-50 whitespace-nowrap"
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
