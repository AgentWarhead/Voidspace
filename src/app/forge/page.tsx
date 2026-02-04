'use client';

import { useState } from 'react';
import { Container } from '@/components/ui';
import { GradientText } from '@/components/effects/GradientText';
import { GridPattern } from '@/components/effects/GridPattern';
import { CategoryPicker } from './components/CategoryPicker';
import { ForgeChat } from './components/ForgeChat';
import { CodePreview } from './components/CodePreview';
import { TokenCounter } from './components/TokenCounter';

export default function ForgePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [tokensUsed, setTokensUsed] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(50000); // Demo balance

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setSessionStarted(true);
  };

  const handleCustomStart = () => {
    if (customPrompt.trim()) {
      setSelectedCategory('custom');
      setSessionStarted(true);
    }
  };

  const handleTokensUsed = (input: number, output: number) => {
    const total = input + output;
    setTokensUsed(prev => prev + total);
    setTokenBalance(prev => prev - total);
  };

  return (
    <div className="min-h-screen bg-void-black">
      {/* Hero Section */}
      {!sessionStarted && (
        <section className="relative overflow-hidden py-16 sm:py-24">
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0,236,151,0.06) 0%, transparent 70%)',
            }}
          />
          <GridPattern className="opacity-20" />
          <Container size="xl" className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-near-green/10 border border-near-green/20 mb-6">
              <span className="text-near-green text-sm font-mono">FORGE IDE</span>
              <span className="text-text-muted text-sm">by Voidspace</span>
            </div>
            
            <GradientText as="h1" className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">
              Build Smart Contracts
              <br />
              <span className="text-near-green">By Talking</span>
            </GradientText>
            
            <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-12">
              AI-powered contract development for NEAR Protocol. Pick what you want to build,
              chat with the AI, learn as you go, deploy in minutes. No coding required.
            </p>

            {/* Category Picker */}
            <CategoryPicker 
              onSelect={handleCategorySelect}
              customPrompt={customPrompt}
              setCustomPrompt={setCustomPrompt}
              onCustomStart={handleCustomStart}
            />
          </Container>
        </section>
      )}

      {/* Build Session */}
      {sessionStarted && (
        <div className="flex h-[calc(100vh-64px)]">
          {/* Left Panel - Chat */}
          <div className="w-1/2 border-r border-border-subtle flex flex-col">
            <div className="p-4 border-b border-border-subtle bg-void-gray/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-text-primary">
                    🔥 Building: {selectedCategory === 'custom' ? 'Custom Project' : selectedCategory}
                  </h2>
                  <p className="text-sm text-text-muted">Chat with Forge to build your contract</p>
                </div>
                <TokenCounter 
                  tokensUsed={tokensUsed} 
                  tokenBalance={tokenBalance}
                />
              </div>
            </div>
            
            <ForgeChat 
              category={selectedCategory}
              customPrompt={customPrompt}
              onCodeGenerated={setGeneratedCode}
              onTokensUsed={handleTokensUsed}
            />
          </div>

          {/* Right Panel - Code Preview */}
          <div className="w-1/2 flex flex-col bg-void-gray/30">
            <div className="p-4 border-b border-border-subtle">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-text-primary">📄 Contract Preview</h2>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-sm bg-void-gray hover:bg-void-gray/80 rounded-lg border border-border-subtle transition-colors">
                    📋 Copy
                  </button>
                  <button className="px-3 py-1.5 text-sm bg-near-green/20 hover:bg-near-green/30 text-near-green rounded-lg border border-near-green/30 transition-colors">
                    🚀 Deploy
                  </button>
                </div>
              </div>
            </div>
            
            <CodePreview code={generatedCode} />
          </div>
        </div>
      )}
    </div>
  );
}
