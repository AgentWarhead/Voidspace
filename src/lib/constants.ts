// ============================================================
// Voidspace Constants & Design Tokens
// ============================================================

export const SITE_NAME = 'Voidspace';
export const SITE_DESCRIPTION = 'AI-powered NEAR ecosystem void scanner. Find voids. Build the future.';
export const SITE_TAGLINE = 'Every ecosystem has voids. Voidspace finds them.';

export const COLORS = {
  background: '#0a0a0a',
  surface: '#111111',
  surfaceHover: '#1a1a1a',
  border: '#222222',
  borderHover: '#333333',
  textPrimary: '#ffffff',
  textSecondary: '#aaaaaa',
  textMuted: '#666666',
  nearGreen: '#00EC97',
  nearGreenDim: 'rgba(0, 236, 151, 0.2)',
  nearGreenGlow: 'rgba(0, 236, 151, 0.5)',
  accentCyan: '#00D4FF',
  error: '#FF4757',
  warning: '#FFA502',
  tierShade: '#666666',
  tierSpecter: '#00EC97',
  tierLegion: '#00D4FF',
  tierLeviathan: '#9D4EDD',
} as const;

export const COMPETITION_LABELS = {
  low: 'Open Void',
  medium: 'Closing',
  high: 'Filled',
} as const;

export const DIFFICULTY_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
} as const;

export const NAV_ITEMS = [
  { label: 'Voids', href: '/opportunities' },
  { label: 'Observatory', href: '/observatory' },
  { label: 'Sanctum', href: '/sanctum' },
  { label: 'Learn', href: '/learn' },
  { label: 'Pricing', href: '/pricing' },
] as const;

// Observatory tool tabs
export const OBSERVATORY_TOOLS = [
  { id: 'void-lens', label: 'Void Lens', icon: 'Eye', description: 'Wallet reputation scoring' },
  { id: 'constellation', label: 'Constellation', icon: 'Network', description: 'Wallet relationship mapping' },
  { id: 'pulse-streams', label: 'Pulse Streams', icon: 'Activity', description: 'Real-time transaction feed' },
] as const;
