'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Sparkles, Loader2, Code2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  code?: string | null;
  codeLines?: number;
  timestamp: Date;
}

// Quick actions are consumed by the parent toolbar in Build Studio.
// They're exported here so ScratchWebappSession can reference them.
export const QUICK_ACTIONS = [
  { label: '🔗 Add wallet connect', icon: '🔗', value: 'Add NEAR wallet connection using @hot-labs/near-connect' },
  { label: '📱 Make responsive', icon: '📱', value: 'Make the layout fully responsive for mobile, tablet, and desktop' },
  { label: '🌙 Dark mode', icon: '🌙', value: 'Add a dark/light mode toggle with system preference detection' },
  { label: '✨ Add animations', icon: '✨', value: 'Add smooth animations and transitions using Tailwind and CSS' },
  { label: '📊 Add charts', icon: '📊', value: 'Add data visualization charts for displaying on-chain data' },
  { label: '🚀 Deploy ready', icon: '🚀', value: 'Make the project production-ready with proper error handling, loading states, and SEO' },
  { label: '⛓️ NEAR contract calls', icon: '⛓️', value: 'Add functions to call NEAR smart contract methods (both view and change methods) with proper error handling, gas estimation, and transaction status display' },
  { label: '🪙 Token balance', icon: '🪙', value: 'Add a token balance display component that shows NEP-141 fungible token balances, NEAR native balance, and token metadata with formatted amounts and token icons' },
];

interface ScratchWebappChatProps {
  initialPrompt?: string;
  onCodeUpdate: (code: string) => void;
  onTokensUsed?: (input: number, output: number) => void;
  /** Compact mode — used inside the Build Studio sidebar */
  compact?: boolean;
  /** External message injected from toolbar quick-actions */
  externalMessage?: string;
  externalMessageSeq?: number;
}

export function ScratchWebappChat({
  initialPrompt,
  onCodeUpdate,
  onTokensUsed,
  compact = false,
  externalMessage,
  externalMessageSeq,
}: ScratchWebappChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initialSent = useRef(false);
  const prevExtSeq = useRef<number | undefined>(undefined);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsGenerating(true);

    try {
      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content:
          m.role === 'assistant' && m.code
            ? `${m.content}\n\n\`\`\`tsx\n${m.code}\n\`\`\``
            : m.content,
      }));

      const res = await fetch('/api/sanctum/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          category: 'scratch-webapp',
          mode: 'build',
          personaId: 'prism',
        }),
      });

      if (!res.ok) throw new Error('Chat request failed');

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.content || 'Here is what I built for you.',
        code: data.code || null,
        codeLines: data.code ? data.code.split('\n').length : undefined,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (data.code) {
        onCodeUpdate(data.code);
      }

      if (data.usage && onTokensUsed) {
        onTokensUsed(data.usage.input, data.usage.output);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: '⚠️ Something went wrong. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  }, [messages, isGenerating, onCodeUpdate, onTokensUsed]);

  // Send initial prompt on mount
  useEffect(() => {
    if (initialPrompt && !initialSent.current) {
      initialSent.current = true;
      sendMessage(initialPrompt);
    }
  }, [initialPrompt, sendMessage]);

  // Handle external message injection from toolbar quick-actions
  useEffect(() => {
    if (
      externalMessage &&
      externalMessageSeq !== undefined &&
      externalMessageSeq !== prevExtSeq.current
    ) {
      prevExtSeq.current = externalMessageSeq;
      sendMessage(externalMessage);
    }
  }, [externalMessage, externalMessageSeq, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── Messages ─────────────────────────────────────────────── */}
      <div className={`flex-1 overflow-y-auto space-y-2 ${compact ? 'p-3' : 'p-4 space-y-4'}`}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
            <Sparkles className={`text-emerald-400 mb-3 ${compact ? 'w-6 h-6' : 'w-8 h-8'}`} />
            <p className={`text-text-muted ${compact ? 'text-xs' : 'text-sm'}`}>
              {compact
                ? 'Building your app…'
                : 'Describe your webapp idea and I\'ll build it'}
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {compact ? (
              /* ── Compact message bubble ─────────────────────── */
              <div
                className={`max-w-[90%] rounded-xl px-3 py-2 ${
                  msg.role === 'user'
                    ? 'bg-emerald-500/20 border border-emerald-500/30 text-text-primary'
                    : 'bg-white/[0.04] border border-white/[0.06] text-text-secondary'
                }`}
              >
                <div className="text-xs leading-snug whitespace-pre-wrap line-clamp-6">
                  {msg.content}
                </div>
                {/* Compact code indicator — never show full code block */}
                {msg.code && (
                  <div className="mt-1.5 flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                    <Code2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    <span className="text-[10px] text-emerald-400 font-mono">
                      Code updated · {msg.codeLines ?? '?'} lines
                    </span>
                  </div>
                )}
              </div>
            ) : (
              /* ── Full message bubble (non-compact) ─────────── */
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-emerald-500/20 border border-emerald-500/30 text-text-primary'
                    : 'bg-white/[0.05] border border-white/[0.08] text-text-secondary'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                {msg.code && (
                  <div className="mt-3 p-2 rounded-lg bg-void-black/50 border border-white/[0.06]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-emerald-400/60 uppercase">
                        Generated Code
                      </span>
                      <button
                        onClick={() => navigator.clipboard.writeText(msg.code ?? '')}
                        className="text-[10px] text-text-muted hover:text-emerald-400 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                    <pre className="text-xs text-text-muted overflow-x-auto max-h-32">
                      <code>
                        {msg.code.slice(0, 500)}
                        {msg.code.length > 500 ? '…' : ''}
                      </code>
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {isGenerating && (
          <div className="flex justify-start">
            <div
              className={`bg-white/[0.05] border border-white/[0.08] rounded-xl ${
                compact ? 'px-3 py-2' : 'rounded-2xl px-4 py-3'
              }`}
            >
              <div
                className={`flex items-center gap-2 text-emerald-400 ${
                  compact ? 'text-xs' : 'text-sm'
                }`}
              >
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {compact ? 'Building…' : 'Building your webapp…'}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ────────────────────────────────────────────────── */}
      <div className={`flex-shrink-0 border-t border-white/[0.08] ${compact ? 'p-2.5' : 'p-4'}`}>
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={compact ? 'Iterate…' : 'Describe what you want to build…'}
            rows={1}
            className={`flex-1 bg-white/[0.05] border border-white/[0.1] rounded-xl text-text-primary placeholder-text-muted/50 resize-none focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all ${
              compact ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm'
            }`}
            style={{ minHeight: compact ? '36px' : '44px', maxHeight: '120px' }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isGenerating}
            className={`rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 flex items-center justify-center ${
              compact ? 'p-2 min-h-[36px] min-w-[36px]' : 'p-3 min-h-[44px] min-w-[44px]'
            }`}
          >
            <Send className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          </button>
        </div>
      </div>
    </div>
  );
}
