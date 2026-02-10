/**
 * SVG Export Utility for Voidspace Charts
 * 
 * This utility handles exporting SVG charts with proper framing,
 * background, padding, and logo placement.
 */

/**
 * Static Voidspace logo SVG (no framer-motion animations)
 * Premium branding group with logo + VOIDSPACE + voidspace.io
 */
const VoidspaceLogoSVG = `
<g opacity="0.5">
  <!-- Background subtle glow for premium feel -->
  <rect
    x="-2"
    y="-2"
    width="104"
    height="26"
    fill="rgba(0,236,151,0.05)"
    rx="4"
    ry="4"
  />
  
  <!-- Logo symbol -->
  <g transform="translate(2,3)">
    <!-- Outer broken ring -->
    <path
      d="M 17 10 A 7 7 0 1 1 13 3.68"
      stroke="#00EC97"
      stroke-width="1.4"
      stroke-linecap="round"
      fill="none"
    />
    
    <!-- Inner arc -->
    <path
      d="M 13.6 10 A 3.6 3.6 0 1 1 10 6.4"
      stroke="#00EC97"
      stroke-width="0.9"
      stroke-linecap="round"
      fill="none"
      opacity="0.4"
    />
    
    <!-- Diagonal scan line -->
    <line
      x1="5"
      y1="15"
      x2="15"
      y2="5"
      stroke="#00D4FF"
      stroke-width="0.7"
      stroke-linecap="round"
      opacity="0.8"
    />
    
    <!-- Center dot -->
    <circle
      cx="10"
      cy="10"
      r="0.9"
      fill="#00EC97"
    />
  </g>
  
  <!-- Brand name: VOIDSPACE -->
  <text
    x="26"
    y="12"
    font-family="'JetBrains Mono', monospace"
    font-size="8.5"
    font-weight="700"
    fill="#00EC97"
    letter-spacing="1.2"
  >
    VOIDSPACE
  </text>
  
  <!-- Website URL: voidspace.io -->
  <text
    x="26"
    y="20.5"
    font-family="'JetBrains Mono', monospace"
    font-size="6"
    font-weight="500"
    fill="#00EC97"
    letter-spacing="0.5"
    opacity="0.7"
  >
    voidspace.io
  </text>
</g>
`;

/**
 * Export SVG with proper framing and logo
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
  const [minX, minY, width, height] = originalViewBox.split(' ').map(Number);
  
  // Calculate new viewBox with padding
  const newWidth = width + (padding * 2);
  const newHeight = height + (padding * 2);
  const newViewBox = `0 0 ${newWidth} ${newHeight}`;

  // Clone the original SVG content
  const clonedElement = svgElement.cloneNode(true) as SVGElement;
  
  // Remove animation elements and interactive attributes
  const elementsToClean = clonedElement.querySelectorAll('*');
  elementsToClean.forEach(el => {
    // Remove animation elements
    const animationElements = el.querySelectorAll('animateTransform, animate, animateMotion');
    animationElements.forEach(anim => anim.remove());
    
    // Remove interactive attributes
    el.removeAttribute('onMouseEnter');
    el.removeAttribute('onMouseLeave');
    el.removeAttribute('onClick');
    el.removeAttribute('style');
    
    // Remove cursor pointer styles that might be in classes
    if (el.hasAttribute('class')) {
      const classes = el.getAttribute('class') || '';
      el.setAttribute('class', classes.replace(/cursor-pointer/g, ''));
    }
  });

  // Get the SVG content as string
  const svgContent = clonedElement.innerHTML;

  // Calculate logo position (updated for enhanced branding)
  let logoTransform = '';
  switch (logoPosition) {
    case 'bottom-right':
      logoTransform = `translate(${newWidth - 130}, ${newHeight - 35})`;
      break;
    case 'bottom-left':
      logoTransform = `translate(20, ${newHeight - 35})`;
      break;
    case 'top-right':
      logoTransform = `translate(${newWidth - 130}, 20)`;
      break;
    case 'top-left':
      logoTransform = `translate(20, 20)`;
      break;
  }

  // Create the final SVG with background, padding, and logo
  const finalSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="${newViewBox}" width="${newWidth}" height="${newHeight}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="100%" height="100%" fill="${backgroundColor}"/>
  
  <!-- Chart content with padding offset -->
  <g transform="translate(${padding}, ${padding})">
    ${svgContent}
  </g>
  
  <!-- Voidspace logo -->
  <g transform="${logoTransform}">
    ${VoidspaceLogoSVG}
  </g>
</svg>`;

  // Create and download the file
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