'use client';

import { useMemo } from 'react';

interface ContractDNAProps {
  code: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

// Generate a unique visual "DNA" fingerprint from contract code
export function ContractDNA({ code, size = 'md', showLabel = true }: ContractDNAProps) {
  const dna = useMemo(() => {
    if (!code) return null;
    
    // Hash the code to generate consistent colors/patterns
    const hash = simpleHash(code);
    const segments = generateSegments(hash, code);
    
    return {
      hash: hash.toString(16).slice(0, 8),
      segments,
      complexity: calculateComplexity(code),
      functions: (code.match(/pub fn/g) || []).length,
      structs: (code.match(/pub struct/g) || []).length,
    };
  }, [code]);

  if (!dna) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <div className="w-8 h-8 rounded-lg bg-void-gray/50 animate-pulse" />
        <span>No contract</span>
      </div>
    );
  }

  const sizeClasses = {
    sm: 'h-6 gap-0.5',
    md: 'h-10 gap-1',
    lg: 'h-14 gap-1.5',
  };

  const segmentWidth = {
    sm: 'w-1',
    md: 'w-1.5',
    lg: 'w-2',
  };

  return (
    <div className="flex flex-col gap-2">
      {/* DNA Visualization */}
      <div className={`flex items-end ${sizeClasses[size]}`}>
        {dna.segments.map((segment, i) => (
          <div
            key={i}
            className={`${segmentWidth[size]} rounded-full transition-all hover:scale-110`}
            style={{
              height: `${segment.height}%`,
              backgroundColor: segment.color,
              opacity: segment.opacity,
            }}
            title={segment.label}
          />
        ))}
      </div>

      {/* Label */}
      {showLabel && (
        <div className="flex items-center gap-3 text-xs">
          <code className="text-void-cyan font-mono">#{dna.hash}</code>
          <span className="text-gray-500">
            {dna.functions} fn • {dna.structs} struct • {dna.complexity} complexity
          </span>
        </div>
      )}
    </div>
  );
}

// Simple hash function for consistent results
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Generate DNA segments based on code analysis
function generateSegments(hash: number, code: string) {
  const colors = [
    '#8b5cf6', // purple - structs
    '#06b6d4', // cyan - functions
    '#22c55e', // green - near_bindgen
    '#f59e0b', // amber - storage
    '#ef4444', // red - unsafe/require
    '#ec4899', // pink - impl
    '#3b82f6', // blue - use statements
  ];

  const segments: Array<{ height: number; color: string; opacity: number; label: string }> = [];
  const lines = code.split('\n');
  
  // Sample every N lines to create ~30 segments
  const step = Math.max(1, Math.floor(lines.length / 30));
  
  for (let i = 0; i < lines.length; i += step) {
    const line = lines[i] || '';
    let color = colors[hash % colors.length];
    let height = 30 + (line.length % 70);
    let label = 'code';
    
    if (line.includes('pub struct')) {
      color = colors[0];
      height = 90;
      label = 'struct';
    } else if (line.includes('pub fn') || line.includes('fn ')) {
      color = colors[1];
      height = 80;
      label = 'function';
    } else if (line.includes('#[near_bindgen]') || line.includes('#[near]')) {
      color = colors[2];
      height = 100;
      label = 'near_bindgen';
    } else if (line.includes('env::') || line.includes('storage')) {
      color = colors[3];
      height = 70;
      label = 'storage';
    } else if (line.includes('require!') || line.includes('assert!')) {
      color = colors[4];
      height = 60;
      label = 'validation';
    } else if (line.includes('impl ')) {
      color = colors[5];
      height = 85;
      label = 'impl';
    } else if (line.includes('use ')) {
      color = colors[6];
      height = 40;
      label = 'import';
    }
    
    segments.push({
      height,
      color,
      opacity: 0.6 + (Math.random() * 0.4),
      label,
    });
    
    // Shift hash for variety
    hash = (hash * 31 + i) & 0xFFFFFFFF;
  }
  
  return segments.slice(0, 32);
}

// Calculate code complexity score
function calculateComplexity(code: string): string {
  let score = 0;
  
  // Count complexity indicators
  score += (code.match(/if |else |match /g) || []).length * 2;
  score += (code.match(/for |while |loop /g) || []).length * 3;
  score += (code.match(/pub fn/g) || []).length * 1;
  score += (code.match(/impl /g) || []).length * 2;
  score += (code.match(/unsafe/g) || []).length * 5;
  
  if (score < 10) return 'Simple';
  if (score < 25) return 'Moderate';
  if (score < 50) return 'Complex';
  return 'Advanced';
}

// Compact inline version for lists
export function ContractDNAInline({ code }: { code: string }) {
  const hash = useMemo(() => {
    if (!code) return '00000000';
    return simpleHash(code).toString(16).slice(0, 8);
  }, [code]);

  const colors = useMemo(() => {
    const h = simpleHash(code);
    return [
      `hsl(${h % 360}, 70%, 60%)`,
      `hsl(${(h * 2) % 360}, 70%, 60%)`,
      `hsl(${(h * 3) % 360}, 70%, 60%)`,
    ];
  }, [code]);

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {colors.map((color, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <code className="text-xs text-void-cyan font-mono">#{hash}</code>
    </div>
  );
}
