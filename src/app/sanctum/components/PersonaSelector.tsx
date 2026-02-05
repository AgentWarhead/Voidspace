'use client';

import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { PERSONA_LIST, Persona } from '../lib/personas';

interface PersonaSelectorProps {
  currentPersona: Persona;
  onSelect: (persona: Persona) => void;
  disabled?: boolean;
}

export function PersonaSelector({ currentPersona, onSelect, disabled }: PersonaSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Current persona button */}
      <button
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
        <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full left-0 mt-2 w-72 bg-surface border border-border rounded-xl shadow-xl z-50 overflow-hidden">
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
                  className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all hover:bg-surface-hover ${
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
        </>
      )}
    </div>
  );
}
