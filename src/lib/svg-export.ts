/**
 * SVG Export Utility for Voidspace Charts
 * 
 * This utility handles exporting SVG charts with proper framing,
 * background, padding, and logo placement.
 */

/* Logo SVG string removed — branding now rendered via canvas for reliable PNG export */

/**
 * Draw the Voidspace logo + branding onto a canvas context.
 * Call after positioning with ctx.translate().
 */
function drawBrandingOnCanvas(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.globalAlpha = 0.7;

  // Outer broken ring
  ctx.strokeStyle = '#00EC97';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(22, 22, 16, -0.52, 4.76, false);
  ctx.stroke();

  // Inner arc
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(22, 22, 9, -0.52, 3.67, false);
  ctx.stroke();

  // Diagonal scan line
  ctx.globalAlpha = 0.6;
  ctx.strokeStyle = '#00D4FF';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(11, 33);
  ctx.lineTo(33, 11);
  ctx.stroke();

  // Center dot
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = '#00EC97';
  ctx.beginPath();
  ctx.arc(22, 22, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // "VOIDSPACE" text
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = '#00EC97';
  ctx.font = "bold 16px 'JetBrains Mono', 'SF Mono', 'Fira Code', 'Courier New', monospace";
  ctx.letterSpacing = '2px';
  ctx.fillText('VOIDSPACE', 50, 20);

  // ".io" suffix
  const vsWidth = ctx.measureText('VOIDSPACE').width;
  ctx.fillStyle = '#00D4FF';
  ctx.font = "500 16px 'JetBrains Mono', 'SF Mono', 'Fira Code', 'Courier New', monospace";
  ctx.letterSpacing = '0px';
  ctx.fillText('.io', 50 + vsWidth + 3, 20);

  // Tagline
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = '#ffffff';
  ctx.font = "500 8px 'JetBrains Mono', 'SF Mono', 'Fira Code', 'Courier New', monospace";
  ctx.letterSpacing = '2px';
  ctx.fillText('NEAR ECOSYSTEM INTELLIGENCE', 50, 35);

  ctx.restore();
}

/**
 * Export chart as branded PNG (renders SVG → canvas → PNG).
 * Guarantees fonts and branding render correctly in all viewers.
 */
export function exportSVG(
  svgElement: SVGElement,
  filename: string,
  options: {
    originalViewBox: string; // e.g., "0 0 800 500"
    backgroundColor?: string;
    padding?: number;
    logoPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  }
) {
  const {
    originalViewBox,
    backgroundColor = '#0a0a0a',
    padding = 40,
    logoPosition = 'bottom-right'
  } = options;

  // Parse original viewBox
  const [, , width, height] = originalViewBox.split(' ').map(Number);

  const SCALE = 2;
  const BRAND_H = 60;
  const totalW = width + padding * 2;
  const totalH = height + padding * 2 + BRAND_H;

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = totalW * SCALE;
  canvas.height = totalH * SCALE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(SCALE, SCALE);

  // Background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, totalW, totalH);

  // Clone and prepare SVG for rendering
  const clonedElement = svgElement.cloneNode(true) as SVGSVGElement;
  clonedElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clonedElement.setAttribute('width', String(width));
  clonedElement.setAttribute('height', String(height));
  // Remove animations
  clonedElement.querySelectorAll('animateTransform, animate, animateMotion').forEach(el => el.remove());
  clonedElement.querySelectorAll('*').forEach(el => {
    el.removeAttribute('onMouseEnter');
    el.removeAttribute('onMouseLeave');
    el.removeAttribute('onClick');
    if (el.hasAttribute('class')) {
      el.setAttribute('class', (el.getAttribute('class') || '').replace(/cursor-pointer/g, ''));
    }
  });

  // Render SVG to canvas via Image
  const svgData = new XMLSerializer().serializeToString(clonedElement);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);
  const img = new Image();
  img.crossOrigin = 'anonymous';

  img.onload = () => {
    ctx.drawImage(img, padding, padding, width, height);
    URL.revokeObjectURL(svgUrl);

    // Separator line
    const brandY = height + padding * 2 + 8;
    ctx.strokeStyle = 'rgba(0,236,151,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, brandY - 6);
    ctx.lineTo(totalW - padding, brandY - 6);
    ctx.stroke();

    // Draw branding
    let logoX = 0;
    let logoY = 0;
    switch (logoPosition) {
      case 'bottom-right':
        logoX = totalW - 260;
        logoY = brandY;
        break;
      case 'bottom-left':
        logoX = padding;
        logoY = brandY;
        break;
      case 'top-right':
        logoX = totalW - 260;
        logoY = padding + 10;
        break;
      case 'top-left':
        logoX = padding;
        logoY = padding + 10;
        break;
    }

    ctx.save();
    ctx.translate(logoX, logoY);
    drawBrandingOnCanvas(ctx);
    ctx.restore();

    // Download as PNG
    const pngFilename = filename.replace(/\.svg$/i, '.png');
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = pngFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png', 1.0);
  };

  img.onerror = () => {
    URL.revokeObjectURL(svgUrl);
    console.error('Failed to render chart SVG to canvas');
  };

  img.src = svgUrl;
}

/**
 * Get SVG element from a ref or container
 */
export function getSVGElement(containerRef: React.RefObject<HTMLElement>): SVGElement | null {
  if (!containerRef.current) return null;
  return containerRef.current.querySelector('svg');
}