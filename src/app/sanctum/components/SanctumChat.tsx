'use client';

import { useState, useRef, useEffect } from 'react';
// Lightweight inline markdown renderer — no external dependency needed
function SimpleMarkdown({ content }: { content: string | null | undefined }) {
  const lines = (content ?? '').split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^### /.test(line)) { elements.push(<h3 key={i} className="text-sm font-bold mb-1 text-white">{line.slice(4)}</h3>); }
    else if (/^## /.test(line)) { elements.push(<h2 key={i} className="text-base font-bold mb-2 text-white">{line.slice(3)}</h2>); }
    else if (/^# /.test(line)) { elements.push(<h1 key={i} className="text-lg font-bold mb-2 text-white">{line.slice(2)}</h1>); }
    else if (/^> /.test(line)) { elements.push(<blockquote key={i} className="border-l-2 border-near-green/50 pl-3 italic text-text-muted my-2">{line.slice(2)}</blockquote>); }
    else if (/^[-*] /.test(line)) { elements.push(<li key={i} className="ml-4 list-disc pl-1 break-words">{inlineFormat(line.slice(2))}</li>); }
    else if (/^\d+\. /.test(line)) { elements.push(<li key={i} className="ml-4 list-decimal pl-1 break-words">{inlineFormat(line.replace(/^\d+\. /, ''))}</li>); }
    else if (line.trim() === '') { elements.push(<br key={i} />); }
    else { elements.push(<p key={i} className="mb-2 last:mb-0 break-words leading-relaxed">{inlineFormat(line)}</p>); }
    i++;
  }
  return <>{elements}</>;
}
function inlineFormat(text: string | null | undefined): React.ReactNode {
  const parts = (text ?? '').split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) return <code key={i} className="bg-white/10 rounded px-1 py-0.5 font-mono text-xs">{part.slice(1,-1)}</code>;
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="font-bold text-white">{part.slice(2,-2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i} className="italic text-text-secondary">{part.slice(1,-1)}</em>;
    return part;
  });
}
// @ts-ignore
import { Loader2, ArrowRight, Sparkles, Lightbulb, Link2, X, FileText, Image, Square, Mic, MicOff, ChevronDown } from 'lucide-react';
import { VoiceIndicator } from './VoiceIndicator';
import { ChatMode } from './ModeSelector';
import { CodeAnnotations, CodeAnnotation } from './CodeAnnotations';
import { FeatureSuggestion, FeatureSuggestionData } from './FeatureSuggestion';
import { InlineQuiz, QuizData } from './InlineQuiz';
import { NextSteps, NextStep } from './NextSteps';
import { CategoryLearnBanner } from './CategoryLearnBanner';
import { getPersona, PERSONA_LIST } from '../lib/personas';
import { UpgradeModal } from '@/components/credits/UpgradeModal';
import { useWallet } from '@/hooks/useWallet';
import { SANCTUM_TIERS, type SanctumTier } from '@/lib/sanctum-tiers';
import { ModelSelector } from './ModelSelector';
import Link from 'next/link';

interface AttachedFile {
  name: string;
  type: string;
  size: number;
  content: string; // base64 for images, text for code files
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  code?: string;
  personaId?: string; // Which persona sent this message
  isPersonaSwitch?: boolean; // True for persona transition banners
  switchedToPersonaId?: string; // The persona being switched to
  switchReason?: string; // Why the persona switch happened
  attachments?: AttachedFile[];
  learnTip?: {
    title: string;
    explanation: string;
  };
  learnTips?: {
    title: string;
    explanation: string;
  }[];
  featureSuggestion?: FeatureSuggestionData;
  codeAnnotations?: CodeAnnotation[];
  quiz?: QuizData;
  nextSteps?: NextStep[];
  options?: {
    label: string;
    value: string;
  }[];
  tokensUsed?: {
    input: number;
    output: number;
  };
  milestone?: string | null;
}

// Task tracking types
interface TaskStep {
  id: string;
  label: string;
  status: 'pending' | 'working' | 'complete' | 'error';
  progress?: number;
  detail?: string;
}

interface CurrentTask {
  name: string;
  description?: string;
  steps: TaskStep[];
  startedAt?: number;
}

interface SanctumChatProps {
  category: string | null;
  customPrompt: string;
  autoMessage?: string;
  chatMode?: ChatMode;
  onChatModeChange?: (mode: ChatMode) => void;
  personaId: string;
  onPersonaChange: (id: string) => void;
  onCodeGenerated: (code: string) => void;
  onTokensUsed: (input: number, output: number) => void;
  onTaskUpdate?: (task: CurrentTask | null) => void;
  onThinkingChange?: (thinking: boolean) => void;
  onQuizAnswer?: (correct: boolean) => void;
  onConceptLearned?: (concept: { title: string; category: string; difficulty: string }) => void;
  onUserMessage?: (text: string) => void; // for achievement checks on user messages
  sessionReset?: number; // increment to signal reset from parent
  externalMessage?: string; // message injected from outside (code panel actions)
  externalMessageSeq?: number; // increment to trigger send
  externalMessageNoCode?: boolean; // when true, don't extract code from the response (for explain/audit/optimize)
  loadedProjectMessages?: Array<{ role: string; content: string }>; // messages from a loaded project
  loadedProjectSeq?: number; // increment to trigger project message restore
  sessionBriefing?: string | null; // briefing from previous session to inject on resume
  onBriefingUpdate?: (briefing: string) => void; // called when AI generates a project briefing
  /** Current contract code — tracked for cloud backup */
  currentContractCode?: string;
  /** Called whenever the cloud save status changes — drives indicator in ContractToolbar */
  onCloudSaveStatus?: (status: 'idle' | 'saving' | 'saved' | 'failed') => void;
}

// --- localStorage persistence for chat ---
const CHAT_MESSAGES_KEY = 'sanctum-chat-messages';

