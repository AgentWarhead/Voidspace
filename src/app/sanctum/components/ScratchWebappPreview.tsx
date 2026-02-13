'use client';

import { useState } from 'react';
import { Code2, Eye, Download, Copy, Check } from 'lucide-react';

interface ScratchWebappPreviewProps {
  code: string;
  onDownload: () => void;
}

export function ScratchWebappPreview({ code, onDownload }: ScratchWebappPreviewProps) {
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('code');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = code ? code.split('\n').length : 0;
  const charCount = code ? code.length : 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-white/[0.08] bg-void-black/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <div className="flex rounded-lg bg-white/[0.05] border border-white/[0.08] p-0.5">
              <button
                onClick={() => setViewMode('code')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'code'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                Code
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'preview'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={!code}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-white/[0.05] border border-white/[0.08] text-text-muted hover:text-text-primary hover:border-white/[0.15] transition-all disabled:opacity-30"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={onDownload}
              disabled={!code}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:bg-amber-500/30 transition-all disabled:opacity-30"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-auto">
        {!code ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
              <Code2 className="w-8 h-8 text-amber-400/40" />
            </div>
            <p className="text-text-muted text-sm mb-1">No code generated yet</p>
            <p className="text-text-muted/60 text-xs">Start chatting to build your webapp</p>
          </div>
        ) : viewMode === 'code' ? (
          <div className="p-4">
            <pre className="text-sm font-mono leading-relaxed text-text-secondary overflow-x-auto">
              <code>{code}</code>
            </pre>
          </div>
        ) : (
          <div className="p-4">
            <div className="rounded-xl border border-white/[0.08] bg-white overflow-hidden">
              <iframe
                srcDoc={generatePreviewHtml(code)}
                className="w-full h-[600px] border-0"
                sandbox="allow-scripts allow-same-origin"
                title="Webapp Preview"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer stats */}
      {code && (
        <div className="flex-shrink-0 border-t border-white/[0.08] bg-void-black/50 px-4 py-2 flex items-center justify-between text-xs text-text-muted">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            webapp.tsx
          </span>
          <span>{lineCount} lines • {charCount.toLocaleString()} chars</span>
        </div>
      )}
    </div>
  );
}

function generatePreviewHtml(code: string): string {
  // Wrap the generated code in a basic HTML page for preview
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body { font-family: system-ui, sans-serif; }</style>
</head>
<body class="bg-gray-950 text-white min-h-screen">
  <div id="root">
    <div class="p-8 text-center">
      <p class="text-gray-400 text-sm">Preview renders the generated component structure.</p>
      <p class="text-gray-500 text-xs mt-2">Full preview requires running the project locally.</p>
    </div>
  </div>
</body>
</html>`;
}
