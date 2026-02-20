'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Code2, Rocket, Share2, GitCompare, Play, Users, FolderTree, Wrench, ChevronDown, Check, Lock, Undo2, Cloud, CloudOff, CloudCheck } from 'lucide-react';
import { DownloadButton } from './DownloadContract';
import { FileStructureToggle } from './FileStructure';
import { ProjectManager } from './ProjectManager';
import { useWallet } from '@/hooks/useWallet';
import { SANCTUM_TIERS, type SanctumTier } from '@/lib/sanctum-tiers';
import Link from 'next/link';

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
  /** Optional hint about the last AI action — drives context-aware status badge */
  lastAction?: 'generate' | 'test' | 'optimize' | 'audit';
  /** Undo last contract generation */
  onUndo?: () => void;
  /** Whether there's a previous version to undo to */
  hasUndoHistory?: boolean;
  /** Cloud save status indicator */
  cloudSaveStatus?: 'idle' | 'saving' | 'saved' | 'failed';
}

// ---------------------------------------------------------------------------
// Smart status badge — context-aware message derived from stage + code
// ---------------------------------------------------------------------------
function SmartStatusBadge({
  generatedCode,
  sanctumStage,
  isThinking,
  lastAction,
}: {
  generatedCode: string;
  sanctumStage: string;
  isThinking: boolean;
  lastAction?: string;
}) {
  const { text, className } = useMemo(() => {
    const isGenerating =
      isThinking || sanctumStage === 'thinking' || sanctumStage === 'generating';

    if (isGenerating) {
      return {
        text: '⏳ Generating…',
        className: 'text-amber-400 animate-pulse',
      };
    }

    if (!generatedCode) {
      return {
        text: '📝 Describe what you want to build',
        className: 'text-text-muted',
      };
    }

    // Derive counts from code
    const lineCount = generatedCode.split('\n').length;
    const methodCount = (generatedCode.match(/pub fn /g) || []).length;
    const testCount = (generatedCode.match(/#\[test\]/g) || []).length;

    // Explicit lastAction override
    if (lastAction === 'audit') {
      return { text: '🛡️ Audit complete — review findings above', className: 'text-red-400' };
    }
    if (lastAction === 'optimize') {
      return { text: '⚡ Optimized — review changes above', className: 'text-amber-400' };
    }
    if (lastAction === 'test' || testCount > 0) {
      return {
        text: `🧪 Tests generated — ${testCount} test case${testCount !== 1 ? 's' : ''}`,
        className: 'text-cyan-400',
      };
    }

    // Default: contract ready
    return {
      text: `✅ Contract ready — ${lineCount} line${lineCount !== 1 ? 's' : ''}, ${methodCount} method${methodCount !== 1 ? 's' : ''}`,
      className: 'text-near-green',
    };
  }, [generatedCode, sanctumStage, isThinking, lastAction]);

  return (
    <span className={`text-[11px] font-medium truncate max-w-[160px] sm:max-w-[240px] lg:max-w-none ${className}`} title={text}>
      {text}
    </span>
  );
}

// Dropdown menu component with click-outside handling + portal to escape overflow:hidden
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
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });

  // Calculate position from trigger element
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 8, left: rect.left, width: rect.width });
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={triggerRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div
          ref={dropdownRef}
          className="fixed z-[9999] min-w-[200px] py-1.5 bg-[#1a1a2e] backdrop-blur-xl border border-white/[0.1] rounded-xl shadow-2xl shadow-black/50 animate-in fade-in slide-in-from-top-2 duration-200"
          style={{
            top: pos.top,
            ...(align === 'right' 
              ? { right: typeof window !== 'undefined' ? window.innerWidth - pos.left - pos.width : 0 }
              : { left: pos.left }),
          }}
        >
          {children}
        </div>,
        document.body
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
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 text-[11px] font-medium text-white bg-[#1a1a2e] border border-white/[0.1] rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 shadow-lg z-50">
        {label}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[-1px] border-4 border-transparent border-b-[#1a1a2e]" />
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
  lastAction,
  onUndo,
  hasUndoHistory,
  cloudSaveStatus,
}: ContractToolbarProps) {
  const hasCode = !!generatedCode;
  const [copied, setCopied] = useState(false);
  const { user, isConnected } = useWallet();
  const userTier: SanctumTier = (user?.tier as SanctumTier) || 'shade';
  const canPairProgram = userTier === 'leviathan';

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col items-end gap-1.5">
      {/* Status row: smart badge + cloud save indicator */}
      <div className="flex items-center gap-2">
        {/* Smart status badge — only show when there's code or actively generating */}
        {(generatedCode || isThinking || sanctumStage === 'thinking' || sanctumStage === 'generating') && (
          <SmartStatusBadge
            generatedCode={generatedCode}
            sanctumStage={sanctumStage}
            isThinking={isThinking}
            lastAction={lastAction}
          />
        )}
        {/* Cloud save indicator — only show when user is connected */}
        {isConnected && cloudSaveStatus && cloudSaveStatus !== 'idle' && (
          <span className={`text-[10px] font-medium flex items-center gap-1 transition-opacity ${
            cloudSaveStatus === 'saving' ? 'text-blue-400 animate-pulse' :
            cloudSaveStatus === 'saved' ? 'text-near-green' :
            cloudSaveStatus === 'failed' ? 'text-amber-400' : ''
          }`} title={cloudSaveStatus === 'failed' ? 'Your contract is backed up locally' : undefined}>
            {cloudSaveStatus === 'saving' && <><Cloud className="w-3 h-3" /> Saving…</>}
            {cloudSaveStatus === 'saved' && <><CloudCheck className="w-3 h-3" /> Saved</>}
            {cloudSaveStatus === 'failed' && <><CloudOff className="w-3 h-3" /> Not saved</>}
          </span>
        )}
      </div>

      {/* Buttons row */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-end min-w-0">
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
        {canPairProgram ? (
          <DropdownItem
            icon={Users}
            label="Pair Programming"
            description="Collaborative mode"
            onClick={() => dispatch({ type: 'SET_SHOW_PAIR_PROGRAMMING', payload: true })}
            color="pink"
          />
        ) : (
          <DropdownItem
            icon={Lock}
            label="Pair Programming"
            description="Leviathan tier only"
            onClick={() => window.location.href = '/pricing'}
            color="gray"
          />
        )}
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
        className="px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-medium bg-near-green/15 hover:bg-near-green/25 text-near-green rounded-lg border border-near-green/25 hover:border-near-green/40 transition-all flex items-center gap-1.5 sm:gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-near-green/10 min-h-[36px]"
        onClick={handleDeploy}
        disabled={!hasCode || sanctumStage === 'thinking'}
        title="Get step-by-step deployment guide"
      >
        <Rocket className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Deploy</span>
      </button>

      </div>{/* end buttons row */}
    </div>
  );
}
