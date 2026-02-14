'use client';

import { useState, useRef, useEffect } from 'react';
import { Code2, Rocket, Share2, GitCompare, Play, Users, Globe, FolderTree, Wrench, ChevronDown, Check } from 'lucide-react';
import { DownloadButton } from './DownloadContract';
import { FileStructureToggle } from './FileStructure';
import { ProjectManager } from './ProjectManager';

interface ContractToolbarProps {
  generatedCode: string;
  selectedCategory: string | null;
  sanctumStage: string;
  mode: string;
  showFileStructure: boolean;
  isThinking: boolean;
  dispatch: (action: any) => void;
  handleDeploy: () => void;
  handleShare: () => void;
  onLoadProject: (project: any) => void;
}

// Dropdown menu component with click-outside handling
function ToolbarDropdown({ 
  trigger, 
  children, 
  align = 'right' 
}: { 
  trigger: React.ReactNode; 
  children: React.ReactNode; 
  align?: 'left' | 'right';
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div className={`absolute top-full mt-2 ${align === 'right' ? 'right-0' : 'left-0'} z-50 min-w-[200px] py-1.5 bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/[0.1] rounded-xl shadow-2xl shadow-black/50 animate-in fade-in slide-in-from-top-2 duration-200`}>
          {children}
        </div>
      )}
    </div>
  );
}

function DropdownItem({ 
  icon: Icon, 
  label, 
  description,
  onClick, 
  disabled = false,
  color = 'white'
}: { 
  icon: any; 
  label: string; 
  description?: string;
  onClick: () => void; 
  disabled?: boolean;
  color?: string;
}) {
  const colorClasses: Record<string, string> = {
    white: 'hover:bg-white/[0.08] text-text-secondary hover:text-white',
    green: 'hover:bg-green-500/10 text-text-secondary hover:text-green-400',
    blue: 'hover:bg-blue-500/10 text-text-secondary hover:text-blue-400',
    purple: 'hover:bg-purple-500/10 text-text-secondary hover:text-purple-400',
    cyan: 'hover:bg-cyan-500/10 text-text-secondary hover:text-cyan-400',
    pink: 'hover:bg-pink-500/10 text-text-secondary hover:text-pink-400',
  };

  return (
    <button
      className={`w-full px-3 py-2 text-left text-sm flex items-center gap-3 transition-all ${colorClasses[color] || colorClasses.white} ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <div className="flex flex-col">
        <span className="font-medium text-[13px]">{label}</span>
        {description && <span className="text-[11px] text-text-muted/60">{description}</span>}
      </div>
    </button>
  );
}

function DropdownDivider() {
  return <div className="my-1.5 border-t border-white/[0.06]" />;
}

// Tooltip wrapper
function Tooltip({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-[11px] font-medium text-white bg-[#1a1a2e]/95 border border-white/[0.1] rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 shadow-lg">
        {label}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-[#1a1a2e]/95" />
      </div>
    </div>
  );
}

export function ContractToolbar({
  generatedCode,
  selectedCategory,
  sanctumStage,
  mode,
  showFileStructure,
  isThinking,
  dispatch,
  handleDeploy,
  handleShare,
  onLoadProject,
}: ContractToolbarProps) {
  const hasCode = !!generatedCode;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-1.5">
      {/* --- Quick Actions (always visible, icon-only with tooltips) --- */}
      
      {/* Copy Code */}
      <Tooltip label={copied ? "Copied!" : "Copy code"}>
        <button
          className={`p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed ${copied ? 'text-green-400 bg-green-500/10' : 'text-text-muted hover:text-white hover:bg-white/[0.08]'}`}
          onClick={handleCopy}
          disabled={!hasCode}
        >
          {copied ? <Check className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
        </button>
      </Tooltip>

      {/* Download */}
      <DownloadButton code={generatedCode} contractName={selectedCategory || 'contract'} category={selectedCategory || undefined} />

      {/* Share */}
      <Tooltip label="Share contract">
        <button
          className="p-2 text-text-muted hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={handleShare}
          disabled={!hasCode}
        >
          <Share2 className="w-4 h-4" />
        </button>
      </Tooltip>

      {/* --- Tools Dropdown --- */}
      <ToolbarDropdown
        trigger={
          <Tooltip label="Tools">
            <button className="p-2 text-text-muted hover:text-white hover:bg-white/[0.08] rounded-lg transition-all flex items-center gap-0.5">
              <Wrench className="w-4 h-4" />
              <ChevronDown className="w-3 h-3 opacity-50" />
            </button>
          </Tooltip>
        }
      >
        <div className="px-3 py-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted/50">Code</span>
        </div>
        <DropdownItem
          icon={FolderTree}
          label="File Structure"
          description="View project layout"
          onClick={() => dispatch({ type: 'SET_SHOW_FILE_STRUCTURE', payload: !showFileStructure })}
          disabled={!hasCode}
          color="white"
        />
        <DropdownItem
          icon={GitCompare}
          label="Compare Versions"
          description="Diff against previous"
          onClick={() => dispatch({ type: 'SET_SHOW_COMPARISON', payload: true })}
          disabled={!hasCode}
          color="blue"
        />
        <DropdownDivider />
        <div className="px-3 py-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted/50">Develop</span>
        </div>
        <DropdownItem
          icon={Play}
          label="Sandbox"
          description="Simulate & test contract"
          onClick={() => dispatch({ type: 'SET_SHOW_SIMULATION', payload: true })}
          disabled={!hasCode}
          color="green"
        />
        <DropdownItem
          icon={Users}
          label="Pair Programming"
          description="Collaborative mode"
          onClick={() => dispatch({ type: 'SET_SHOW_PAIR_PROGRAMMING', payload: true })}
          color="pink"
        />
      </ToolbarDropdown>

      {/* Project Manager (already has its own UI/dropdown) */}
      <ProjectManager
        code={generatedCode}
        category={selectedCategory}
        mode={mode}
        onLoadProject={onLoadProject}
      />

      {/* Separator */}
      <div className="w-px h-6 bg-white/[0.08] mx-1" />

      {/* --- Primary Actions (prominent, labeled) --- */}
      
      {/* Deploy */}
      <button
        className="px-3.5 py-1.5 text-sm font-medium bg-near-green/15 hover:bg-near-green/25 text-near-green rounded-lg border border-near-green/25 hover:border-near-green/40 transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-near-green/10"
        onClick={handleDeploy}
        disabled={!hasCode || sanctumStage === 'thinking'}
        title="Deploy to NEAR testnet"
      >
        <Rocket className="w-3.5 h-3.5" />
        Deploy
      </button>

      {/* Webapp */}
      <button
        className="px-3.5 py-1.5 text-sm font-medium bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 rounded-lg border border-cyan-500/25 hover:border-cyan-500/40 transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyan-500/10"
        onClick={() => dispatch({ type: 'SET_SHOW_WEBAPP_BUILDER', payload: true })}
        disabled={!hasCode}
        title="Generate a frontend webapp for this contract"
      >
        <Globe className="w-3.5 h-3.5" />
        Webapp
      </button>
    </div>
  );
}
