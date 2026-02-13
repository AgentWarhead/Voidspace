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
    <div className="absolute top-4 right-4 z-10 flex gap-2">
      <InfoTooltip term="Controls">
        Use mouse wheel to zoom, drag to pan, click nodes to explore connections.
        Right-click for more actions.
      </InfoTooltip>
      <Button variant="secondary" size="sm" onClick={onResetView} title="Reset view">
        <RotateCcw className="w-4 h-4" />
      </Button>
      <Button variant="secondary" size="sm" onClick={onZoomIn} title="Zoom in">
        <ZoomIn className="w-4 h-4" />
      </Button>
      <Button variant="secondary" size="sm" onClick={onZoomOut} title="Zoom out">
        <ZoomOut className="w-4 h-4" />
      </Button>
      <Button variant="secondary" size="sm" onClick={onScreenshot} title="Export as PNG">
        <Camera className="w-4 h-4" />
      </Button>
      <Button variant="secondary" size="sm" onClick={onToggleFullscreen} title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </Button>
    </div>
  );
}
