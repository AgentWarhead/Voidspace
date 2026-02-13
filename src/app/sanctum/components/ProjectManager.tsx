'use client';

import { useState, useEffect, useCallback } from 'react';
// @ts-ignore
import { Save, FolderOpen, Trash2, Clock, Code2, X, Loader2, ChevronRight } from 'lucide-react';
import type { SanctumProject } from '@/lib/sanctum-projects';

interface ProjectManagerProps {
  code: string;
  category?: string | null;
  mode?: string;
  onLoadProject: (project: SanctumProject) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  defi: '💰',
  nfts: '🎨',
  daos: '🏛️',
  token: '🪙',
  'ai-agents': '🤖',
  'chain-signatures': '🔐',
  custom: '⚡',
};

export function ProjectManager({ code, category, mode, onLoadProject }: ProjectManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState<SanctumProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveDescription, setSaveDescription] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/sanctum/projects');
      if (res.status === 401) {
        setError('Connect your wallet to save projects');
        setProjects([]);
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProjects(data.projects || []);
    } catch {
      setError('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (showModal) {
      fetchProjects();
    }
  }, [showModal, fetchProjects]);

  const handleSave = async () => {
    if (!saveName.trim() || !code) return;
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/sanctum/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: saveName.trim(),
          description: saveDescription.trim() || undefined,
          category: category || 'custom',
          code,
          mode: mode || 'build',
        }),
      });
      if (res.status === 401) {
        setError('Connect your wallet to save projects');
        return;
      }
      if (!res.ok) throw new Error('Failed to save');
      setSaveSuccess(true);
      setSaveName('');
      setSaveDescription('');
      setShowSaveForm(false);
      setTimeout(() => setSaveSuccess(false), 3000);
      fetchProjects();
    } catch {
      setError('Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    try {
      const res = await fetch(`/api/sanctum/projects?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch {
      setError('Failed to delete project');
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      {/* Toolbar buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => {
            setShowSaveForm(true);
            setShowModal(true);
            setSaveName(category ? category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'My Contract');
          }}
          disabled={!code}
          className="px-3 py-2 text-sm bg-white/[0.05] hover:bg-amber-500/20 rounded-lg border border-white/[0.1] transition-all flex items-center gap-2 hover:border-amber-500/30 disabled:opacity-50"
          title="Save project"
        >
          <Save className="w-4 h-4" />
          {saveSuccess && <span className="text-xs text-near-green">Saved!</span>}
        </button>
        <button
          onClick={() => {
            setShowSaveForm(false);
            setShowModal(true);
          }}
          className="px-3 py-2 text-sm bg-white/[0.05] hover:bg-purple-500/20 rounded-lg border border-white/[0.1] transition-all flex items-center gap-2 hover:border-purple-500/30"
          title="My projects"
        >
          <FolderOpen className="w-4 h-4" />
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-void-darker border border-void-purple/30 rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl shadow-void-purple/20">
            {/* Header */}
            <div className="px-6 py-4 border-b border-void-purple/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  {showSaveForm ? <Save className="w-5 h-5 text-white" /> : <FolderOpen className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {showSaveForm ? '💾 Save Project' : '📂 My Projects'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {showSaveForm ? 'Save your work for later' : `${projects.length} project${projects.length !== 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toggle between save/list */}
            <div className="flex border-b border-void-purple/20">
              <button
                onClick={() => setShowSaveForm(true)}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  showSaveForm ? 'text-near-green border-b-2 border-near-green' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                💾 Save
              </button>
              <button
                onClick={() => setShowSaveForm(false)}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  !showSaveForm ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                📂 Projects
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mx-4 mt-3 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Save Form */}
            {showSaveForm && (
              <div className="p-4 space-y-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Project Name</label>
                  <input
                    type="text"
                    value={saveName}
                    onChange={e => setSaveName(e.target.value)}
                    placeholder="My Awesome Contract"
                    className="w-full bg-void-black border border-void-purple/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-near-green/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Description (optional)</label>
                  <textarea
                    value={saveDescription}
                    onChange={e => setSaveDescription(e.target.value)}
                    placeholder="What does this contract do?"
                    rows={2}
                    className="w-full bg-void-black border border-void-purple/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-near-green/50 resize-none"
                  />
                </div>
                <button
                  onClick={handleSave}
                  disabled={isSaving || !saveName.trim() || !code}
                  className="w-full py-3 bg-near-green/20 hover:bg-near-green/30 text-near-green rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Project
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Project List */}
            {!showSaveForm && (
              <div className="flex-1 overflow-auto p-4 space-y-2">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 text-void-purple animate-spin" />
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-12">
                    <FolderOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500">No saved projects yet</p>
                    <p className="text-xs text-gray-600 mt-1">Build a contract and save it here</p>
                  </div>
                ) : (
                  projects.map(project => (
                    <div
                      key={project.id}
                      className="bg-void-black/30 border border-void-purple/20 rounded-lg p-3 hover:border-void-purple/40 transition-colors group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <span className="text-2xl">
                            {CATEGORY_ICONS[project.category || 'custom'] || '⚡'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white truncate">{project.name}</h4>
                            {project.description && (
                              <p className="text-xs text-gray-500 truncate mt-0.5">{project.description}</p>
                            )}
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(project.updated_at)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Code2 className="w-3 h-3" />
                                v{project.version}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              onLoadProject(project);
                              setShowModal(false);
                            }}
                            className="px-3 py-1.5 text-xs bg-near-green/20 text-near-green rounded-lg hover:bg-near-green/30 transition-colors flex items-center gap-1"
                          >
                            Resume <ChevronRight className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
