/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'wg-bg':        '#0A1628',
        'wg-bg-deep':   '#060E1A',
        'wg-surface':   '#0F1E35',
        'wg-surface-2': '#132438',
        'wg-border':    '#1A2F4A',
        'wg-blue':      '#2E75B6',
        'wg-cyan':      '#4A9FE0',
        'wg-text':      '#E8F4FD',
        'wg-muted':     '#8BA3BE',
        'wg-green':     '#22C55E',
        'wg-orange':    '#F59E0B',
        'wg-red':       '#EF4444',
        'wg-black-alert':'#B91C1C',
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backdropBlur: { xs: '2px' },
      animation: {
        'pulse-slow':   'pulse 2.8s cubic-bezier(0.4,0,0.6,1) infinite',
        'slide-log':    'slide-log 0.28s ease-out',
        'fade-in':      'fade-in 0.35s ease-out',
        'scale-in':     'scale-in 0.22s ease-out',
        'glow-red':     'glow-red 1.6s ease-in-out infinite',
        'glow-orange':  'glow-orange 2s ease-in-out infinite',
        'spin-slow':    'spin 8s linear infinite',
        'wave':         'wave 2.2s ease-in-out infinite',
        'scan-line':    'scan-line 4s linear infinite',
      },
      keyframes: {
        'slide-log': {
          '0%':   { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'glow-red': {
          '0%,100%': { boxShadow: '0 0 20px rgba(239,68,68,0.3), 0 0 60px rgba(239,68,68,0.1)' },
          '50%':     { boxShadow: '0 0 40px rgba(239,68,68,0.6), 0 0 100px rgba(239,68,68,0.2)' },
        },
        'glow-orange': {
          '0%,100%': { boxShadow: '0 0 16px rgba(245,158,11,0.25)' },
          '50%':     { boxShadow: '0 0 32px rgba(245,158,11,0.5)' },
        },
        'wave': {
          '0%,100%': { transform: 'scaleY(1)' },
          '50%':     { transform: 'scaleY(0.7)' },
        },
        'scan-line': {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(400%)' },
        },
      },
      boxShadow: {
        'card':   '0 4px 24px rgba(0,0,0,0.32), 0 1px 4px rgba(0,0,0,0.2)',
        'glow-blue':'0 0 24px rgba(74,159,224,0.3)',
        'glow-red': '0 0 32px rgba(239,68,68,0.4)',
      },
    },
  },
  plugins: [],
};
