/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f9f4',
          100: '#d9f0e4',
          200: '#b5e2cc',
          300: '#84ccab',
          400: '#50b083',
          500: '#2d9467',
          600: '#1e7752',
          700: '#195f43',
          800: '#174d37',
          900: '#143f2e',
          950: '#0d2b1f',
        },
      },
      boxShadow: {
        card:       '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-hover':'0 4px 12px 0 rgba(0,0,0,0.10)',
      },
      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseRing: {
          '0%':   { boxShadow: '0 0 0 0 rgba(220,38,38,0.35)' },
          '70%':  { boxShadow: '0 0 0 14px rgba(220,38,38,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(220,38,38,0)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.45s ease-out both',
        'fade-in':    'fadeIn 0.3s ease-out both',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
      },
    },
  },
  plugins: [],
}
