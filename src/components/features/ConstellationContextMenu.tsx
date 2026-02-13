'use client';

import { useEffect, useRef, useState } from 'react';
import { Network, ExternalLink, Copy, Search } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  nodeId: string;
  isCenter: boolean;
  isExpanded: boolean;
  onExpand: () => void;
  onClose: () => void;
}

export function ConstellationContextMenu({ x, y, nodeId, isCenter, isExpanded, onExpand, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: x, top: y });

  // Measure menu after render and reposition if it overflows viewport
  useEffect(() => {
    if (!menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    const padding = 8; // px from edge
    let newLeft = x;
    let newTop = y;

    // Flip left if overflowing right edge
    if (x + rect.width > window.innerWidth - padding) {
      newLeft = Math.max(padding, x - rect.width);
    }
    // Flip up if overflowing bottom edge
    if (y + rect.height > window.innerHeight - padding) {
      newTop = Math.max(padding, y - rect.height);
    }

    setPosition({ left: newLeft, top: newTop });
  }, [x, y]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(nodeId);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = nodeId;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    onClose();
  };

  const handleAnalyze = () => {
    window.location.href = `/observatory?tool=void-lens&address=${encodeURIComponent(nodeId)}`;
    onClose();
  };

  const handleNearBlocks = () => {
    window.open(`https://nearblocks.io/address/${encodeURIComponent(nodeId)}`, '_blank');
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-[60] min-w-[200px] bg-black/95 border border-gray-600 rounded-lg shadow-2xl backdrop-blur-md py-1 animate-in fade-in zoom-in-95 duration-150"
      style={{ left: position.left, top: position.top }}
    >
      <div className="px-3 py-2 border-b border-gray-700">
        <p className="text-xs text-cyan-400 font-mono truncate" title={nodeId}>{nodeId}</p>
      </div>

      {!isCenter && (
        <button
          onClick={() => { onExpand(); onClose(); }}
          disabled={isExpanded}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Network className="w-4 h-4 text-purple-400" />
          {isExpanded ? 'Already Expanded' : 'Expand Network'}
        </button>
      )}

      <button
        onClick={handleAnalyze}
        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:bg-white/10 transition-colors"
      >
        <Search className="w-4 h-4 text-cyan-400" />
        Analyze in Void Lens
      </button>

      <button
        onClick={handleNearBlocks}
        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:bg-white/10 transition-colors"
      >
        <ExternalLink className="w-4 h-4 text-green-400" />
        View on NearBlocks
      </button>

      <div className="border-t border-gray-700 my-1" />

      <button
        onClick={handleCopy}
        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:bg-white/10 transition-colors"
      >
        <Copy className="w-4 h-4 text-gray-400" />
        Copy Address
      </button>
    </div>
  );
}
