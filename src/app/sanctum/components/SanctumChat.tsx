'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2, ArrowRight, Sparkles, Lightbulb, Link2, X, FileText, Image, Square, Mic, MicOff } from 'lucide-react';
import { VoiceIndicator } from './VoiceIndicator';
import { PersonaSelector } from './PersonaSelector';
import { ModeSelector, ChatMode } from './ModeSelector';
import { CodeAnnotations, CodeAnnotation } from './CodeAnnotations';
import { FeatureSuggestion, FeatureSuggestionData } from './FeatureSuggestion';
import { InlineQuiz, QuizData } from './InlineQuiz';
import { NextSteps, NextStep } from './NextSteps';
import { CategoryLearnBanner } from './CategoryLearnBanner';
import { PERSONAS, Persona, getPersona } from '../lib/personas';
import { UpgradeModal } from '@/components/credits/UpgradeModal';

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
  onCodeGenerated: (code: string) => void;
  onTokensUsed: (input: number, output: number) => void;
  onTaskUpdate?: (task: CurrentTask | null) => void;
  onThinkingChange?: (thinking: boolean) => void;
  onQuizAnswer?: (correct: boolean) => void;
  onConceptLearned?: (concept: { title: string; category: string; difficulty: string }) => void;
  onUserMessage?: (text: string) => void; // for achievement checks on user messages
  sessionReset?: number; // increment to signal reset from parent
}

// --- localStorage persistence for chat ---
const CHAT_MESSAGES_KEY = 'sanctum-chat-messages';
const CHAT_PERSONA_KEY = 'sanctum-chat-persona';

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

function loadSavedPersona(): Persona | null {
  if (typeof window === 'undefined') return null;
  try {
    const id = localStorage.getItem(CHAT_PERSONA_KEY);
    if (!id) return null;
    return getPersona(id);
  } catch {
    return null;
  }
}

// Category-specific starter prompts
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

