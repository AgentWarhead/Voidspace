import { useReducer, useCallback, useEffect, useRef } from 'react';
import { CurrentTask } from '../components/TaskProgressInline';
import { useAchievementContext } from '@/contexts/AchievementContext';
import { DeployedContract, saveDeployment } from '../components/DeploymentHistory';
import { ImportedContract } from '../components/ImportContract';
import { generateSessionId } from '../components/PairProgramming';

import { ChatMode } from '../components/ModeSelector';
import { LearnedConcept } from '../components/KnowledgeTracker';

// --- localStorage persistence helpers ---
const STORAGE_KEY = 'sanctum-session-state';

const PERSISTED_FIELDS = [
  'mode', 'selectedCategory', 'customPrompt', 'sessionStarted',
  'generatedCode', 'tokensUsed', 'tokenBalance', 'sanctumStage',
  'messageCount', 'conceptsLearned', 'quizScore',
  // chatMode intentionally excluded — always starts fresh as 'learn'
  'contractsBuilt', 'scratchDescription', 'scratchGeneratedCode',
  'scratchTemplate', 'showScratchSession',
  'personaId',
  'projectBriefing',
] as const;

interface PersistedState {
  [key: string]: unknown;
  unlockedAchievements?: string[];
}

function loadPersistedState(): Partial<SanctumState> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: PersistedState = JSON.parse(raw);
    return parsed as Partial<SanctumState>;
  } catch {
    return null;
  }
}

function savePersistedState(state: SanctumState): void {
  if (typeof window === 'undefined') return;
  try {
    const subset: Record<string, unknown> = {};
    for (const key of PERSISTED_FIELDS) {
      subset[key] = state[key];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subset));
  } catch {
    // quota exceeded or private mode — silently ignore
  }
}

export function clearPersistedSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('sanctum-chat-messages');
    localStorage.removeItem('sanctum-chat-persona');
  } catch {
    // ignore
  }
}

type SanctumStage = 'idle' | 'thinking' | 'generating' | 'complete';
type SanctumMode = 'build' | 'roast' | 'webapp' | 'visual' | 'scratch';

export interface SanctumState {
  mode: SanctumMode;
  selectedCategory: string | null;
  customPrompt: string;
  sessionStarted: boolean;
  generatedCode: string;
  tokensUsed: number;
  tokenBalance: number;
  sanctumStage: SanctumStage;
  isGenerating: boolean;
  messageCount: number;
  deployCount: number;
  showDeployCelebration: boolean;
  deployedContractId: string | null;
  sessionStartTime: number | null;
  currentTask: CurrentTask | null;
  isThinking: boolean;
  showShareModal: boolean;
  showHistory: boolean;
  contractToShare: { code: string; name: string; category?: string } | null;
  showComparison: boolean;
  showSimulation: boolean;
  showPairProgramming: boolean;
  pairSessionId: string;
  showFileStructure: boolean;
  showWebappBuilder: boolean;
  showImportContract: boolean;
  importedContract: ImportedContract | null;
  showWebappSession: boolean;
  activePanel: 'chat' | 'code';
  deployError: string | null;
  chatMode: ChatMode;
  conceptsLearned: LearnedConcept[];
  quizScore: { correct: number; total: number };
  contractsBuilt: number;
  showScratchSession: boolean;
  scratchDescription: string;
  scratchGeneratedCode: string;
  scratchTemplate: string | null;
  personaId: string;
  projectBriefing: string | null;
}

