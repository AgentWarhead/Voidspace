import { useReducer, useCallback, useEffect } from 'react';
import { Achievement, ACHIEVEMENTS } from '../components/AchievementPopup';
import { CurrentTask } from '../components/TaskProgressInline';
import { DeployedContract, saveDeployment } from '../components/DeploymentHistory';
import { ImportedContract } from '../components/ImportContract';
import { generateSessionId } from '../components/PairProgramming';

type SanctumStage = 'idle' | 'thinking' | 'generating' | 'complete';
type SanctumMode = 'build' | 'roast' | 'webapp' | 'visual';

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
  currentAchievement: Achievement | null;
  unlockedAchievements: Set<string>;
  soundEnabled: boolean;
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
  | { type: 'SET_CURRENT_ACHIEVEMENT'; payload: Achievement | null }
  | { type: 'ADD_UNLOCKED_ACHIEVEMENT'; payload: string }
  | { type: 'SET_SOUND_ENABLED'; payload: boolean }
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
  | { type: 'RESET_SESSION' }
  | { type: 'START_CODE_GENERATION'; payload: string }
  | { type: 'COMPLETE_CODE_GENERATION' };

const initialState: SanctumState = {
  mode: 'build',
  selectedCategory: null,
  customPrompt: '',
  sessionStarted: false,
  generatedCode: '',
  tokensUsed: 0,
  tokenBalance: 50000,
  sanctumStage: 'idle',
  isGenerating: false,
  currentAchievement: null,
  unlockedAchievements: new Set<string>(),
  soundEnabled: true,
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
};

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
    
    case 'SET_CURRENT_ACHIEVEMENT':
      return { ...state, currentAchievement: action.payload };
    
    case 'ADD_UNLOCKED_ACHIEVEMENT':
      return { 
        ...state, 
        unlockedAchievements: new Set(Array.from(state.unlockedAchievements).concat([action.payload]))
      };
    
    case 'SET_SOUND_ENABLED':
      return { ...state, soundEnabled: action.payload };
    
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
    
    case 'RESET_SESSION':
      return {
        ...state,
        sessionStarted: false,
        selectedCategory: null,
        generatedCode: '',
        sanctumStage: 'idle',
        isGenerating: false,
        currentTask: null,
        isThinking: false,
        deployError: null,
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
  const [state, dispatch] = useReducer(sanctumReducer, initialState);

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

  // Achievement unlock function
  const unlockAchievement = useCallback((achievementId: string) => {
    if (state.unlockedAchievements.has(achievementId)) return;
    
    const achievement = ACHIEVEMENTS[achievementId];
    if (achievement) {
      dispatch({ type: 'ADD_UNLOCKED_ACHIEVEMENT', payload: achievementId });
      dispatch({ type: 'SET_CURRENT_ACHIEVEMENT', payload: achievement });
      
      // Play sound if enabled
      if (state.soundEnabled) {
        const audio = new Audio('/sounds/achievement.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      }
    }
  }, [state.unlockedAchievements, state.soundEnabled]);

  // Handler functions
  const handleCategorySelect = useCallback((categorySlug: string) => {
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: categorySlug });
    dispatch({ type: 'SET_SESSION_STARTED', payload: true });
    
    // Check for category-specific achievements
    if (categorySlug === 'chain-signatures') {
      setTimeout(() => unlockAchievement('chain_signatures'), 2000);
    } else if (categorySlug === 'ai-agents') {
      setTimeout(() => unlockAchievement('shade_agent'), 2000);
    }
  }, [unlockAchievement]);

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
    
    // First message achievement
    if (state.messageCount === 0) {
      unlockAchievement('first_message');
    }
  }, [state.messageCount, unlockAchievement]);

  const handleCodeGenerated = useCallback((code: string) => {
    dispatch({ type: 'START_CODE_GENERATION', payload: code });
    
    // First code achievement
    if (!state.unlockedAchievements.has('first_code')) {
      setTimeout(() => unlockAchievement('first_code'), 1500);
    }
    
    // Complete after typing animation
    setTimeout(() => {
      dispatch({ type: 'COMPLETE_CODE_GENERATION' });
    }, code.length * 10 + 500);
  }, [state.unlockedAchievements, unlockAchievement]);

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
      
      // First deploy achievement
      if (state.deployCount === 0) {
        unlockAchievement('first_deploy');
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
      
      // Play deploy sound
      if (state.soundEnabled) {
        const audio = new Audio('/sounds/deploy.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {});
      }
    } catch (error) {
      console.error('Deploy error:', error);
      dispatch({ type: 'SET_DEPLOY_ERROR', payload: 'Deploy failed. Please try again.' });
      dispatch({ type: 'SET_SANCTUM_STAGE', payload: 'complete' });
    }
  }, [state.generatedCode, state.selectedCategory, state.deployCount, state.soundEnabled, unlockAchievement]);

  const handleBack = useCallback(() => {
    dispatch({ type: 'RESET_SESSION' });
  }, []);

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
    }
  }, [state.generatedCode, state.selectedCategory]);

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

  return {
    state,
    dispatch,
    // Handlers
    unlockAchievement,
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
  };
}