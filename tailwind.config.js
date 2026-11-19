/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#09090B',
        surface: '#111114',
        ink: '#F4F4F5',
        soft: '#A1A1AA',
        muted: '#71717A',
        line: '#27272A',
        live: '#10B981',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      keyframes: {
        'live-pulse': {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '70%, 100%': { transform: 'scale(2.6)', opacity: '0' },
        },
      },
      animation: {
        'live-pulse': 'live-pulse 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
}