type SanctumAction =
  | { type: 'SET_MODE'; payload: SanctumMode }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string | null }
  | { type: 'SET_CUSTOM_PROMPT'; payload: string }
  | { type: 'SET_SESSION_STARTED'; payload: boolean }
  | { type: 'SET_GENERATED_CODE'; payload: string }
  | { type: 'SET_TOKENS_USED'; payload: number }
  | { type: 'ADD_TOKENS_USED'; payload: number }
  | { type: 'SET_TOKEN_BALANCE'; payload: number }
  | { type: 'SUBTRACT_TOKEN_BALANCE'; payload: number }
  | { type: 'SET_SANCTUM_STAGE'; payload: SanctumStage }
  | { type: 'SET_IS_GENERATING'; payload: boolean }
  | { type: 'SET_MESSAGE_COUNT'; payload: number }
  | { type: 'INCREMENT_MESSAGE_COUNT' }
  | { type: 'SET_DEPLOY_COUNT'; payload: number }
  | { type: 'INCREMENT_DEPLOY_COUNT' }
  | { type: 'SET_SHOW_DEPLOY_CELEBRATION'; payload: boolean }
  | { type: 'SET_DEPLOYED_CONTRACT_ID'; payload: string | null }
  | { type: 'SET_SESSION_START_TIME'; payload: number | null }
  | { type: 'SET_CURRENT_TASK'; payload: CurrentTask | null }
  | { type: 'SET_IS_THINKING'; payload: boolean }
  | { type: 'SET_SHOW_SHARE_MODAL'; payload: boolean }
  | { type: 'SET_SHOW_HISTORY'; payload: boolean }
  | { type: 'SET_CONTRACT_TO_SHARE'; payload: { code: string; name: string; category?: string } | null }
  | { type: 'SET_SHOW_COMPARISON'; payload: boolean }
  | { type: 'SET_SHOW_SIMULATION'; payload: boolean }
  | { type: 'SET_SHOW_PAIR_PROGRAMMING'; payload: boolean }
  | { type: 'SET_SHOW_FILE_STRUCTURE'; payload: boolean }
  | { type: 'SET_SHOW_WEBAPP_BUILDER'; payload: boolean }
  | { type: 'SET_SHOW_IMPORT_CONTRACT'; payload: boolean }
  | { type: 'SET_IMPORTED_CONTRACT'; payload: ImportedContract | null }
  | { type: 'SET_SHOW_WEBAPP_SESSION'; payload: boolean }
  | { type: 'SET_ACTIVE_PANEL'; payload: 'chat' | 'code' }
  | { type: 'SET_DEPLOY_ERROR'; payload: string | null }
  | { type: 'SET_CHAT_MODE'; payload: ChatMode }
  | { type: 'ADD_CONCEPT_LEARNED'; payload: LearnedConcept }
  | { type: 'UPDATE_QUIZ_SCORE'; payload: { correct: boolean } }
  | { type: 'INCREMENT_CONTRACTS_BUILT' }
  | { type: 'SET_SHOW_SCRATCH_SESSION'; payload: boolean }
  | { type: 'SET_SCRATCH_DESCRIPTION'; payload: string }
  | { type: 'SET_SCRATCH_GENERATED_CODE'; payload: string }
  | { type: 'SET_SCRATCH_TEMPLATE'; payload: string | null }
  | { type: 'SET_PERSONA_ID'; payload: string }
  | { type: 'SET_BRIEFING'; payload: string | null }
  | { type: 'RESET_SESSION' }
  | { type: 'START_CODE_GENERATION'; payload: string }
  | { type: 'COMPLETE_CODE_GENERATION' };

const defaultState: SanctumState = {
  mode: 'build',
  selectedCategory: null,
  customPrompt: '',
  sessionStarted: false,
  generatedCode: '',
  tokensUsed: 0,
  tokenBalance: 50000,
  sanctumStage: 'idle',
  isGenerating: false,
  messageCount: 0,
  deployCount: 0,
  showDeployCelebration: false,
  deployedContractId: null,
  sessionStartTime: null,
  currentTask: null,
  isThinking: false,
  showShareModal: false,
  showHistory: false,
  contractToShare: null,
  showComparison: false,
  showSimulation: false,
  showPairProgramming: false,
  pairSessionId: generateSessionId(),
  showFileStructure: false,
  showWebappBuilder: false,
  showImportContract: false,
  importedContract: null,
  showWebappSession: false,
  activePanel: 'chat',
  deployError: null,
  chatMode: 'learn' as ChatMode,
  conceptsLearned: [],
  quizScore: { correct: 0, total: 0 },
  contractsBuilt: 0,
  showScratchSession: false,
  scratchDescription: '',
  scratchGeneratedCode: '',
  scratchTemplate: null,
  personaId: 'shade',
  projectBriefing: null,
};

