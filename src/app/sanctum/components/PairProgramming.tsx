'use client';

import { useState, useEffect } from 'react';
import { Users, Copy, Check, Link2, Crown, Eye, Code2 } from 'lucide-react';

interface PairProgrammingProps {
  sessionId: string;
  onClose: () => void;
}

interface Collaborator {
  id: string;
  name: string;
  color: string;
  cursor?: { line: number; column: number };
  isOwner?: boolean;
  isActive: boolean;
}

const COLORS = [
  '#8b5cf6', // purple
  '#06b6d4', // cyan  
  '#22c55e', // green
  '#f59e0b', // amber
  '#ec4899', // pink
  '#3b82f6', // blue
];

export function PairProgramming({ sessionId, onClose }: PairProgrammingProps) {
  const [copied, setCopied] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { id: 'owner', name: 'You', color: COLORS[0], isOwner: true, isActive: true },
  ]);
  const [shareUrl, setShareUrl] = useState('');
  const [mode, setMode] = useState<'edit' | 'view'>('edit');

  // Generate share URL
  useEffect(() => {
    const url = `${window.location.origin}/sanctum/pair/${sessionId}`;
    setShareUrl(url);
  }, [sessionId]);

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulate collaborator joining (demo)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Add a fake collaborator for demo
      if (collaborators.length === 1 && Math.random() > 0.5) {
        setCollaborators(prev => [...prev, {
          id: 'demo',
          name: 'Demo Builder',
          color: COLORS[1],
          isActive: true,
          cursor: { line: 5, column: 10 },
        }]);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [collaborators.length]);

  // Simulate cursor movement
  useEffect(() => {
    const interval = setInterval(() => {
      setCollaborators(prev => prev.map(c => {
        if (c.id !== 'owner' && c.isActive) {
          return {
            ...c,
            cursor: {
              line: Math.floor(Math.random() * 20) + 1,
              column: Math.floor(Math.random() * 40) + 1,
            },
          };
        }
        return c;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-void-darker border border-void-purple/30 rounded-2xl w-full max-w-2xl shadow-2xl shadow-void-purple/20">
        {/* Header */}
        <div className="px-6 py-4 border-b border-void-purple/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Pair Programming</h3>
              <p className="text-sm text-gray-400">Build together in real-time</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Share Link */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Share this link to invite collaborators:</label>
            <div className="flex gap-2">
              <div className="flex-1 bg-void-black/50 border border-void-purple/20 rounded-lg px-4 py-3 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-gray-500" />
                <code className="text-sm text-void-cyan truncate">{shareUrl}</code>
              </div>
              <button
                onClick={copyShareLink}
                className="px-4 py-2 bg-void-purple/20 hover:bg-void-purple/30 text-void-purple rounded-lg transition-colors flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Collaborators */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-gray-400">Collaborators ({collaborators.length})</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMode('edit')}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors flex items-center gap-1 ${
                    mode === 'edit'
                      ? 'bg-void-purple text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Code2 className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => setMode('view')}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors flex items-center gap-1 ${
                    mode === 'view'
                      ? 'bg-void-purple text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Eye className="w-3 h-3" /> View Only
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {collaborators.map((collab) => (
                <div
                  key={collab.id}
                  className="flex items-center justify-between p-3 bg-void-black/30 border border-void-purple/20 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: collab.color }}
                    >
                      {collab.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{collab.name}</span>
                        {collab.isOwner && (
                          <Crown className="w-3 h-3 text-amber-400" />
                        )}
                      </div>
                      {collab.cursor && (
                        <span className="text-xs text-gray-500">
                          Line {collab.cursor.line}, Col {collab.cursor.column}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        collab.isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-600'
                      }`}
                    />
                    <span className="text-xs text-gray-500">
                      {collab.isActive ? 'Active' : 'Idle'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Session Info */}
          <div className="bg-gradient-to-r from-void-purple/10 to-void-cyan/10 rounded-lg p-4 border border-void-purple/20">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🤝</span>
              <div>
                <h4 className="text-sm font-medium text-white mb-1">Real-time Collaboration</h4>
                <p className="text-xs text-gray-400">
                  {mode === 'edit' 
                    ? 'All collaborators can edit the code. Changes sync instantly.'
                    : 'Collaborators can view but not edit. Perfect for code reviews.'}
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              Live cursor tracking
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              Instant sync
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              Chat (coming soon)
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              Voice (coming soon)
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-void-purple/20 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-void-purple/20 hover:bg-void-purple/30 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Generate a random session ID
export function generateSessionId(): string {
  return `pair_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