export function SanctumChat({ category, customPrompt, autoMessage, chatMode = 'learn', onChatModeChange, onCodeGenerated, onTokensUsed, onTaskUpdate, onThinkingChange, onQuizAnswer, onConceptLearned, onUserMessage, sessionReset }: SanctumChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPersona, setCurrentPersona] = useState<Persona>(() => loadSavedPersona() || PERSONAS.shade);
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
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const autoMessageSentRef = useRef(false);

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
    return () => {
      if (saveMsgTimerRef.current) clearTimeout(saveMsgTimerRef.current);
      // Flush save immediately on unmount — never lose messages
      if (typeof window !== 'undefined' && messagesRef.current.length > 0) {
        try {
          localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messagesRef.current));
        } catch { /* ignore */ }
      }
    };
  }, [messages]);

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

  // Save persona to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CHAT_PERSONA_KEY, currentPersona.id);
      } catch { /* ignore */ }
    }
  }, [currentPersona]);

  // Handle session reset from parent
  useEffect(() => {
    if (sessionReset && sessionReset > 0) {
      setMessages([]);
      messagesRestoredRef.current = false;
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(CHAT_MESSAGES_KEY);
          localStorage.removeItem(CHAT_PERSONA_KEY);
        } catch { /* ignore */ }
      }
    }
  }, [sessionReset]);

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

    // For template walkthroughs, skip the greeting — go straight to user message
    if (autoMessage && !autoMessageSentRef.current) {
      autoMessageSentRef.current = true;
      // Show the user's message immediately as a chat bubble
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: autoMessage,
      };
      setMessages([userMessage]);
      // Fire the AI response immediately (bypass handleSend to avoid re-adding the user message)
      sendToApi(autoMessage, [userMessage]);
      return;
    }

    const starterMessage = CATEGORY_STARTERS[category || 'custom'] || CATEGORY_STARTERS['custom'];
    const initialMessage: Message = {
      id: 'initial',
      role: 'assistant',
      content: starterMessage,
      personaId: currentPersona.id,
      options: getInitialOptions(category),
    };
    setMessages([initialMessage]);

    // If custom prompt provided, auto-send it
    if (category === 'custom' && customPrompt && !autoMessage) {
      setTimeout(() => {
        handleSend(customPrompt);
      }, 500);
    }
  }, [category]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function getInitialOptions(cat: string | null): { label: string; value: string }[] | undefined {
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
  async function sendToApi(text: string, contextMessages: Message[], userAttachments?: AttachedFile[]) {
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

      const response = await fetch('/api/sanctum/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: contextMessages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          category,
          personaId: currentPersona.id,
          mode: chatMode,
          attachments: userAttachments?.filter(f => f.type.startsWith('image/')),
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

      const data = await response.json();

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
        content: data.content,
        code: data.code,
        personaId: currentPersona.id,
        learnTip: data.learnTip,
        learnTips: learnTips.length > 0 ? learnTips : undefined,
        featureSuggestion: data.featureSuggestion,
        codeAnnotations: data.codeAnnotations,
        quiz: data.quiz,
        nextSteps: data.nextSteps,
        options: data.options,
        tokensUsed: data.usage,
      };

      // Notify parent about concepts from learn tips
      if (learnTips.length > 0 && onConceptLearned) {
        for (const tip of learnTips) {
          onConceptLearned({ title: tip.title, category: 'near-sdk', difficulty: 'intermediate' });
        }
      }

      setMessages(prev => [...prev, assistantMessage]);

      if (data.code) {
        onCodeGenerated(data.code);
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
        
        task.steps = task.steps.map(s => 
          s.status === 'working' ? { ...s, status: 'error', detail: 'Something went wrong' } : s
        );
        onTaskUpdate?.({ ...task });
        
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        }]);
      }
    } finally {
      setIsLoading(false);
      onThinkingChange?.(false);
      abortControllerRef.current = null;
    }
  }

  async function handleSend(messageText?: string) {
    const text = messageText || input;
    if ((!text.trim() && attachedFiles.length === 0) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
    };

    const allMessages = [...messages, userMessage];
    setMessages(allMessages);
    setInput('');
    setAttachedFiles([]);

    // Notify parent for achievement checks
    onUserMessage?.(text);

    await sendToApi(text, allMessages, userMessage.attachments);
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
    handleSend(value);
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />

      {/* Chat header with mode selector and persona selector */}
      <div className="flex-shrink-0 p-3 border-b border-border-subtle bg-void-black/30 space-y-2">
        <div className="flex items-center justify-between">
          <PersonaSelector 
            currentPersona={currentPersona}
            onSelect={setCurrentPersona}
            disabled={isLoading}
          />
          {onChatModeChange && (
            <ModeSelector
              mode={chatMode}
              onModeChange={onChatModeChange}
              disabled={isLoading}
            />
          )}
        </div>
      </div>

      {/* Category learn banner */}
      {category && (
        <CategoryLearnBanner category={category} mode={chatMode} />
      )}
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : ''}`}>
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
                
                <div className={`rounded-2xl px-4 py-3 ${
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
                  <p className="text-text-primary whitespace-pre-wrap">{message.content}</p>
                  
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

                  {/* Next steps */}
                  {message.nextSteps && (
                    <NextSteps steps={message.nextSteps} onSelect={(value) => handleSend(value)} />
                  )}
                  
                  {/* Quick options */}
                  {message.options && message.options.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleOptionClick(opt.value)}
                          className="px-3 py-1.5 text-sm bg-void-black/50 hover:bg-near-green/20 border border-border-subtle hover:border-near-green/30 rounded-lg transition-all text-text-secondary hover:text-near-green"
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
        ))}
        
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
      <div className="flex-shrink-0 p-4 border-t border-border-subtle bg-void-black/30">
        {/* Voice mode indicator */}
        {isListening && (
          <div className="mb-3">
            <VoiceIndicator isListening={isListening} interimText={interimTranscript || input} />
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
        
        <div className="flex gap-2">
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
            className="px-3 py-3 rounded-xl bg-void-gray border border-border-subtle hover:border-purple-500/30 hover:bg-purple-500/10 disabled:opacity-50 transition-all"
            title="Attach files (code, images)"
          >
            <Link2 className="w-5 h-5 text-text-muted" />
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={isListening ? "Listening..." : "Describe what you want to build..."}
            className={`flex-1 px-4 py-3 rounded-xl bg-surface border focus:outline-none focus:ring-1 text-white placeholder:text-text-muted transition-all ${
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
              disabled={isLoading}
              className={`px-3 py-3 rounded-xl border transition-all ${
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
              className="px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all"
              title="Stop generation"
            >
              <Square className="w-5 h-5 fill-current" />
            </button>
          ) : (
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() && attachedFiles.length === 0}
              className="px-4 py-3 rounded-xl bg-near-green text-void-black hover:bg-near-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
