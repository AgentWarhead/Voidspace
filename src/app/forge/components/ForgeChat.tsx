'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2, ArrowRight, Sparkles, Lightbulb } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  code?: string;
  learnTip?: {
    title: string;
    explanation: string;
  };
  options?: {
    label: string;
    value: string;
  }[];
  tokensUsed?: {
    input: number;
    output: number;
  };
}

interface ForgeChatProps {
  category: string | null;
  customPrompt: string;
  onCodeGenerated: (code: string) => void;
  onTokensUsed: (input: number, output: number) => void;
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

export function ForgeChat({ category, customPrompt, onCodeGenerated, onTokensUsed }: ForgeChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with category-specific starter
  useEffect(() => {
    const starterMessage = CATEGORY_STARTERS[category || 'custom'] || CATEGORY_STARTERS['custom'];
    const initialMessage: Message = {
      id: 'initial',
      role: 'assistant',
      content: starterMessage,
      options: getInitialOptions(category),
    };
    setMessages([initialMessage]);

    // If custom prompt provided, auto-send it
    if (category === 'custom' && customPrompt) {
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

  async function handleSend(messageText?: string) {
    const text = messageText || input;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/forge/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          category,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        code: data.code,
        learnTip: data.learnTip,
        options: data.options,
        tokensUsed: data.usage,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Update code preview if code was generated
      if (data.code) {
        onCodeGenerated(data.code);
      }

      // Track token usage
      if (data.usage) {
        onTokensUsed(data.usage.input, data.usage.output);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleOptionClick(value: string) {
    handleSend(value);
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : ''}`}>
              {/* Avatar */}
              <div className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-near-green/20 text-near-green' 
                    : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {message.role === 'user' ? '👤' : '🐧'}
                </div>
                
                <div className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-near-green/20 border border-near-green/30'
                    : 'bg-void-gray border border-border-subtle'
                }`}>
                  {/* Message content */}
                  <p className="text-text-primary whitespace-pre-wrap">{message.content}</p>
                  
                  {/* Learn tip */}
                  {message.learnTip && (
                    <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-1">
                        <Lightbulb className="w-4 h-4" />
                        {message.learnTip.title}
                      </div>
                      <p className="text-sm text-text-secondary">{message.learnTip.explanation}</p>
                    </div>
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
      <div className="p-4 border-t border-border-subtle">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Describe what you want to build..."
            className="flex-1 px-4 py-3 rounded-xl bg-void-gray border border-border-subtle focus:border-near-green/50 focus:outline-none focus:ring-1 focus:ring-near-green/30 text-text-primary placeholder:text-text-muted"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="px-4 py-3 rounded-xl bg-near-green text-void-black hover:bg-near-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
