'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { PERSONA_LIST, Persona } from '../lib/personas';

interface PersonaSelectorProps {
  currentPersona: Persona;
  onSelect: (persona: Persona) => void;
  disabled?: boolean;
}

export function PersonaSelector({ currentPersona, onSelect, disabled }: PersonaSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  // Recalculate position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
  }, [isOpen]);

  const menu = isOpen ? createPortal(
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[9998]" 
        onClick={() => setIsOpen(false)}
      />
      
      {/* Menu — portaled to body, no overflow clipping */}
      <div 
        className="fixed w-72 max-w-[calc(100vw-2rem)] bg-surface border border-border rounded-xl shadow-xl z-[9999] overflow-hidden"
        style={{ top: menuPos.top, left: menuPos.left }}
      >
        <div className="p-2 border-b border-border">
          <div className="text-xs text-text-muted uppercase tracking-wider px-2">
            Choose Your Expert
          </div>
        </div>
        
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {PERSONA_LIST.map((persona) => (
            <button
              key={persona.id}
              onClick={() => {
                onSelect(persona);
                setIsOpen(false);
              }}
              className={`w-full flex items-start gap-3 p-3 min-h-[44px] rounded-lg transition-all hover:bg-surface-hover ${
                currentPersona.id === persona.id ? persona.bgColor : ''
              }`}
            >
              <span className="text-2xl">{persona.emoji}</span>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${persona.color}`}>
                    {persona.name}
                  </span>
                  <span className="text-xs text-text-muted">
                    {persona.role}
                  </span>
                  {currentPersona.id === persona.id && (
                    <Check className="w-4 h-4 text-near-green ml-auto" />
                  )}
                </div>
                <p className="text-xs text-text-secondary mt-0.5">
                  {persona.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {persona.expertise.slice(0, 3).map((skill) => (
                    <span 
                      key={skill}
                      className="text-xs px-1.5 py-0.5 rounded bg-void-black/50 text-text-muted"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>,
    document.body
  ) : null;

  return (
    <div className="relative">
      {/* Current persona button */}
      <button
        ref={buttonRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
          disabled 
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-surface-hover cursor-pointer'
        } ${currentPersona.bgColor} ${currentPersona.borderColor}`}
      >
        <span className="text-xl">{currentPersona.emoji}</span>
        <div className="text-left">
          <div className={`text-sm font-medium ${currentPersona.color}`}>
            {currentPersona.name}
          </div>
          <div className="text-xs text-text-muted">
            {currentPersona.role}
          </div>
        </div>
        {isOpen 
          ? <ChevronUp className="w-4 h-4 text-text-muted transition-transform" />
          : <ChevronDown className="w-4 h-4 text-text-muted transition-transform" />
        }
      </button>

      {menu}
    </div>
  );
}