function loadSavedMessages(): Message[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CHAT_MESSAGES_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

// Specialist switch reasons — shown in the persona switch banner
const SWITCH_REASONS: Record<string, string> = {
  oxide:    'Rust-specific syntax or compilation question detected',
  warden:   'Security concern or audit request detected',
  phantom:  'Gas optimization or performance question detected',
  nexus:    'Cross-chain or NEAR Intents question detected',
  prism:    'Frontend integration or wallet UX question detected',
  crucible: 'Testing or QA request detected',
  ledger:   'Tokenomics or DeFi mechanics question detected',
};

// Natural next builds after code generation, keyed by category
const CONTRACT_PROGRESSIONS: Record<string, { title: string; emoji: string; prompt: string }[]> = {
  'meme-tokens': [
    { title: 'Staking Contract', emoji: '💎', prompt: 'Build a staking contract that locks my token for rewards' },
    { title: 'Liquidity Pool', emoji: '🌊', prompt: 'Build an AMM liquidity pool for my token' },
  ],
  'nfts': [
    { title: 'NFT Marketplace', emoji: '🏪', prompt: 'Build an NFT marketplace contract for buying and selling' },
    { title: 'Royalty Distributor', emoji: '👑', prompt: 'Build a royalty distribution contract for secondary sales' },
  ],
  'daos': [
    { title: 'Treasury Contract', emoji: '🏦', prompt: 'Build a DAO treasury with multi-sig spending control' },
    { title: 'Delegation System', emoji: '🤝', prompt: 'Build vote delegation for my DAO' },
  ],
  'defi': [
    { title: 'Price Oracle', emoji: '📊', prompt: 'Build an on-chain price oracle for my DeFi protocol' },
    { title: 'Liquidation Engine', emoji: '⚡', prompt: 'Build a liquidation mechanism for undercollateralized positions' },
  ],
  'staking-rewards': [
    { title: 'Governance Contract', emoji: '🗳️', prompt: 'Build governance voting weighted by staked tokens' },
    { title: 'Reward Booster', emoji: '🚀', prompt: 'Build a boosted rewards mechanism based on lock duration' },
  ],
  'gaming': [
    { title: 'NFT Loot System', emoji: '🎲', prompt: 'Build an NFT loot drop system for my game' },
    { title: 'Leaderboard Contract', emoji: '🏆', prompt: 'Build an on-chain leaderboard with rewards' },
  ],
  'chain-signatures': [
    { title: 'Multi-Chain Wallet', emoji: '🌐', prompt: 'Build a multi-chain wallet using Chain Signatures' },
    { title: 'Cross-Chain Swap', emoji: '🔄', prompt: 'Build a cross-chain token swap using Chain Signatures' },
  ],
};

// Category-specific starter prompts (mode-agnostic — used for initial options only)
const CATEGORY_STARTERS: Record<string, string> = {
  'ai-agents': "I'll help you build an AI-powered Shade Agent on NEAR. These autonomous agents can control assets across multiple chains using Chain Signatures. What should your agent do?",
  'intents': "Let's create an intent-based system on NEAR. Intents let users define WHAT they want, while solvers figure out HOW to execute it. What outcome should your intent achieve?",
  'chain-signatures': "Chain Signatures let your NEAR contract sign transactions on ANY blockchain — Bitcoin, Ethereum, Solana, you name it. What cross-chain capability do you need?",
  'privacy': "Privacy on NEAR! We can build private transfers, anonymous voting, or ZK-based systems. What needs to stay private?",
  'rwa': "Real World Assets on-chain! We can tokenize property, create payment systems, or build oracle-connected contracts. What real-world thing are we bringing to NEAR?",
  'defi': "DeFi time! Lending protocols, yield aggregators, stablecoins, or something custom? What financial primitive are we building?",
  'dex-trading': "DEX & Trading! AMM pools, order books, trading bots, or liquidity systems? What trading mechanism do you want?",
  'gaming': "GameFi! In-game tokens, NFT loot, play-to-earn mechanics, or metaverse assets? What's the game?",
  'nfts': "NFT time! Collections, marketplaces, royalty systems, or something unique? Tell me about your vision.",
  'daos': "DAO governance! Voting systems, treasury management, multi-sig, or proposal systems? How should your community make decisions?",
  'social': "Social & Creator economy! Tipping, gated content, fan tokens, or community rewards? How should creators monetize?",
  'dev-tools': "Developer tools! SDKs, testing frameworks, or utility libraries? What will help other builders?",
  'wallets': "Wallets & Identity! Custom wallet logic, authentication, or identity systems? What account features do you need?",
  'data-analytics': "Data & Analytics! Indexers, dashboards, or on-chain oracles? What data needs to flow?",
  'infrastructure': "Infrastructure! RPC proxies, validators, or storage systems? What core infrastructure are we building?",
  'custom': "Tell me more about what you want to build, and I'll guide you through creating it step by step.",
};

// Returns a mode-appropriate greeting for the given category
function getModeStarter(category: string | null, mode: ChatMode): string {
  const cat = category || 'custom';
  // Get a human-readable category name for the greeting
  const CATEGORY_NAMES: Record<string, string> = {
    'ai-agents': 'AI Agent',
    'intents': 'Intent-Based',
    'chain-signatures': 'Chain Signatures',
    'privacy': 'Privacy',
    'rwa': 'Real World Asset',
    'defi': 'DeFi',
    'dex-trading': 'DEX / Trading',
    'gaming': 'GameFi',
    'nfts': 'NFT',
    'daos': 'DAO Governance',
    'social': 'Social & Creator',
    'dev-tools': 'Developer Tools',
    'wallets': 'Wallet & Identity',
    'data-analytics': 'Data & Analytics',
    'infrastructure': 'Infrastructure',
    'meme-tokens': 'Meme Token',
    'staking-rewards': 'Staking & Rewards',
    'bridges': 'Bridge',
    'custom': 'Smart Contract',
  };
  const name = CATEGORY_NAMES[cat] || 'Smart Contract';

  if (mode === 'learn') {
    return `Welcome to the Sanctum. Choose how you'd like to work — I'll switch into that mode and we'll get started on your ${name} contract right away.`;
  }
  return `Describe your ${name} contract. I'll generate production-ready code immediately — no questions asked.`;
}

export function SanctumChat({ category, customPrompt, autoMessage, chatMode = 'learn', onChatModeChange, personaId, onPersonaChange, onCodeGenerated, onTokensUsed, onTaskUpdate, onThinkingChange, onQuizAnswer, onConceptLearned, onUserMessage, sessionReset, externalMessage, externalMessageSeq, externalMessageNoCode, loadedProjectMessages, loadedProjectSeq, sessionBriefing, onBriefingUpdate, currentContractCode, onCloudSaveStatus }: SanctumChatProps) {
  const currentPersona = getPersona(personaId);
  const { user, isConnected, openModal } = useWallet();
  // Default to 'specter' while user hasn't loaded — shows Opus as the premium default.
  // API enforces actual tier regardless. Once user loads, syncs to real tier.
  const userTier: SanctumTier = (user?.tier as SanctumTier) || 'specter';
  const tierConfig = SANCTUM_TIERS[userTier];
  const isFreeTier = userTier === 'shade';
  const modelLabel = tierConfig.aiModel.includes('opus') ? 'Claude Opus 4.6' : (tierConfig.aiModel.includes('sonnet-4-6') ? 'Claude Sonnet 4.6' : 'Claude Sonnet 4');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesRestoredRef = useRef(false);
  const saveMsgTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [voiceAutoSend, setVoiceAutoSend] = useState(false);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const autoMessageSentRef = useRef(false);
  const noCodeExtractionRef = useRef(false);
  const briefingInjectedRef = useRef(false);

  // Enhancement 4: Mode auto-detection banner
  const [modeSuggestion, setModeSuggestion] = useState<ChatMode | null>(null);
  const [modeSuggestionDismissed, setModeSuggestionDismissed] = useState(false);

  // Enhancement 5: Learn mode progress path
  const [learnMilestone, setLearnMilestone] = useState<string | null>(null);

  // Check for speech recognition support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interim = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interim += transcript;
          }
        }
        
        // Show interim results live
        setInterimTranscript(interim);
        
        if (finalTranscript) {
          setInput(prev => prev + finalTranscript);
          setInterimTranscript('');
          
          // Reset silence timer - auto-send after 2s of silence
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }
          silenceTimerRef.current = setTimeout(() => {
            // Flag for auto-send and stop listening
            setVoiceAutoSend(true);
            recognition.stop();
          }, 2000);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setInterimTranscript('');
      };
      
      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
        // Clear silence timer
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
      };
      
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Save messages to localStorage (debounced, but flush on unmount)
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  // Initialize cloud conv ID from localStorage — so on reload we update the same record
  const cloudConvIdRef = useRef<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('sanctum-cloud-conversation-id') : null
  );
  // Track latest contract code without causing re-render cycles
  const currentContractRef = useRef<string>(currentContractCode || '');
  useEffect(() => {
    currentContractRef.current = currentContractCode || '';
  }, [currentContractCode]);

  const cloudSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cloud save for ALL authenticated (connected) users — debounced 3s after last message.
  // Free/shade users get single-session backup; paid users get full history browsing.
  // NEVER let save failures interrupt the UI — fire and forget.
  const saveToCloud = (msgs: Message[], contractCode?: string) => {
    if (!isConnected || msgs.length < 2) return; // need at least 1 exchange + must be logged in
    if (cloudSaveTimerRef.current) clearTimeout(cloudSaveTimerRef.current);
    cloudSaveTimerRef.current = setTimeout(async () => {
      onCloudSaveStatus?.('saving');
      try {
        const convId = cloudConvIdRef.current;
        const code = contractCode ?? currentContractRef.current;
        const res = await fetch('/api/sanctum/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: convId || undefined,
            title: msgs.find(m => m.role === 'user')?.content?.slice(0, 80) || 'Sanctum Session',
            category,
            persona: personaId,
            mode: chatMode,
            messages: msgs.map(m => ({ role: m.role, content: m.content })),
            contractCode: code || undefined,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (!convId && data.conversationId) {
            cloudConvIdRef.current = data.conversationId;
            try { localStorage.setItem('sanctum-cloud-conversation-id', data.conversationId); } catch { /* ignore */ }
          }
          onCloudSaveStatus?.('saved');
          // Fade back to idle after 3s
          setTimeout(() => onCloudSaveStatus?.('idle'), 3000);
        } else {
          onCloudSaveStatus?.('failed');
        }
      } catch {
        // Silent fail — localStorage is the primary backup, cloud is the safety net
        onCloudSaveStatus?.('failed');
      }
    }, 3000);
  };

  useEffect(() => {
    if (messages.length === 0) return;
    if (saveMsgTimerRef.current) clearTimeout(saveMsgTimerRef.current);
    saveMsgTimerRef.current = setTimeout(() => {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages));
        } catch { /* ignore */ }
      }
    }, 500);
    // Also save to cloud for authenticated users (all tiers)
    saveToCloud(messages, currentContractRef.current || undefined);
    return () => {
      if (saveMsgTimerRef.current) clearTimeout(saveMsgTimerRef.current);
      if (cloudSaveTimerRef.current) clearTimeout(cloudSaveTimerRef.current);
      // Flush save immediately on unmount — never lose messages
      if (typeof window !== 'undefined' && messagesRef.current.length > 0) {
        try {
          localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messagesRef.current));
        } catch { /* ignore */ }
      }
    };
  }, [messages]); // eslint-disable-line react-hooks/exhaustive-deps

  // Also save on page unload (back button, tab close, navigation)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (messagesRef.current.length > 0) {
        try {
          localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messagesRef.current));
        } catch { /* ignore */ }
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
    };
  }, []);

  // Handle session reset from parent
  useEffect(() => {
    if (sessionReset && sessionReset > 0) {
      setMessages([]);
      messagesRestoredRef.current = false;
      // Clear cloud conversation ID — new session should create a new cloud record
      cloudConvIdRef.current = null;
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(CHAT_MESSAGES_KEY);
          localStorage.removeItem('sanctum-cloud-conversation-id');
        } catch { /* ignore */ }
      }
    }
  }, [sessionReset]);

  // Session restore from cloud: if localStorage messages are empty but cloud ID exists,
  // try to restore from the cloud backup. This handles the "cleared localStorage" scenario.
  useEffect(() => {
    const cloudId = typeof window !== 'undefined' ? localStorage.getItem('sanctum-cloud-conversation-id') : null;
    if (!cloudId || !isConnected) return;

    // Only restore if localStorage messages are empty
    const savedMsgs = loadSavedMessages();
    if (savedMsgs && savedMsgs.length > 0) return; // localStorage is fine

    // Fetch from cloud
    (async () => {
      try {
        const res = await fetch(`/api/sanctum/conversations/${cloudId}`);
        if (!res.ok) return;
        const data = await res.json();
        const msgs: Array<{ role: string; content: string }> = data.messages || [];
        if (msgs.length === 0) return;
        const restored: Message[] = msgs.map((m, i) => ({
          id: `restored-${i}`,
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));
        setMessages(restored);
        messagesRestoredRef.current = true;
        cloudConvIdRef.current = cloudId;
        // Restore contract code if available
        if (data.conversation?.contract_code && onCodeGenerated) {
          onCodeGenerated(data.conversation.contract_code);
        }
      } catch { /* silent — localStorage backup will handle it */ }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]); // Only on mount/auth change, not on every dep update

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: AttachedFile[] = [];
    
    for (const file of Array.from(files)) {
      // Limit file size to 5MB
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Max 5MB.`);
        continue;
      }

      const isImage = file.type.startsWith('image/');
      const isText = file.type.startsWith('text/') || 
        ['.rs', '.ts', '.tsx', '.js', '.jsx', '.json', '.toml', '.md', '.sol'].some(ext => file.name.endsWith(ext));

      if (isImage) {
        // Read as base64 for images
        const content = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        newAttachments.push({ name: file.name, type: file.type, size: file.size, content });
      } else if (isText || file.size < 100 * 1024) {
        // Read as text for code files
        const content = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsText(file);
        });
        newAttachments.push({ name: file.name, type: 'text/plain', size: file.size, content });
      } else {
        alert(`File type not supported: ${file.name}`);
      }
    }

    setAttachedFiles(prev => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Initialize with category-specific starter (or restore from localStorage)
  useEffect(() => {
    // Try to restore messages from localStorage first
    if (!messagesRestoredRef.current) {
      messagesRestoredRef.current = true;
      const saved = loadSavedMessages();
      if (saved && saved.length > 0) {
        setMessages(saved);
        return; // Skip initial message setup — we have restored messages
      }
    }

    // If messages were already restored, don't overwrite them on category change
    // (This prevents the category dependency from wiping restored chat history)
    if (messagesRef.current.length > 0) return;

    // For template walkthroughs, skip the greeting — go straight to user message
    if (autoMessage && !autoMessageSentRef.current) {
      autoMessageSentRef.current = true;
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: autoMessage,
      };
      setMessages([userMessage]);
      sendToApi(autoMessage, [userMessage]);
      return;
    }

    const starterMessage = getModeStarter(category, chatMode);
    const initialMessage: Message = {
      id: 'initial',
      role: 'assistant',
      content: starterMessage,
      personaId: currentPersona.id,
      options: getInitialOptions(category, chatMode),
    };
    setMessages([initialMessage]);

  }, [category]);

  // Auto-send wizard prompt when it arrives (may arrive after initial mount)
  // IMPORTANT: only fires for fresh sessions — never overwrites restored chat history
  const autoMessageFiredRef = useRef(false);
  useEffect(() => {
    // If messages were already restored from localStorage, do NOT overwrite them.
    // messagesRestoredRef.current is true if we loaded from storage on this mount.
    if (messagesRestoredRef.current && messagesRef.current.length > 0) return;
    if (autoMessage && !autoMessageFiredRef.current && !autoMessageSentRef.current) {
      autoMessageFiredRef.current = true;
      autoMessageSentRef.current = true;
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: autoMessage,
      };
      // Replace greeting with user message + send to API
      setMessages([userMessage]);
      sendToApi(autoMessage, [userMessage]);
    }
  }, [autoMessage]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function getInitialOptions(cat: string | null, mode: ChatMode): { label: string; value: string }[] | undefined {
    // Learn mode: First interaction = mode selection. Options encode __mode:<mode>|<message>
    // handleOptionClick parses the prefix, switches the tab, then sends the message + category context.
    if (mode === 'learn') {
      return [
        { label: '🌱 Learn mode — teach me as we build', value: '__mode:learn|I\'m new to NEAR and smart contracts. Teach me the concepts as we build — start from the basics.' },
        { label: '🌑 Void mode — just generate the code', value: '__mode:void|I know Rust. Skip all explanation — generate production-ready code immediately, defaults used.' },
      ];
    }

    // Void mode (or fallback): Offer templates as "Describe your app" shortcuts
    switch (cat) {
      case 'ai-agents':
        return [
          { label: '🤖 Portfolio Manager', value: 'Build an AI agent that manages and rebalances a crypto portfolio across chains' },
          { label: '📊 Trading Bot', value: 'Build an autonomous trading agent that executes strategies' },
          { label: '🔔 Alert Agent', value: 'Build an agent that monitors conditions and takes action' },
        ];
      case 'intents':
        return [
          { label: '💱 Cross-Chain Swap', value: 'Build an intent for swapping tokens across different blockchains' },
          { label: '📦 Best Price Finder', value: 'Build an intent that finds the best price across all DEXs' },
          { label: '🔄 Auto-Rebalance', value: 'Build an intent for automatic portfolio rebalancing' },
        ];
      case 'defi':
        return [
          { label: '🏦 Lending Protocol', value: 'Build a lending/borrowing protocol' },
          { label: '🌾 Yield Aggregator', value: 'Build a yield optimization protocol' },
          { label: '💵 Stablecoin', value: 'Build a stablecoin mechanism' },
        ];
      case 'nfts':
        return [
          { label: '🎨 NFT Collection', value: 'Build an NFT collection with minting' },
          { label: '🏪 Marketplace', value: 'Build an NFT marketplace' },
          { label: '👑 Royalty System', value: 'Build a royalty distribution system' },
        ];
      case 'daos':
        return [
          { label: '🗳️ Voting System', value: 'Build a governance voting contract' },
          { label: '💰 Treasury', value: 'Build a DAO treasury with multi-sig' },
          { label: '📝 Proposal System', value: 'Build a proposal and execution system' },
        ];
      default:
        return undefined;
    }
  }

  // Core API call logic — used by both handleSend and auto-message
  async function sendToApi(text: string, contextMessages: Message[], userAttachments?: AttachedFile[], noCodeExtraction?: boolean) {
    setIsLoading(true);
    onThinkingChange?.(true);

    const taskName = getTaskName(text);
    const hasAttachments = userAttachments && userAttachments.length > 0;
    
    const task: CurrentTask = {
      name: taskName,
      description: text.length > 50 ? text.slice(0, 50) + '...' : text,
      startedAt: Date.now(),
      steps: [
        { id: 'analyze', label: 'Analyzing request', status: 'working', progress: 0 },
        ...(hasAttachments ? [{ id: 'attachments', label: 'Processing attachments', status: 'pending' as const }] : []),
        { id: 'design', label: 'Designing solution', status: 'pending' },
        { id: 'generate', label: 'Generating code', status: 'pending' },
        { id: 'review', label: 'Review & explain', status: 'pending' },
      ],
    };
    onTaskUpdate?.(task);

    let analyzeProgress = 0;
    const analyzeInterval = setInterval(() => {
      analyzeProgress = Math.min(analyzeProgress + 15, 90);
      const updatedTask = { ...task };
      updatedTask.steps = task.steps.map(s => 
        s.id === 'analyze' ? { ...s, progress: analyzeProgress, detail: 'Understanding your requirements...' } : s
      );
      onTaskUpdate?.(updatedTask);
    }, 200);

    let fullContent = text;
    if (userAttachments) {
      for (const file of userAttachments) {
        if (file.type === 'text/plain') {
          fullContent += `\n\n--- Attached file: ${file.name} ---\n${file.content}\n--- End of ${file.name} ---`;
        }
      }
    }

    try {
      clearInterval(analyzeInterval);
      task.steps = task.steps.map(s => 
        s.id === 'analyze' ? { ...s, status: 'complete', progress: 100 } : s
      );
      onTaskUpdate?.({ ...task });
      
      if (hasAttachments) {
        task.steps = task.steps.map(s => 
          s.id === 'attachments' ? { ...s, status: 'working', detail: 'Reading attached files...' } : s
        );
        onTaskUpdate?.({ ...task });
        await new Promise(r => setTimeout(r, 300));
        task.steps = task.steps.map(s => 
          s.id === 'attachments' ? { ...s, status: 'complete' } : s
        );
        onTaskUpdate?.({ ...task });
      }

      task.steps = task.steps.map(s => 
        s.id === 'design' ? { ...s, status: 'working', detail: 'Planning contract architecture...' } : s
      );
      onTaskUpdate?.({ ...task });

      abortControllerRef.current = new AbortController();

      // Enhancement 7: Inject session briefing on the very first API call (resume case)
      // Also re-include generated code in assistant messages — code is stripped from content
      // and stored in m.code separately, so the AI can't see it unless we inject it back.
      let apiMessages = contextMessages.map(m => {
        if (m.role === 'assistant' && m.code) {
          const codeBlock = `\n\n\`\`\`rust\n${m.code}\n\`\`\``;
          return { role: m.role, content: (m.content || '') + codeBlock };
        }
        return { role: m.role, content: m.content || '' };
      });
      if (sessionBriefing && !briefingInjectedRef.current) {
        briefingInjectedRef.current = true;
        apiMessages = [
          { role: 'assistant', content: `[Session context: ${sessionBriefing}]` },
          ...apiMessages,
        ];
      }

      const response = await fetch('/api/sanctum/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          category,
          personaId: currentPersona.id,
          mode: chatMode,
          attachments: userAttachments?.filter(f => f.type.startsWith('image/')),
          preferredModel: typeof window !== 'undefined' ? localStorage.getItem('sanctum-model-preference') : null,
          noCodeExtraction: noCodeExtractionRef.current || undefined,
        }),
        signal: abortControllerRef.current.signal,
      });

      task.steps = task.steps.map(s => 
        s.id === 'design' ? { ...s, status: 'complete' } : s
      );
      onTaskUpdate?.({ ...task });

      if (response.status === 402) {
        setShowUpgradeModal(true);
        setIsLoading(false);
        onThinkingChange?.(false);
        onTaskUpdate?.(null);
        return;
      }

      // Safely parse response — handle non-JSON errors (Vercel timeouts, Anthropic errors)
      let data;
      if (!response.ok) {
        let errorText = 'Server error';
        try {
          const text = await response.text();
          // Try to parse as JSON first (our API returns JSON errors)
          try {
            const jsonErr = JSON.parse(text);
            errorText = jsonErr.error || jsonErr.message || `Error ${response.status}`;
          } catch {
            // Not JSON — extract first meaningful line from HTML/text error
            errorText = text.slice(0, 200).replace(/<[^>]*>/g, '').trim() || `Error ${response.status}`;
          }
        } catch { /* ignore */ }
        throw new Error(errorText);
      }

      try {
        data = await response.json();
      } catch (parseErr) {
        throw new Error('Invalid response from server — please try again');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.code) {
        task.steps = task.steps.map(s => 
          s.id === 'generate' ? { ...s, status: 'working', progress: 0, detail: 'Writing Rust code...' } : s
        );
        onTaskUpdate?.({ ...task });
        
        const codeLines = data.code.split('\n').length;
        let codeProgress = 0;
        const codeInterval = setInterval(() => {
          codeProgress = Math.min(codeProgress + 5, 100);
          const updatedTask = { ...task };
          updatedTask.steps = task.steps.map(s => 
            s.id === 'generate' ? { ...s, progress: codeProgress, detail: `Writing line ${Math.floor(codeProgress/100 * codeLines)}/${codeLines}...` } : s
          );
          onTaskUpdate?.(updatedTask);
          
          if (codeProgress >= 100) clearInterval(codeInterval);
        }, 50);
        
        await new Promise(r => setTimeout(r, 800));
        clearInterval(codeInterval);
        
        task.steps = task.steps.map(s => 
          s.id === 'generate' ? { ...s, status: 'complete', progress: 100 } : s
        );
        onTaskUpdate?.({ ...task });
      } else {
        task.steps = task.steps.filter(s => s.id !== 'generate');
        onTaskUpdate?.({ ...task });
      }

      task.steps = task.steps.map(s => 
        s.id === 'review' ? { ...s, status: 'working', detail: 'Preparing explanation...' } : s
      );
      onTaskUpdate?.({ ...task });
      await new Promise(r => setTimeout(r, 300));
      task.steps = task.steps.map(s => 
        s.id === 'review' ? { ...s, status: 'complete' } : s
      );
      onTaskUpdate?.({ ...task });

      // ── SWITCH SIGNAL PARSING — Shade auto-routes to specialists ──
      const switchSignalRegex = /^\[SWITCH:(\w+)\]\n?/;
      const switchSignalMatch = data.content?.match(switchSignalRegex);
      let switchedPersonaId: string | null = null;
      if (switchSignalMatch) {
        switchedPersonaId = switchSignalMatch[1];
        // Strip the routing signal from the content before displaying
        data.content = data.content.replace(switchSignalRegex, '');
        // Notify parent to update the active persona
        onPersonaChange(switchedPersonaId);
      }

      // Build learnTips array from both old and new formats
      const learnTips: { title: string; explanation: string }[] = [];
      if (data.learnTips && Array.isArray(data.learnTips)) {
        learnTips.push(...data.learnTips);
      } else if (data.learnTip) {
        learnTips.push(data.learnTip);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content ?? '',
        code: data.code,
        personaId: switchedPersonaId || currentPersona.id,
        learnTip: data.learnTip,
        learnTips: learnTips.length > 0 ? learnTips : undefined,
        featureSuggestion: data.featureSuggestion,
        codeAnnotations: data.codeAnnotations,
        quiz: data.quiz,
        nextSteps: data.nextSteps,
        options: data.options,
        tokensUsed: data.usage,
        milestone: data.milestone || null,
      };

      // Notify parent about concepts from learn tips
      if (learnTips.length > 0 && onConceptLearned) {
        for (const tip of learnTips) {
          onConceptLearned({ title: tip.title, category: 'near-sdk', difficulty: 'intermediate' });
        }
      }

      // ── CODE EXTRACTION — prefer explicit `code` field, fallback to content parsing ──
      // SKIP code extraction for analysis actions (explain/audit/optimize) — those
      // responses belong in the chat window, not the code preview panel.
      // Use passed param if available (captured before async boundary), fall back to ref
      const skipCodeExtraction = noCodeExtraction ?? noCodeExtractionRef.current;
      let extractedCode: string | null = skipCodeExtraction ? null : (data.code || null);
      try {
        if (!skipCodeExtraction) {
          if (!extractedCode && data.content) {
            // Strategy 1: Fenced Rust code blocks (```rust ... ```)
            const rustMatch = data.content.match(/```rust\s*\n([\s\S]*?)```/);
            if (rustMatch && rustMatch[1] && rustMatch[1].trim().length > 50) {
              extractedCode = rustMatch[1].trim();
            }
            // Strategy 2: Any fenced code block that looks like Rust/NEAR
            if (!extractedCode) {
              const anyFence = data.content.match(/```\w*\s*\n([\s\S]*?)```/);
              if (anyFence && anyFence[1] && /(?:use\s+near_sdk|#\[near|pub\s+(?:fn|struct)|impl\s+\w)/.test(anyFence[1])) {
                extractedCode = anyFence[1].trim();
              }
            }
          }

          // ── STRIP CODE from chat content — code belongs in preview panel ONLY ──
          // Only strip when we're actually extracting code to the preview panel
          if (extractedCode && assistantMessage.content) {
            let cleaned = assistantMessage.content
              // Strip all fenced code blocks (any language)
              .replace(/```\w*\s*\n[\s\S]*?```/g, '')
              .replace(/\n{3,}/g, '\n\n')
              .trim();
            // If stripping left almost nothing and we have code, add a note
            if (cleaned.length < 30 && extractedCode) {
              cleaned = '✅ Contract generated — see the preview panel →';
            }
            assistantMessage.content = cleaned;
          }
        }
        // For analysis actions: keep ALL content (including code blocks) in the chat message
        // so the explanation with code references displays properly.
      } catch (extractErr) {
        // Never let extraction crash the chat — show whatever we have
        console.error('Code extraction error:', extractErr);
      }

      // Enhancement 7: trigger briefing update
      if (data.projectBriefing && onBriefingUpdate) {
        onBriefingUpdate(data.projectBriefing);
      }

      // Enhancement 5: update learn milestone
      if (data.milestone) {
        setLearnMilestone(data.milestone);
      }

      // Insert persona switch banner + assistant message atomically
      if (switchedPersonaId) {
        const switchBanner: Message = {
          id: `switch-banner-${Date.now()}`,
          role: 'assistant',
          content: '',
          isPersonaSwitch: true,
          switchedToPersonaId: switchedPersonaId,
          switchReason: SWITCH_REASONS[switchedPersonaId] || undefined,
        };
        setMessages(prev => [...prev, switchBanner, assistantMessage]);
      } else {
        setMessages(prev => [...prev, assistantMessage]);
      }

      if (extractedCode) {
        onCodeGenerated(extractedCode);
        // Update contract ref immediately so the next cloud save captures the new code
        currentContractRef.current = extractedCode;
      }

      if (data.usage) {
        onTokensUsed(data.usage.input, data.usage.output);
      }

      setTimeout(() => {
        onTaskUpdate?.(null);
      }, 1500);
      
    } catch (error) {
      clearInterval(analyzeInterval);
      
      if (error instanceof Error && error.name === 'AbortError') {
        task.steps = task.steps.map(s => 
          s.status === 'working' ? { ...s, status: 'error', detail: 'Cancelled' } : s
        );
        onTaskUpdate?.({ ...task });
        
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '🛑 Request cancelled. No tokens were wasted!',
        }]);
      } else {
        console.error('Chat error:', error);
        const errMsg = error instanceof Error ? error.message : 'Something went wrong';
        
        task.steps = task.steps.map(s => 
          s.status === 'working' ? { ...s, status: 'error', detail: errMsg.slice(0, 60) } : s
        );
        onTaskUpdate?.({ ...task });
        
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `⚠️ ${errMsg}\n\nHit the send button to retry.`,
        }]);
      }
    } finally {
      setIsLoading(false);
      onThinkingChange?.(false);
      abortControllerRef.current = null;
    }
  }

  async function handleSend(messageText?: string) {
    // Phase 2: Guest Mode Gate
    // Users can view the initial AI message, but must connect wallet to reply.
    if (!isConnected) {
      openModal();
      return;
    }

    const text = messageText || input;
    if ((!text.trim() && attachedFiles.length === 0) || isLoading) return;
    // Reset noCodeExtraction for normal user input (external injection sets it before calling handleSend)
    if (!messageText) noCodeExtractionRef.current = false;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
    };

    const allMessages = [...messages, userMessage];
    setMessages(allMessages);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setAttachedFiles([]);

    // Notify parent for achievement checks
    onUserMessage?.(text);

    // Capture flag synchronously before any async boundary — ref can change mid-flight
    const capturedNoCode = noCodeExtractionRef.current;
    await sendToApi(text, allMessages, userMessage.attachments, capturedNoCode);
  }

  // Stop/cancel the current request
  function handleStop() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }

  // Auto-send after voice input stops (with content)
  useEffect(() => {
    if (voiceAutoSend && input.trim() && !isLoading) {
      setVoiceAutoSend(false);
      handleSend();
    } else if (voiceAutoSend) {
      setVoiceAutoSend(false);
    }
  }, [voiceAutoSend, input, isLoading]);

  // External message injection (from code panel actions)
  useEffect(() => {
    if (externalMessage && externalMessageSeq && externalMessageSeq > 0 && !isLoading) {
      // Set the noCodeExtraction flag before sending — sendToApi reads it via ref
      noCodeExtractionRef.current = !!externalMessageNoCode;
      handleSend(externalMessage);
    }
  }, [externalMessageSeq]);

  // Restore messages from a loaded project
  useEffect(() => {
    if (loadedProjectMessages && loadedProjectSeq && loadedProjectSeq > 0) {
      const restored: Message[] = loadedProjectMessages.map((m, i) => ({
        id: `loaded-${Date.now()}-${i}`,
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));
      setMessages(restored);
      messagesRestoredRef.current = true;
    }
  }, [loadedProjectSeq]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Determine a task name based on the user's request
  function getTaskName(text: string): string {
    const lower = text.toLowerCase();
    if (lower.includes('nft')) return 'Building NFT Contract';
    if (lower.includes('token') || lower.includes('fungible')) return 'Building Token Contract';
    if (lower.includes('dao') || lower.includes('vote') || lower.includes('govern')) return 'Building DAO Contract';
    if (lower.includes('marketplace')) return 'Building Marketplace';
    if (lower.includes('lend') || lower.includes('borrow')) return 'Building Lending Protocol';
    if (lower.includes('swap') || lower.includes('dex')) return 'Building DEX Contract';
    if (lower.includes('stake') || lower.includes('staking')) return 'Building Staking Contract';
    if (lower.includes('portfolio') || lower.includes('agent')) return 'Building AI Agent';
    if (lower.includes('trading') || lower.includes('bot')) return 'Building Trading Bot';
    if (lower.includes('chain signature')) return 'Building Cross-Chain Contract';
    return 'Processing Request';
  }

  function handleOptionClick(value: string) {
    // Mode-switching options are encoded as: __mode:<mode>|<message text>
    if (value.startsWith('__mode:')) {
      const pipeIdx = value.indexOf('|');
      const targetMode = value.slice(7, pipeIdx) as ChatMode;
      const messageText = value.slice(pipeIdx + 1);

      // Switch the mode tab immediately
      onChatModeChange?.(targetMode);

      // Inject the user's category or custom idea so the AI knows what to build
      const CATEGORY_NAMES: Record<string, string> = {
        'ai-agents': 'AI Agent', 'intents': 'Intent-Based', 'chain-signatures': 'Chain Signatures',
        'privacy': 'Privacy', 'rwa': 'Real World Asset', 'defi': 'DeFi', 'dex-trading': 'DEX / Trading',
        'gaming': 'GameFi', 'nfts': 'NFT', 'daos': 'DAO Governance', 'social': 'Social & Creator',
        'dev-tools': 'Developer Tools', 'wallets': 'Wallet & Identity', 'data-analytics': 'Data & Analytics',
        'infrastructure': 'Infrastructure', 'meme-tokens': 'Meme Token', 'staking-rewards': 'Staking & Rewards',
        'bridges': 'Bridge',
      };
      const categoryContext = customPrompt
        ? ` Here's what I want to build: ${customPrompt}`
        : category && category !== 'custom'
          ? ` I want to build a ${CATEGORY_NAMES[category] || category} contract on NEAR.`
          : '';

      handleSend(messageText + categoryContext);
      return;
    }
    handleSend(value);
  }

  // Enhancement 4: Detect suggested mode from user input
  function detectSuggestedMode(text: string): ChatMode | null {
    if (messages.length > 0 || modeSuggestionDismissed) return null;
    const lower = text.toLowerCase().trim();
    if (lower.length < 8) return null;
    const learnSignals = ['what is', 'how does', 'how do', 'explain', "i'm new", 'im new', 'beginner', 'never built', "don't understand", 'what are', 'what does'];
    const expertSignals = ['write me', 'build me', 'generate a', 'implement a', 'create a', 'make me', 'give me'];
    const isLearnSignal = learnSignals.some(s => lower.includes(s));
    const isExpertSignal = expertSignals.some(s => lower.includes(s)) && lower.length > 20;
    if (isLearnSignal && chatMode !== 'learn') return 'learn';
    if (isExpertSignal && chatMode !== 'void') return 'void';
    return null;
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />

      {/* Category learn banner — suppressed in Learn mode (progress path handles context there) */}
      {category && chatMode !== 'learn' && (
        <CategoryLearnBanner category={category} mode={chatMode} />
      )}

      {/* Enhancement 5: Learn mode progress path — only once first milestone fires */}
      {chatMode === 'learn' && learnMilestone !== null && (
        <div className="flex-shrink-0 border-b border-border-subtle/50 bg-void-black/20">
          <LearnProgressPath currentMilestone={learnMilestone} />
        </div>
      )}
      
      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.map((message) => {
          // ── Persona Switch Banner ──
          if (message.isPersonaSwitch) {
            const switchedPersona = getPersona(message.switchedToPersonaId || 'shade');
            return (
              <div key={message.id} className="flex justify-center my-2 px-2">
                <div
                  className={`w-full max-w-sm rounded-xl border-2 ${switchedPersona.borderColor} ${switchedPersona.bgColor} px-5 py-4 text-center`}
                  style={{ animation: 'sanctumFadeInUp 0.4s ease-out' }}
                >
                  <div className="text-3xl mb-2">{switchedPersona.emoji}</div>
                  <p className="text-sm font-bold text-text-primary mb-1">
                    {switchedPersona.name} has entered the session
                  </p>
                  <p className="text-xs text-text-muted leading-relaxed">{switchedPersona.description}</p>
                  {message.switchReason && (
                    <p className="text-[10px] text-text-muted/60 mt-1.5 font-mono">
                      ↳ {message.switchReason}
                    </p>
                  )}
                </div>
              </div>
            );
          }

          return (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] sm:max-w-[85%] min-w-0 overflow-hidden ${message.role === 'user' ? 'order-2' : ''}`}>
              {/* Avatar */}
              <div className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {(() => {
                  const persona = message.personaId ? getPersona(message.personaId) : currentPersona;
                  return (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-near-green/20 text-near-green' 
                        : persona.bgColor
                    }`}>
                      {message.role === 'user' ? '👤' : persona.emoji}
                    </div>
                  );
                })()}
                
                <div className={`rounded-2xl px-4 py-3 min-w-0 overflow-hidden ${
                  message.role === 'user'
                    ? 'bg-near-green/20 border border-near-green/30'
                    : 'bg-void-gray border border-border-subtle'
                }`}>
                  {/* Attached files */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {message.attachments.map((file, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded bg-void-black/30 text-xs">
                          {file.type.startsWith('image/') ? (
                            <Image className="w-3 h-3 text-purple-400" />
                          ) : (
                            <FileText className="w-3 h-3 text-near-green" />
                          )}
                          <span className="text-text-muted">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Message content */}
                  <div className="text-sm sm:text-base text-text-primary">
                    <SimpleMarkdown content={message.content} />
                  </div>
                  
                  {/* Learn tips (array — new format) */}
                  {message.learnTips && message.learnTips.length > 0 ? (
                    message.learnTips.map((tip, tipIdx) => (
                      <div key={tipIdx} className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-1">
                          <Lightbulb className="w-4 h-4" />
                          {tip.title}
                        </div>
                        <p className="text-sm text-text-secondary">{tip.explanation}</p>
                      </div>
                    ))
                  ) : message.learnTip ? (
                    /* Backward compat: single learnTip */
                    <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-1">
                        <Lightbulb className="w-4 h-4" />
                        {message.learnTip.title}
                      </div>
                      <p className="text-sm text-text-secondary">{message.learnTip.explanation}</p>
                    </div>
                  ) : null}

                  {/* Code annotations */}
                  {message.codeAnnotations && message.code && (
                    <CodeAnnotations annotations={message.codeAnnotations} code={message.code} />
                  )}

                  {/* Inline quiz */}
                  {message.quiz && (
                    <InlineQuiz quiz={message.quiz} onAnswer={onQuizAnswer} />
                  )}

                  {/* Feature suggestion */}
                  {message.featureSuggestion && (
                    <FeatureSuggestion
                      suggestion={message.featureSuggestion}
                      onAddFeature={(text) => handleSend(text)}
                    />
                  )}

                  {/* Next steps — with persona switch support */}
                  {message.nextSteps && (
                    <NextSteps
                      steps={message.nextSteps}
                      onSelect={(value) => {
                        // Check if the clicked step has a persona — switch if so
                        const step = message.nextSteps?.find(s => s.value === value);
                        if (step?.persona) {
                          const switchedPersona = getPersona(step.persona);
                          const banner: Message = {
                            id: `switch-banner-${Date.now()}`,
                            role: 'assistant',
                            content: '',
                            isPersonaSwitch: true,
                            switchedToPersonaId: step.persona,
                          };
                          setMessages(prev => [...prev, banner]);
                          onPersonaChange(step.persona);
                        }
                        handleSend(value);
                      }}
                    />
                  )}

                  {/* Enhancement 6: Natural next builds after code generation */}
                  {message.code && message.role === 'assistant' && category && CONTRACT_PROGRESSIONS[category] && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-text-muted/50 mb-2">🔗 Natural next build</p>
                      <div className="flex flex-wrap gap-2">
                        {CONTRACT_PROGRESSIONS[category].map((prog) => (
                          <button
                            key={prog.title}
                            onClick={() => handleSend(prog.prompt)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-near-green/10 hover:border-near-green/25 text-text-muted hover:text-near-green transition-all text-xs font-medium"
                          >
                            <span>{prog.emoji}</span>
                            {prog.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Quick options */}
                  {message.options && message.options.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 max-w-full">
                      {message.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleOptionClick(opt.value)}
                          className="px-3 py-2 min-h-[44px] text-sm bg-void-black/50 hover:bg-near-green/20 border border-border-subtle hover:border-near-green/30 rounded-lg transition-all text-text-secondary hover:text-near-green text-left break-words"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Token usage indicator */}
                  {message.tokensUsed && (
                    <div className="mt-2 text-xs text-text-muted flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {message.tokensUsed.input + message.tokensUsed.output} tokens
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          );
        })}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
              🐧
            </div>
            <div className="rounded-2xl px-4 py-3 bg-void-gray border border-border-subtle">
              <Loader2 className="w-5 h-5 animate-spin text-near-green" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-3 sm:p-4 border-t border-border-subtle bg-void-black/30">
        {/* Voice mode indicator */}
        {isListening && (
          <div className="mb-3">
            <VoiceIndicator isListening={isListening} interimText={interimTranscript || input} />
          </div>
        )}
        
        {/* Enhancement 4: Mode auto-detection banner */}
        {modeSuggestion && !modeSuggestionDismissed && (
          <div className="mb-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-near-green/[0.08] border border-near-green/20 text-xs">
            <span className="text-near-green/80">
              {modeSuggestion === 'learn' ? '🎓 Looks like you\'re exploring — ' : '⚡ Sounds like you know what you want — '}
              <button
                onClick={() => {
                  onChatModeChange?.(modeSuggestion);
                  setModeSuggestionDismissed(true);
                  setModeSuggestion(null);
                }}
                className="underline text-near-green font-medium"
              >
                switch to {modeSuggestion === 'learn' ? 'Learn' : 'Void'} mode?
              </button>
            </span>
            <button
              onClick={() => { setModeSuggestionDismissed(true); setModeSuggestion(null); }}
              className="ml-auto text-text-muted hover:text-white"
            >✕</button>
          </div>
        )}

        {/* Attached files preview */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {attachedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-void-gray border border-border-subtle text-sm"
              >
                {file.type.startsWith('image/') ? (
                  <Image className="w-4 h-4 text-purple-400" />
                ) : (
                  <FileText className="w-4 h-4 text-near-green" />
                )}
                <span className="text-text-secondary max-w-[120px] truncate">{file.name}</span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="p-0.5 hover:bg-white/10 rounded transition-colors"
                >
                  <X className="w-3 h-3 text-text-muted hover:text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Model watermark / selector + Persona switcher */}
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <ModelSelector tier={userTier} />
            <span className="text-[10px] text-near-green/40">NEAR-specialized</span>
          </div>
          <PersonaSwitcherChip
            currentPersonaId={personaId}
            onSwitch={(id) => {
              const banner: Message = {
                id: `switch-banner-${Date.now()}`,
                role: 'assistant',
                content: '',
                isPersonaSwitch: true,
                switchedToPersonaId: id,
              };
              setMessages(prev => [...prev, banner]);
              onPersonaChange(id);
            }}
          />
        </div>

        <div className="flex gap-1.5 sm:gap-2">
          {/* File attachment button */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".rs,.ts,.tsx,.js,.jsx,.json,.toml,.md,.sol,.txt,image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-void-gray border border-border-subtle hover:border-purple-500/30 hover:bg-purple-500/10 disabled:opacity-50 transition-all flex-shrink-0"
            title="Attach files (code, images)"
          >
            <Link2 className="w-5 h-5 text-text-muted" />
          </button>
          
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              // Auto-resize
              if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
              }
              // Enhancement 4: mode auto-detection
              if (!modeSuggestionDismissed && messages.length === 0) {
                setModeSuggestion(detectSuggestedMode(e.target.value));
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            placeholder={isListening ? "Listening..." : isConnected ? "Describe what you want to build..." : "Connect wallet to reply..."}
            className={`flex-1 min-w-0 px-3 sm:px-4 py-3 rounded-xl bg-surface border focus:outline-none focus:ring-1 text-sm sm:text-base text-white placeholder:text-text-muted transition-all resize-none ${
              isListening 
                ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30 animate-pulse' 
                : 'border-border focus:border-near-green/50 focus:ring-near-green/30'
            }`}
            disabled={isLoading}
          />
          
          {/* Voice input button */}
          {speechSupported && (
            <button
              onClick={toggleListening}
              disabled={isLoading || !isConnected}
              className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border transition-all flex-shrink-0 ${
                isListening
                  ? 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30'
                  : 'bg-void-gray border-border-subtle hover:border-near-green/30 hover:bg-near-green/10 text-text-muted hover:text-near-green'
              } disabled:opacity-50`}
              title={isListening ? "Stop listening" : "Voice input"}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}
          
          {isLoading ? (
            <button
              onClick={handleStop}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all flex-shrink-0"
              title="Stop generation"
            >
              <Square className="w-5 h-5 fill-current" />
            </button>
          ) : (
            <button
              onClick={() => handleSend()}
              disabled={isConnected && !input.trim() && attachedFiles.length === 0}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-near-green text-void-black hover:bg-near-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
            >
              {!isConnected ? <Wallet className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Enhancement 5: LearnProgressPath — milestone tracker for learn mode ──
const LEARN_STEPS = [
  { key: 'calibrated', label: 'Calibrated', icon: '🎯' },
  { key: 'concepts_explained', label: 'Concepts', icon: '📚' },
  { key: 'first_contract', label: 'First Build', icon: '🏗️' },
  { key: 'features_added', label: 'Features', icon: '⚡' },
  { key: 'deployed', label: 'Deployed', icon: '🚀' },
];
const STEP_ORDER = LEARN_STEPS.map(s => s.key);

function LearnProgressPath({ currentMilestone }: { currentMilestone: string | null }) {
  const currentIdx = currentMilestone ? STEP_ORDER.indexOf(currentMilestone) : -1;
  return (
    <div className="flex items-center gap-1 px-3 py-2 overflow-x-auto">
      {LEARN_STEPS.map((step, i) => {
        const done = i <= currentIdx;
        const active = i === currentIdx + 1;
        return (
          <div key={step.key} className="flex items-center gap-1 flex-shrink-0">
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono transition-all ${
              done ? 'bg-near-green/20 text-near-green border border-near-green/30' :
              active ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25 animate-pulse' :
              'bg-white/5 text-text-muted/40 border border-white/5'
            }`}>
              <span>{step.icon}</span>
              <span className="hidden sm:inline">{step.label}</span>
            </div>
            {i < LEARN_STEPS.length - 1 && (
              <div className={`w-3 h-px flex-shrink-0 ${done ? 'bg-near-green/40' : 'bg-white/10'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── PersonaSwitcherChip — inline specialist selector in the chat toolbar ──
function PersonaSwitcherChip({
  currentPersonaId,
  onSwitch,
}: {
  currentPersonaId: string;
  onSwitch: (personaId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const persona = getPersona(currentPersonaId);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${persona.borderColor} ${persona.bgColor} hover:opacity-90 transition-all text-xs`}
        title="Switch specialist"
      >
        <span>{persona.emoji}</span>
        <span className={`font-medium ${persona.color} hidden sm:inline`}>{persona.name}</span>
        <ChevronDown className="w-3 h-3 text-text-muted" />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          {/* Dropdown */}
          <div className="absolute bottom-full right-0 mb-2 w-60 bg-[#0d0d0d] border border-border-subtle rounded-xl shadow-2xl p-2 z-50">
            <p className="text-[10px] text-text-muted px-2 pb-1.5 font-mono uppercase tracking-wider border-b border-white/[0.06] mb-1.5">
              Switch Specialist
            </p>
            {PERSONA_LIST.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  onSwitch(p.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg transition-all text-left ${
                  p.id === currentPersonaId
                    ? `${p.bgColor} border ${p.borderColor}`
                    : 'hover:bg-white/[0.04]'
                }`}
              >
                <span className="text-lg flex-shrink-0">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <span className={`text-sm font-medium block ${p.id === currentPersonaId ? p.color : 'text-text-primary'}`}>
                    {p.name}
                  </span>
                  <p className="text-[10px] text-text-muted truncate">{p.role}</p>
                </div>
                {p.id === currentPersonaId && (
                  <Sparkles className="w-3 h-3 text-near-green flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
