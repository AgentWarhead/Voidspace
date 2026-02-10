/**
 * SVG Export Utility for Voidspace Charts
 * 
 * This utility handles exporting SVG charts with proper framing,
 * background, padding, and logo placement.
 */

/* Logo SVG string removed — branding now rendered via canvas for reliable PNG export */

/**
 * Branding SVG snippet — logo + VOIDSPACE.io + tagline.
 * Uses only 'monospace' generic font to ensure it renders everywhere.
 */
const BRANDING_SVG = `
<g opacity="0.7">
  <path d="M 38 22 A 16 16 0 1 1 29 8.4" stroke="#00EC97" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <path d="M 31 22 A 9 9 0 1 1 22 13" stroke="#00EC97" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.35"/>
  <line x1="11" y1="33" x2="33" y2="11" stroke="#00D4FF" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
  <circle cx="22" cy="22" r="2.5" fill="#00EC97"/>
  <text x="50" y="20" fill="#00EC97" font-family="monospace" font-size="18" font-weight="bold">VOIDSPACE<tspan fill="#00D4FF" font-weight="normal">.io</tspan></text>
  <text x="50" y="36" fill="rgba(255,255,255,0.35)" font-family="monospace" font-size="9">NEAR ECOSYSTEM INTELLIGENCE</text>
</g>`;

/**
 * Export chart as branded SVG with Voidspace branding.
 * Uses flat SVG structure (no nested <svg>) for reliable rendering.
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

  const [, , width, height] = originalViewBox.split(' ').map(Number);
  const BRAND_H = 60;
  const totalW = width + padding * 2;
  const totalH = height + padding * 2 + BRAND_H;

  // Clone and clean SVG
  const clone = svgElement.cloneNode(true) as SVGElement;
  clone.querySelectorAll('animateTransform, animate, animateMotion').forEach(el => el.remove());
  clone.querySelectorAll('*').forEach(el => {
    el.removeAttribute('onMouseEnter');
    el.removeAttribute('onMouseLeave');
    el.removeAttribute('onClick');
    el.removeAttribute('style');
    if (el.hasAttribute('class')) {
      el.setAttribute('class', (el.getAttribute('class') || '').replace(/cursor-pointer/g, ''));
    }
  });

  // Extract inner content (not the <svg> wrapper itself)
  const svgContent = clone.innerHTML;

  // Calculate logo position
  const brandY = height + padding * 2 + 8;
  let logoTransform = '';
  switch (logoPosition) {
    case 'bottom-right':
      logoTransform = `translate(${totalW - 280}, ${brandY})`;
      break;
    case 'bottom-left':
      logoTransform = `translate(${padding}, ${brandY})`;
      break;
    case 'top-right':
      logoTransform = `translate(${totalW - 280}, ${padding + 5})`;
      break;
    case 'top-left':
      logoTransform = `translate(${padding}, ${padding + 5})`;
      break;
  }

  const finalSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${totalW}" height="${totalH}" fill="${backgroundColor}"/>
  <g transform="translate(${padding}, ${padding})">
    ${svgContent}
  </g>
  <line x1="${padding}" y1="${brandY - 6}" x2="${totalW - padding}" y2="${brandY - 6}" stroke="rgba(0,236,151,0.2)" stroke-width="1"/>
  <g transform="${logoTransform}">${BRANDING_SVG}</g>
</svg>`;

  const blob = new Blob([finalSVG], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get SVG element from a ref or container
 */
export function getSVGElement(containerRef: React.RefObject<HTMLElement>): SVGElement | null {
  if (!containerRef.current) return null;
  return containerRef.current.querySelector('svg');
}