function getInitialState(): SanctumState {
  const persisted = loadPersistedState();
  if (!persisted) return defaultState;
  return { ...defaultState, ...persisted };
}

function sanctumReducer(state: SanctumState, action: SanctumAction): SanctumState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    
    case 'SET_CUSTOM_PROMPT':
      return { ...state, customPrompt: action.payload };
    
    case 'SET_SESSION_STARTED':
      return { ...state, sessionStarted: action.payload };
    
    case 'SET_GENERATED_CODE':
      return { ...state, generatedCode: action.payload };
    
    case 'SET_TOKENS_USED':
      return { ...state, tokensUsed: action.payload };
    
    case 'ADD_TOKENS_USED':
      return { ...state, tokensUsed: state.tokensUsed + action.payload };
    
    case 'SET_TOKEN_BALANCE':
      return { ...state, tokenBalance: action.payload };
    
    case 'SUBTRACT_TOKEN_BALANCE':
      return { ...state, tokenBalance: state.tokenBalance - action.payload };
    
    case 'SET_SANCTUM_STAGE':
      return { ...state, sanctumStage: action.payload };
    
    case 'SET_IS_GENERATING':
      return { ...state, isGenerating: action.payload };
    
    case 'SET_MESSAGE_COUNT':
      return { ...state, messageCount: action.payload };
    
    case 'INCREMENT_MESSAGE_COUNT':
      return { ...state, messageCount: state.messageCount + 1 };
    
    case 'SET_DEPLOY_COUNT':
      return { ...state, deployCount: action.payload };
    
    case 'INCREMENT_DEPLOY_COUNT':
      return { ...state, deployCount: state.deployCount + 1 };
    
    case 'SET_SHOW_DEPLOY_CELEBRATION':
      return { ...state, showDeployCelebration: action.payload };
    
    case 'SET_DEPLOYED_CONTRACT_ID':
      return { ...state, deployedContractId: action.payload };
    
    case 'SET_SESSION_START_TIME':
      return { ...state, sessionStartTime: action.payload };
    
    case 'SET_CURRENT_TASK':
      return { ...state, currentTask: action.payload };
    
    case 'SET_IS_THINKING':
      return { ...state, isThinking: action.payload };
    
    case 'SET_SHOW_SHARE_MODAL':
      return { ...state, showShareModal: action.payload };
    
    case 'SET_SHOW_HISTORY':
      return { ...state, showHistory: action.payload };
    
    case 'SET_CONTRACT_TO_SHARE':
      return { ...state, contractToShare: action.payload };
    
    case 'SET_SHOW_COMPARISON':
      return { ...state, showComparison: action.payload };
    
    case 'SET_SHOW_SIMULATION':
      return { ...state, showSimulation: action.payload };
    
    case 'SET_SHOW_PAIR_PROGRAMMING':
      return { ...state, showPairProgramming: action.payload };
    
    case 'SET_SHOW_FILE_STRUCTURE':
      return { ...state, showFileStructure: action.payload };
    
    case 'SET_SHOW_WEBAPP_BUILDER':
      return { ...state, showWebappBuilder: action.payload };
    
    case 'SET_SHOW_IMPORT_CONTRACT':
      return { ...state, showImportContract: action.payload };
    
    case 'SET_IMPORTED_CONTRACT':
      return { ...state, importedContract: action.payload };
    
    case 'SET_SHOW_WEBAPP_SESSION':
      return { ...state, showWebappSession: action.payload };
    
    case 'SET_ACTIVE_PANEL':
      return { ...state, activePanel: action.payload };
    
    case 'SET_DEPLOY_ERROR':
      return { ...state, deployError: action.payload };
    
    case 'SET_CHAT_MODE':
      return { ...state, chatMode: action.payload };
    
    case 'ADD_CONCEPT_LEARNED': {
      const exists = state.conceptsLearned.some(c => c.title === action.payload.title);
      if (exists) return state;
      return { ...state, conceptsLearned: [...state.conceptsLearned, action.payload] };
    }
    
    case 'UPDATE_QUIZ_SCORE':
      return {
        ...state,
        quizScore: {
          correct: state.quizScore.correct + (action.payload.correct ? 1 : 0),
          total: state.quizScore.total + 1,
        },
      };
    
    case 'INCREMENT_CONTRACTS_BUILT':
      return { ...state, contractsBuilt: state.contractsBuilt + 1 };
    
    case 'SET_SHOW_SCRATCH_SESSION':
      return { ...state, showScratchSession: action.payload };
    
    case 'SET_SCRATCH_DESCRIPTION':
      return { ...state, scratchDescription: action.payload };
    
    case 'SET_SCRATCH_GENERATED_CODE':
      return { ...state, scratchGeneratedCode: action.payload };
    
    case 'SET_SCRATCH_TEMPLATE':
      return { ...state, scratchTemplate: action.payload };
    
    case 'SET_PERSONA_ID':
      return { ...state, personaId: action.payload };

    case 'SET_BRIEFING':
      return { ...state, projectBriefing: action.payload };
    
    case 'RESET_SESSION':
      clearPersistedSession();
      return {
        ...defaultState,
        // Keep persistent progress stats
        deployCount: state.deployCount,
      };
    
    case 'START_CODE_GENERATION':
      return {
        ...state,
        sanctumStage: 'generating',
        isGenerating: true,
        generatedCode: action.payload,
      };
    
    case 'COMPLETE_CODE_GENERATION':
      return {
        ...state,
        sanctumStage: 'complete',
        isGenerating: false,
      };
    
    default:
      return state;
  }
}

