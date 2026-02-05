import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#111111',
        'surface-hover': '#1a1a1a',
        'void-black': '#0a0a0a',
        'void-gray': '#1a1a1a',
        border: '#222222',
        'border-subtle': '#222222',
        'border-hover': '#333333',
        'text-primary': '#ffffff',
        'text-secondary': '#aaaaaa',
        'text-muted': '#888888',
        'near-green': '#00EC97',
        'near-green-dim': 'rgba(0, 236, 151, 0.2)',
        'accent-cyan': '#00D4FF',
        error: '#FF4757',
        warning: '#FFA502',
        'tier-shade': '#666666',
        'tier-specter': '#00EC97',
        'tier-legion': '#00D4FF',
        'tier-leviathan': '#9D4EDD',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 236, 151, 0.5)',
        'glow-sm': '0 0 10px rgba(0, 236, 151, 0.3)',
        'glow-cyan': '0 0 20px rgba(0, 212, 255, 0.5)',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'scan': 'scan-line 3.5s ease-in-out infinite',
        'skeleton-scan': 'skeleton-scan 1.5s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0, 236, 151, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(0, 236, 151, 0.6)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
