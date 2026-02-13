'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  code?: string | null;
  timestamp: Date;
}

const QUICK_ACTIONS = [
  { label: '🔗 Add wallet connect', value: 'Add NEAR wallet connection using near-wallet-selector with modal UI' },
  { label: '📱 Make it responsive', value: 'Make the layout fully responsive for mobile, tablet, and desktop' },
  { label: '🌙 Add dark mode', value: 'Add a dark/light mode toggle with system preference detection' },
  { label: '✨ Add animations', value: 'Add smooth animations and transitions using Tailwind and CSS' },
  { label: '📊 Add charts', value: 'Add data visualization charts for displaying on-chain data' },
  { label: '🚀 Deploy ready', value: 'Make the project production-ready with proper error handling, loading states, and SEO' },
];

interface ScratchWebappChatProps {
  initialPrompt?: string;
  onCodeUpdate: (code: string) => void;
  onTokensUsed?: (input: number, output: number) => void;
}

export function ScratchWebappChat({ initialPrompt, onCodeUpdate, onTokensUsed }: ScratchWebappChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initialSent = useRef(false);

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
      const apiMessages = newMessages.map(m => ({
        role: m.role,
        content: m.role === 'assistant' && m.code
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
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMsg]);

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
      setMessages(prev => [...prev, errorMsg]);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
            <Sparkles className="w-8 h-8 text-amber-400 mb-3" />
            <p className="text-text-muted text-sm">Describe your webapp idea and I&apos;ll build it</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-amber-500/20 border border-amber-500/30 text-text-primary'
                : 'bg-white/[0.05] border border-white/[0.08] text-text-secondary'
            }`}>
              <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
              {msg.code && (
                <div className="mt-3 p-2 rounded-lg bg-void-black/50 border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-amber-400/60 uppercase">Generated Code</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(msg.code || '')}
                      className="text-[10px] text-text-muted hover:text-amber-400 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="text-xs text-text-muted overflow-x-auto max-h-32">
                    <code>{msg.code.slice(0, 500)}{msg.code.length > 500 ? '...' : ''}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-amber-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                Building your webapp...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length > 0 && !isGenerating && (
        <div className="flex-shrink-0 px-4 py-2 border-t border-white/[0.06]">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => sendMessage(action.value)}
                className="flex-shrink-0 px-3 py-1.5 text-xs rounded-full bg-white/[0.05] border border-white/[0.08] text-text-muted hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all whitespace-nowrap"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0 p-4 border-t border-white/[0.08]">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to build..."
            rows={1}
            className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-muted resize-none focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isGenerating}
            className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
