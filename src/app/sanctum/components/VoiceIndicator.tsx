'use client';

import { useEffect, useState } from 'react';

interface VoiceIndicatorProps {
  isListening: boolean;
  interimText?: string;
}

export function VoiceIndicator({ isListening, interimText }: VoiceIndicatorProps) {
  const [bars, setBars] = useState([0.3, 0.5, 0.7, 0.5, 0.3]);
  
  useEffect(() => {
    if (!isListening) return;
    
    const interval = setInterval(() => {
      setBars(prev => prev.map(() => 0.2 + Math.random() * 0.8));
    }, 100);
    
    return () => clearInterval(interval);
  }, [isListening]);

  if (!isListening) return null;

  return (
    <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 animate-pulse">
      {/* Waveform visualization */}
      <div className="flex items-center gap-1 h-8">
        {bars.map((height, i) => (
          <div
            key={i}
            className="w-1 bg-red-500 rounded-full transition-all duration-100"
            style={{ height: `${height * 32}px` }}
          />
        ))}
      </div>
      
      {/* Status text */}
      <div className="text-red-400 text-sm font-medium flex items-center gap-2">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        Listening...
      </div>
      
      {/* Live transcript preview */}
      {interimText && (
        <div className="text-text-muted text-sm italic max-w-md text-center">
          &ldquo;{interimText}&rdquo;
        </div>
      )}
      
      {/* Instructions */}
      <div className="text-text-muted text-xs">
        Speak your idea • Pauses auto-send • Click mic to stop
      </div>
    </div>
  );
}