export function useSanctumState() {
  const [state, dispatch] = useReducer(sanctumReducer, undefined, getInitialState);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Save to localStorage after every state change (debounced, but flush on unmount)
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      savePersistedState(state);
    }, 500);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      // Flush save immediately on unmount — never lose state
      savePersistedState(stateRef.current);
    };
  }, [state]);

  // Also save on page unload (back button, tab close, etc.)
  useEffect(() => {
    const handleBeforeUnload = () => {
      savePersistedState(stateRef.current);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
    };
  }, []);

  // Handle body scroll lock when session is active
  useEffect(() => {
    if (state.sessionStarted) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.setAttribute('data-immersive', 'true');
      // Start session timer if not already started
      if (!state.sessionStartTime) {
        dispatch({ type: 'SET_SESSION_START_TIME', payload: Date.now() });
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
  }, [state.sessionStarted, state.sessionStartTime]);

  // ─── Global achievement context ─────────────────────────────
  const { trackStat, triggerCustom, setStat, stats } = useAchievementContext();
  // Keep stats in a ref to avoid stale closures in callbacks
  const statsRef = useRef(stats);
  statsRef.current = stats;

  // Track which personas have been used this session (for uniquePersonasUsed stat)
  const usedPersonasRef = useRef<Set<string>>(new Set(['shade']));
  // Track quiz streak independently for accurate maxQuizStreak
  const quizStreakRef = useRef(0);

  // ─── Handler functions ───────────────────────────────────────

  const handleCategorySelect = useCallback((categorySlug: string) => {
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: categorySlug });
    dispatch({ type: 'SET_CUSTOM_PROMPT', payload: '' }); // clear any persisted prompt from previous session
    dispatch({ type: 'SET_SESSION_STARTED', payload: true });

    // Category-specific achievements (fired at code-gen, not just selection)
    const CATEGORY_TRIGGERS: Record<string, string> = {
      'chain-signatures': 'built_chain_signatures',
      'ai-agents':        'built_ai_agent',
      'defi':             'built_defi',
      'nfts':             'built_nft',
      'meme':             'built_meme',
      'gaming':           'built_gaming',
      'intents':          'built_intents',
      'privacy':          'built_privacy',
    };
    const trigger = CATEGORY_TRIGGERS[categorySlug];
    if (trigger) {
      // Delay so code must actually be generated in this category
      setTimeout(() => triggerCustom(trigger), 3000);
    }
  }, [triggerCustom]);

  const handleCustomStart = useCallback(() => {
    if (state.customPrompt.trim()) {
      dispatch({ type: 'SET_SELECTED_CATEGORY', payload: 'custom' });
      dispatch({ type: 'SET_SESSION_STARTED', payload: true });
    }
  }, [state.customPrompt]);

  const handleTokensUsed = useCallback((input: number, output: number) => {
    const total = input + output;
    dispatch({ type: 'ADD_TOKENS_USED', payload: total });
    dispatch({ type: 'SUBTRACT_TOKEN_BALANCE', payload: total });
    dispatch({ type: 'INCREMENT_MESSAGE_COUNT' });

    // Track in global context — auto-unlocks hello_sanctum at threshold 1,
    // conversationalist at threshold 100, token_burner/million_token_club for tokens
    trackStat('sanctumMessages');
    trackStat('tokensUsed', total);
  }, [trackStat]);

  // Check message content for triggered achievements
  const checkMessageForAchievements = useCallback((messageText: string) => {
    const lower = messageText.toLowerCase();
    if (lower.includes('why') || lower.includes('how does this work') || lower.includes('how does that work') || lower.includes('explain')) {
      setTimeout(() => triggerCustom('asked_why'), 1000);
    }
    if (lower.includes('the plan') || lower.includes('what is the plan') || lower.includes("what's the plan")) {
      setTimeout(() => triggerCustom('asked_the_plan'), 1000);
    }
  }, [triggerCustom]);

  // Concept-based achievement — global context handles threshold evaluation
  const handleConceptLearned = useCallback(() => {
    trackStat('conceptsLearned');
  }, [trackStat]);

  // Quiz answer — track streak accurately for maxQuizStreak stat
  const handleQuizAnswer = useCallback((correct: boolean) => {
    dispatch({ type: 'UPDATE_QUIZ_SCORE', payload: { correct } });
    if (correct) {
      quizStreakRef.current++;
      const currentMax = statsRef.current.maxQuizStreak;
      if (quizStreakRef.current > currentMax) {
        setStat('maxQuizStreak', quizStreakRef.current);
      }
    } else {
      quizStreakRef.current = 0;
    }
  }, [setStat]);

  const handleCodeGenerated = useCallback((code: string) => {
    dispatch({ type: 'START_CODE_GENERATION', payload: code });
    dispatch({ type: 'INCREMENT_CONTRACTS_BUILT' });

    // Track in global context — auto-unlocks code_conjurer, contract_factory, etc.
    trackStat('codeGenerations');
    trackStat('contractsBuilt');

    // Night build achievement (midnight–5 AM)
    const hour = new Date().getHours();
    if (hour < 5) {
      trackStat('nightBuilds');
    }

    // Update longest session stat for marathon_session achievement
    if (state.sessionStartTime) {
      const minutes = Math.floor((Date.now() - state.sessionStartTime) / 60000);
      if (minutes > statsRef.current.longestSessionMinutes) {
        setStat('longestSessionMinutes', minutes);
      }
    }

    // Complete after typing animation
    setTimeout(() => {
      dispatch({ type: 'COMPLETE_CODE_GENERATION' });
    }, code.length * 10 + 500);
  }, [trackStat, setStat, state.sessionStartTime]);

  const handleTaskUpdate = useCallback((task: CurrentTask | null) => {
    dispatch({ type: 'SET_CURRENT_TASK', payload: task });
  }, []);

  const handleThinkingChange = useCallback((thinking: boolean) => {
    dispatch({ type: 'SET_IS_THINKING', payload: thinking });
  }, []);

  const handleDeploy = useCallback(async () => {
    dispatch({ type: 'SET_DEPLOY_ERROR', payload: null });
    dispatch({ type: 'SET_SANCTUM_STAGE', payload: 'thinking' });

    try {
      // Call deploy API
      const response = await fetch('/api/sanctum/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: state.generatedCode,
          category: state.selectedCategory,
        }),
      });

      const data = await response.json();

      dispatch({ type: 'INCREMENT_DEPLOY_COUNT' });

      // Track in global context — auto-unlocks genesis_deploy at threshold 1
      trackStat('contractsDeployed');

      // Speed demon — deployed within 3 minutes of session start
      if (state.sessionStartTime) {
        const elapsed = (Date.now() - state.sessionStartTime) / 1000 / 60;
        if (elapsed <= 3) {
          setTimeout(() => triggerCustom('speed_deploy'), 2000);
        }
      }

      // Mainnet pioneer
      if (data.network === 'mainnet') {
        setTimeout(() => triggerCustom('mainnet_deployed'), 2000);
      }

      dispatch({ type: 'SET_SANCTUM_STAGE', payload: 'complete' });

      // Show celebration with contract ID
      const contractId = data.contractId || `sanctum-${Date.now()}.testnet`;
      dispatch({ type: 'SET_DEPLOYED_CONTRACT_ID', payload: contractId });
      dispatch({ type: 'SET_SHOW_DEPLOY_CELEBRATION', payload: true });

      // Save to deployment history
      saveDeployment({
        name: state.selectedCategory === 'custom' ? 'Custom Contract' : (state.selectedCategory || 'My Contract'),
        category: state.selectedCategory || 'custom',
        network: 'testnet',
        contractAddress: contractId,
        txHash: data.txHash || `tx-${Date.now()}`,
        code: state.generatedCode,
      });

    } catch (error) {
      console.error('Deploy error:', error);
      dispatch({ type: 'SET_DEPLOY_ERROR', payload: 'Deploy failed. Please try again.' });
      dispatch({ type: 'SET_SANCTUM_STAGE', payload: 'complete' });
    }
  }, [state.generatedCode, state.selectedCategory, state.sessionStartTime, trackStat, triggerCustom]);

  const handleBack = useCallback(() => {
    // Update longest session stat before resetting
    if (state.sessionStartTime) {
      const minutes = Math.floor((Date.now() - state.sessionStartTime) / 60000);
      if (minutes > statsRef.current.longestSessionMinutes) {
        setStat('longestSessionMinutes', minutes);
      }
    }
    dispatch({ type: 'RESET_SESSION' });
  }, [state.sessionStartTime, setStat]);

  const handleShare = useCallback(() => {
    if (state.generatedCode) {
      dispatch({
        type: 'SET_CONTRACT_TO_SHARE',
        payload: {
          code: state.generatedCode,
          name: state.selectedCategory === 'custom' ? 'Custom Contract' : (state.selectedCategory || 'My Contract'),
          category: state.selectedCategory || undefined,
        }
      });
      dispatch({ type: 'SET_SHOW_SHARE_MODAL', payload: true });
      // Track share achievement
      trackStat('contractsShared');
    }
  }, [state.generatedCode, state.selectedCategory, trackStat]);

  const handleShareFromHistory = useCallback((contract: DeployedContract) => {
    dispatch({ 
      type: 'SET_CONTRACT_TO_SHARE', 
      payload: {
        code: contract.code,
        name: contract.name,
        category: contract.category,
      }
    });
    dispatch({ type: 'SET_SHOW_SHARE_MODAL', payload: true });
  }, []);

  const handleRemixFromHistory = useCallback((code: string, name: string) => {
    dispatch({ type: 'SET_GENERATED_CODE', payload: code });
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: 'custom' });
    dispatch({ type: 'SET_CUSTOM_PROMPT', payload: `Remix: ${name}` });
    dispatch({ type: 'SET_SESSION_STARTED', payload: true });
    dispatch({ type: 'SET_SHOW_HISTORY', payload: false });
  }, []);

  // Trigger warden_audit achievement when roast mode is entered
  useEffect(() => {
    if (state.mode === 'roast') {
      setTimeout(() => triggerCustom('warden_audit'), 2000);
    }
  }, [state.mode, triggerCustom]);

  // Track unique personas used for council achievements
  useEffect(() => {
    if (state.personaId && !usedPersonasRef.current.has(state.personaId)) {
      usedPersonasRef.current.add(state.personaId);
      trackStat('uniquePersonasUsed');
    }
  }, [state.personaId, trackStat]);

  return {
    state,
    dispatch,
    // Handlers
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
  };
}