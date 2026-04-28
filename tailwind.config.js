/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sc-bold':  ['"SWITCH COMMERCE BOLD"', 'system-ui', 'sans-serif'],
        'sc-reg':   ['"SWITCH COMMERCE REG"', 'system-ui', 'sans-serif'],
        'display':  ['"Bebas Neue"', '"Barlow Condensed"', 'sans-serif'],
        'mono':     ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        'body':     ['"Barlow"', 'system-ui', 'sans-serif'],
      },
      colors: {
        'sc-navy':       '#001a3d',
        'sc-navy-deep':  '#000d22',
        'sc-blue':       '#002b5e',
        'sc-blue-soft':  '#1d4980',
        'sc-orange':     '#ff4f00',
        'sc-amber':      '#ffb547',
        'sc-cream':      '#f4ede1',
        'sc-ink':        '#0a0f1f',
      },
      keyframes: {
        scan: {
          '0%':   { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 8px' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.55' },
          '50%':      { opacity: '0.85' },
        },
        tickerSlide: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        scan:        'scan 1s steps(4) infinite',
        breathe:     'breathe 6s ease-in-out infinite',
        tickerSlide: 'tickerSlide 80s linear infinite',
      },
    },
  },
  plugins: [],
}
