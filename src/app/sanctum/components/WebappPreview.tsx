'use client';

import { useState, useEffect, useRef } from 'react';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { WebappComponent } from './WebappChat';

interface WebappPreviewProps {
  html: string;
  components: WebappComponent[];
  isGenerating: boolean;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

const DEVICE_SIZES = {
  desktop: { width: '100%', height: '100%', label: '1440px' },
  tablet: { width: '768px', height: '100%', label: '768px' },
  mobile: { width: '375px', height: '100%', label: '375px' },
};

export function WebappPreview({ html, components, isGenerating }: WebappPreviewProps) {
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [key, setKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Update iframe when html/css changes
  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [html, key]);

  const handleRefresh = () => {
    setKey(prev => prev + 1);
  };

  const handleOpenExternal = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className={`flex flex-col h-full bg-void-darker ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-void-purple/20 bg-void-black/50">
        <div className="flex items-center gap-2">
          {/* Device toggles */}
          <div className="flex bg-void-black/50 rounded-lg p-1">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-2 rounded-md transition-colors ${
                device === 'desktop' 
                  ? 'bg-cyan-500/20 text-cyan-400' 
                  : 'text-gray-500 hover:text-white'
              }`}
              title="Desktop"
            >
              <span>🖥️</span>
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-2 rounded-md transition-colors ${
                device === 'tablet' 
                  ? 'bg-cyan-500/20 text-cyan-400' 
                  : 'text-gray-500 hover:text-white'
              }`}
              title="Tablet"
            >
              <span>📱</span>
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-2 rounded-md transition-colors ${
                device === 'mobile' 
                  ? 'bg-cyan-500/20 text-cyan-400' 
                  : 'text-gray-500 hover:text-white'
              }`}
              title="Mobile"
            >
              <span>📱</span>
            </button>
          </div>

          <span className="text-xs text-gray-500 ml-2">
            {DEVICE_SIZES[device].label}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            title="Refresh preview"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenExternal}
            className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <span>⛶</span> : <span>⛶</span>}
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-hidden bg-[#1a1a2e] p-4 flex items-start justify-center">
        {/* Browser Chrome */}
        <div 
          className="bg-void-black rounded-xl overflow-hidden shadow-2xl shadow-black/50 flex flex-col transition-all duration-300"
          style={{ 
            width: DEVICE_SIZES[device].width,
            maxWidth: '100%',
            height: device === 'desktop' ? '100%' : '90%',
          }}
        >
          {/* Browser Bar */}
          <div className="flex items-center gap-2 px-4 py-2 bg-void-darker border-b border-void-purple/20">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-void-black/50 rounded-lg px-3 py-1.5 text-xs text-gray-500 flex items-center gap-2">
                <span className="text-green-400">🔒</span>
                <span>https://my-dapp.vercel.app</span>
              </div>
            </div>
          </div>

          {/* Iframe Container */}
          <div className="flex-1 overflow-hidden relative">
            {isGenerating && (
              <div className="absolute inset-0 bg-void-black/80 flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-cyan-400 text-sm">Generating preview...</p>
                </div>
              </div>
            )}
            
            {html ? (
              <iframe
                ref={iframeRef}
                key={key}
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts"
                title="Webapp Preview"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-void-black/50">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎨</div>
                  <p className="text-gray-500">Select a template to start</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Component List (collapsed) */}
      {components.length > 0 && (
        <div className="px-4 py-2 border-t border-void-purple/20 bg-void-black/30">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Components:</span>
            <div className="flex gap-1 flex-wrap">
              {components.slice(0, 6).map((c) => (
                <span 
                  key={c.id}
                  className="px-2 py-0.5 bg-void-purple/20 text-void-purple rounded-full"
                >
                  {c.name}
                </span>
              ))}
              {components.length > 6 && (
                <span className="px-2 py-0.5 text-gray-600">
                  +{components.length - 6} more
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
