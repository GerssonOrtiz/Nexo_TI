import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark Forge Background Palette (cyber-glassmorphism-ui)
        'bg-forge': '#050811',
        'bg-forge-mid': '#090D1A',
        'bg-forge-high': '#0E1424',
        'bg-base': '#0A0F1E',
        'bg-surface': '#111827',
        'bg-elevated': '#1a2236', // Modales, tooltips y dropdowns OPACOS

        // Neon Accent Palette
        'neon-blue': '#00D2FF',
        'neon-purple': '#818CF8',
        'amber-core': '#00D2FF',
        'amber-glow': '#38BDF8',
        'amber-deep': '#0284C7',
        'amber-ghost': 'rgba(0, 210, 255, 0.08)',
        'forge-orange': '#6366F1',
        'forge-bright': '#818CF8',

        // Text & Border Tokens
        'text-primary': '#F1F5F9',
        'text-secondary': '#94A3B8',
        'border-subtle': 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glass-card': '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 210, 255, 0.04)',
        'vision-sidebar': '0 0 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'neon-glow': '0 0 20px rgba(0, 210, 255, 0.35)',
      },
      animation: {
        'float-1': 'float-orb 6s ease-in-out infinite',
        'float-2': 'float-orb 8s ease-in-out infinite 2s',
        'float-3': 'float-orb 10s ease-in-out infinite 4s',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'float-orb': {
          '0%, 100%': { transform: 'translateY(0px) scale(1)', opacity: '0.6' },
          '50%': { transform: 'translateY(-24px) scale(1.08)', opacity: '0.9' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
