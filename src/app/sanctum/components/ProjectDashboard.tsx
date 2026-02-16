'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Clock, Zap, ChevronRight, Star } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  phase: 'ideation' | 'contract' | 'deploy' | 'webapp' | 'launched';
  progress: number;
  tokensSpent: number;
  timeInvested: number; // minutes
  contractCode?: string;
  contractAddress?: string;
  webappCode?: string;
  webappUrl?: string;
  starred?: boolean;
}

interface ProjectDashboardProps {
  onSelectProject: (project: Project) => void;
  onNewProject: () => void;
}

const PHASES = [
  { id: 'ideation', label: 'Ideation', emoji: '💡', color: 'purple' },
  { id: 'contract', label: 'Contract', emoji: '📜', color: 'amber' },
  { id: 'deploy', label: 'Deploy', emoji: '🚀', color: 'cyan' },
  { id: 'webapp', label: 'Webapp', emoji: '🌐', color: 'green' },
  { id: 'launched', label: 'Launched', emoji: '🎉', color: 'pink' },
];

const STORAGE_KEY = 'voidspace_projects';

export function ProjectDashboard({ onSelectProject, onNewProject }: ProjectDashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'launched' | 'starred'>('all');

  // Load projects from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProjects(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse projects:', e);
      }
    } else {
      // Add demo project
      const demoProject: Project = {
        id: 'demo-1',
        name: 'NFT Marketplace',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        phase: 'webapp',
        progress: 75,
        tokensSpent: 12450,
        timeInvested: 262,
        contractCode: '// Demo contract code',
        contractAddress: 'nft-market.testnet',
        starred: true,
      };
      setProjects([demoProject]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([demoProject]));
    }
  }, []);

  const toggleStar = (id: string) => {
    const updated = projects.map(p => 
      p.id === id ? { ...p, starred: !p.starred } : p
    );
    setProjects(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const filteredProjects = projects.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'active') return p.phase !== 'launched';
    if (filter === 'launched') return p.phase === 'launched';
    if (filter === 'starred') return p.starred;
    return true;
  });

  const getPhaseIndex = (phase: string) => PHASES.findIndex(p => p.id === phase);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const getRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="bg-void-darker border border-void-purple/30 rounded-2xl overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div className="px-3 sm:px-6 py-4 border-b border-void-purple/20 bg-gradient-to-r from-void-purple/10 to-cyan-500/10">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🔮</span>
              My Projects
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Track your journey from idea to launch</p>
          </div>
          <button
            onClick={onNewProject}
            className="px-3 sm:px-4 py-2 min-h-[44px] bg-cyan-500 hover:bg-cyan-600 text-black font-medium rounded-lg transition-colors flex items-center gap-2 flex-shrink-0 text-sm sm:text-base"
          >
            <span>+</span>
            New Project
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-3 sm:px-6 py-3 border-b border-void-purple/20 bg-void-black/30">
        <div className="flex gap-2 overflow-x-auto">
          {(['all', 'active', 'launched', 'starred'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 min-h-[44px] text-sm rounded-lg transition-colors flex-shrink-0 ${
                filter === f
                  ? 'bg-void-purple/20 text-white'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {f === 'starred' ? '⭐ ' : ''}{f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Project List */}
      <div className="max-h-[500px] overflow-auto">
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
            <p className="text-gray-500 mb-6">Start your first project and build something amazing!</p>
            <button
              onClick={onNewProject}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-medium rounded-lg transition-colors"
            >
              Create First Project
            </button>
          </div>
        ) : (
          <div className="divide-y divide-void-purple/10">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="p-3 sm:p-4 hover:bg-void-purple/5 transition-colors"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Project Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-void-purple to-cyan-500 flex items-center justify-center text-2xl flex-shrink-0">
                    {PHASES[getPhaseIndex(project.phase)]?.emoji || '📦'}
                  </div>

                  {/* Project Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white truncate">{project.name}</h3>
                      {project.starred && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                      {project.phase === 'launched' && (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                          LIVE 🎉
                        </span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="hidden sm:flex items-center gap-2 mb-1">
                        {PHASES.map((phase, i) => (
                          <div key={phase.id} className="flex items-center">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                i <= getPhaseIndex(project.phase)
                                  ? 'bg-cyan-500 text-white'
                                  : 'bg-void-gray text-gray-600'
                              }`}
                            >
                              {i < getPhaseIndex(project.phase) ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                phase.emoji
                              )}
                            </div>
                            {i < PHASES.length - 1 && (
                              <div
                                className={`w-8 h-0.5 mx-1 ${
                                  i < getPhaseIndex(project.phase)
                                    ? 'bg-cyan-500'
                                    : 'bg-void-gray'
                                }`}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="h-1 bg-void-gray rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-void-purple to-cyan-500 transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {project.tokensSpent.toLocaleString()} tokens
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(project.timeInvested)}
                      </span>
                      <span>Updated {getRelativeTime(project.updatedAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => toggleStar(project.id)}
                      className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-500 hover:text-amber-400 transition-colors rounded-lg hover:bg-white/5"
                    >
                      <Star className={`w-4 h-4 ${project.starred ? 'text-amber-400 fill-amber-400' : ''}`} />
                    </button>
                    <button
                      onClick={() => onSelectProject(project)}
                      className="px-3 py-1.5 min-h-[44px] bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors text-sm flex items-center gap-1"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
                    >
                      <span>🗑️</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {projects.length > 0 && (
        <div className="px-3 sm:px-6 py-3 border-t border-void-purple/20 bg-void-black/30">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
            <span>
              {projects.filter(p => p.phase === 'launched').length} launched •{' '}
              {projects.filter(p => p.phase !== 'launched').length} in progress
            </span>
            <span>
              Total: {projects.reduce((sum, p) => sum + p.tokensSpent, 0).toLocaleString()} tokens spent
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper to save/update a project
export function saveProject(project: Partial<Project> & { id: string }): Project {
  const stored = localStorage.getItem(STORAGE_KEY);
  const existing: Project[] = stored ? JSON.parse(stored) : [];
  
  const existingIndex = existing.findIndex(p => p.id === project.id);
  
  if (existingIndex >= 0) {
    // Update existing
    existing[existingIndex] = { ...existing[existingIndex], ...project, updatedAt: new Date().toISOString() };
  } else {
    // Add new
    const newProject: Project = {
      ...project,
      name: project.name || 'Untitled Project',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      phase: project.phase || 'ideation',
      progress: project.progress || 0,
      tokensSpent: project.tokensSpent || 0,
      timeInvested: project.timeInvested || 0,
    };
    existing.unshift(newProject);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  return existing[existingIndex >= 0 ? existingIndex : 0];
}
