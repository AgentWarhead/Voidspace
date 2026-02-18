'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
// @ts-ignore
import { Save, FolderOpen, Trash2, Clock, Code2, X, Loader2, ChevronRight, Check, Edit2, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'sanctum-projects';

export interface LocalProject {
  id: string;
  name: string;
  code: string;
  messages: Array<{ role: string; content: string }>;
  category: string;
  persona: string;
  mode: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectManagerProps {
  code: string;
  messages?: Array<{ role: string; content: string }>;
  category?: string | null;
  persona?: string;
  mode?: string;
  onLoadProject: (project: LocalProject) => void;
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

type SaveStatus = 'idle' | 'saving' | 'saved' | 'unsaved';

function loadProjects(): LocalProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveProjects(projects: LocalProject[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch {
    // ignore storage errors
  }
}

export function ProjectManager({
  code,
  messages = [],
  category,
  persona = '',
  mode = 'build',
  onLoadProject,
}: ProjectManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState<LocalProject[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveName, setSaveName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const lastSavedCodeRef = useRef<string>('');

  // Track unsaved changes
  useEffect(() => {
    if (!code || !lastSavedCodeRef.current) return;
    if (saveStatus === 'saved' && code !== lastSavedCodeRef.current) {
      setSaveStatus('unsaved');
    }
  }, [code, saveStatus]);

  const fetchProjects = useCallback(() => {
    const projs = loadProjects();
    setProjects(projs);
  }, []);

  useEffect(() => {
    if (showModal) {
      fetchProjects();
    }
  }, [showModal, fetchProjects]);

  const handleSave = async () => {
    if (!saveName.trim() || !code) return;
    setIsSaving(true);
    setSaveStatus('saving');
    setError(null);

    try {
      // Small delay to show saving state
      await new Promise(resolve => setTimeout(resolve, 300));

      const now = new Date().toISOString();
      const existing = loadProjects();

      const newProject: LocalProject = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `proj-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: saveName.trim(),
        code,
        messages,
        category: category || 'custom',
        persona,
        mode,
        createdAt: now,
        updatedAt: now,
      };

      const updated = [newProject, ...existing];
      saveProjects(updated);
      setProjects(updated);

      lastSavedCodeRef.current = code;
      setSaveStatus('saved');
      setSaveName('');
      setShowSaveForm(false);

      // Reset to idle after 3s
      setTimeout(() => setSaveStatus(s => s === 'saved' ? 'idle' : s), 3000);
    } catch {
      setError('Failed to save project');
      setSaveStatus('unsaved');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id);
      // Auto-cancel confirm after 3s
      setTimeout(() => setDeleteConfirmId(prev => prev === id ? null : prev), 3000);
      return;
    }
    const updated = projects.filter(p => p.id !== id);
    saveProjects(updated);
    setProjects(updated);
    setDeleteConfirmId(null);
  };

  const handleRenameStart = (project: LocalProject) => {
    setEditingId(project.id);
    setEditingName(project.name);
  };

  const handleRenameCommit = (id: string) => {
    if (!editingName.trim()) {
      setEditingId(null);
      return;
    }
    const updated = projects.map(p =>
      p.id === id ? { ...p, name: editingName.trim(), updatedAt: new Date().toISOString() } : p
    );
    saveProjects(updated);
    setProjects(updated);
    setEditingId(null);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const getStatusIndicator = () => {
    if (saveStatus === 'saving') return { text: 'Saving...', color: 'text-amber-400' };
    if (saveStatus === 'saved') return { text: 'Saved ✓', color: 'text-near-green' };
    if (saveStatus === 'unsaved') return { text: '• Unsaved', color: 'text-amber-400' };
    return null;
  };

  const statusIndicator = getStatusIndicator();

  return (
    <>
      {/* Toolbar buttons */}
      <div className="flex items-center gap-1">
        {statusIndicator && (
          <span className={`text-xs ${statusIndicator.color} hidden sm:inline transition-all`}>
            {statusIndicator.text}
          </span>
        )}
        <button
          onClick={() => {
            setShowSaveForm(true);
            setShowModal(true);
            setSaveName(
              category
                ? category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                : 'My Contract'
            );
          }}
          disabled={!code}
          className="px-3 py-2 min-h-[44px] min-w-[44px] text-sm bg-white/[0.05] hover:bg-amber-500/20 rounded-lg border border-white/[0.1] transition-all flex items-center gap-2 hover:border-amber-500/30 disabled:opacity-50"
          title="Save project"
        >
          {saveStatus === 'saved' ? (
            <Check className="w-4 h-4 text-near-green" />
          ) : (
            <Save className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={() => {
            setShowSaveForm(false);
            setShowModal(true);
          }}
          className="px-3 py-2 min-h-[44px] min-w-[44px] text-sm bg-white/[0.05] hover:bg-purple-500/20 rounded-lg border border-white/[0.1] transition-all flex items-center gap-2 hover:border-purple-500/30"
          title="My projects"
        >
          <FolderOpen className="w-4 h-4" />
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-void-darker border border-void-purple/30 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl shadow-void-purple/20">
            {/* Header */}
            <div className="px-4 sm:px-6 py-4 border-b border-void-purple/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  {showSaveForm ? (
                    <Save className="w-5 h-5 text-white" />
                  ) : (
                    <FolderOpen className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {showSaveForm ? '💾 Save Project' : '📂 My Projects'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {showSaveForm
                      ? 'Save your work for later'
                      : `${projects.length} project${projects.length !== 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toggle between save/list */}
            <div className="flex border-b border-void-purple/20">
              <button
                onClick={() => setShowSaveForm(true)}
                className={`flex-1 py-3 min-h-[44px] text-sm font-medium transition-colors ${
                  showSaveForm
                    ? 'text-near-green border-b-2 border-near-green'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                💾 Save
              </button>
              <button
                onClick={() => {
                  setShowSaveForm(false);
                  fetchProjects();
                }}
                className={`flex-1 py-3 min-h-[44px] text-sm font-medium transition-colors ${
                  !showSaveForm
                    ? 'text-purple-400 border-b-2 border-purple-500'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                📂 Projects ({projects.length})
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mx-4 mt-3 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-sm text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Save Form */}
            {showSaveForm && (
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Project Name</label>
                  <input
                    type="text"
                    value={saveName}
                    onChange={e => setSaveName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSave()}
                    placeholder="My Awesome Contract"
                    autoFocus
                    className="w-full bg-void-black border border-void-purple/20 rounded-lg px-3 py-3 min-h-[44px] text-sm text-white placeholder-gray-600 focus:outline-none focus:border-near-green/50"
                  />
                </div>
                {code && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-void-black/30 rounded-lg p-3">
                    <Code2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>
                      {code.split('\n').length} lines · {category || 'custom'} · {mode} mode
                      {persona ? ` · ${persona}` : ''}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleSave}
                  disabled={isSaving || !saveName.trim() || !code}
                  className="w-full py-3 min-h-[44px] bg-near-green/20 hover:bg-near-green/30 text-near-green rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
                {projects.length === 0 ? (
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
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <span className="text-2xl flex-shrink-0 mt-0.5">
                            {CATEGORY_ICONS[project.category] || '⚡'}
                          </span>
                          <div className="flex-1 min-w-0">
                            {/* Inline rename */}
                            {editingId === project.id ? (
                              <input
                                autoFocus
                                type="text"
                                value={editingName}
                                onChange={e => setEditingName(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') handleRenameCommit(project.id);
                                  if (e.key === 'Escape') setEditingId(null);
                                }}
                                onBlur={() => handleRenameCommit(project.id)}
                                className="w-full bg-void-black border border-void-purple/40 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-near-green/50"
                              />
                            ) : (
                              <div className="flex items-center gap-1">
                                <h4 className="text-sm font-semibold text-white truncate">
                                  {project.name}
                                </h4>
                                <button
                                  onClick={() => handleRenameStart(project)}
                                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-purple-400 transition-all flex-shrink-0"
                                  title="Rename"
                                >
                                  <Edit2 className="w-3 h-3 text-gray-500" />
                                </button>
                              </div>
                            )}
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(project.updatedAt)}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Code2 className="w-3 h-3" />
                                {project.code.split('\n').length} lines
                              </span>
                              {project.mode && (
                                <span className="text-xs px-1.5 py-0.5 bg-void-purple/20 text-purple-400 rounded">
                                  {project.mode}
                                </span>
                              )}
                            </div>
                            {/* Code preview */}
                            {project.code && (
                              <pre className="mt-1 text-xs text-gray-600 font-mono truncate">
                                {project.code
                                  .split('\n')
                                  .find(l => l.trim().length > 3) || ''}
                              </pre>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => {
                              onLoadProject(project);
                              setShowModal(false);
                            }}
                            className="px-3 py-1.5 min-h-[36px] text-xs bg-near-green/20 text-near-green rounded-lg hover:bg-near-green/30 transition-colors flex items-center gap-1 whitespace-nowrap"
                          >
                            Load <ChevronRight className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className={`p-2 min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors rounded ${
                              deleteConfirmId === project.id
                                ? 'bg-red-500/20 text-red-400'
                                : 'text-gray-500 hover:text-red-400'
                            }`}
                            title={
                              deleteConfirmId === project.id
                                ? 'Click again to confirm delete'
                                : 'Delete project'
                            }
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
