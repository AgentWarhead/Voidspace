'use client';

import { RotateCcw, ZoomIn, ZoomOut, Camera, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { InfoTooltip } from '@/components/ui/InfoTooltip';

interface ConstellationControlsProps {
  onResetView: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onScreenshot: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

export function ConstellationControls({
  onResetView,
  onZoomIn,
  onZoomOut,
  onScreenshot,
  onToggleFullscreen,
  isFullscreen,
}: ConstellationControlsProps) {
  return (
    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 flex flex-wrap gap-1.5 sm:gap-2">
      <div className="hidden sm:block">
        <InfoTooltip term="Controls">
          Use mouse wheel to zoom, drag to pan, click nodes to explore connections.
          Right-click for more actions. On mobile: pinch to zoom, tap to select.
        </InfoTooltip>
      </div>
      <Button variant="secondary" size="sm" onClick={onResetView} title="Reset view" className="min-h-[44px] min-w-[44px] active:scale-95 transition-transform">
        <RotateCcw className="w-4 h-4" />
      </Button>
      <Button variant="secondary" size="sm" onClick={onZoomIn} title="Zoom in" className="min-h-[44px] min-w-[44px] active:scale-95 transition-transform">
        <ZoomIn className="w-4 h-4" />
      </Button>
      <Button variant="secondary" size="sm" onClick={onZoomOut} title="Zoom out" className="min-h-[44px] min-w-[44px] active:scale-95 transition-transform">
        <ZoomOut className="w-4 h-4" />
      </Button>
      <Button variant="secondary" size="sm" onClick={onScreenshot} title="Export as PNG" className="hidden sm:flex min-h-[44px] min-w-[44px] active:scale-95 transition-transform">
        <Camera className="w-4 h-4" />
      </Button>
      <Button variant="secondary" size="sm" onClick={onToggleFullscreen} title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'} className="min-h-[44px] min-w-[44px] active:scale-95 transition-transform">
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </Button>
    </div>
  );
}
