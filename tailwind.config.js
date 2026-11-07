/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './*.html',
    './*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.ts',
    './lib/**/*.ts',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        science: {
          dark: '#0f172a', // slate-900
          teal: '#2dd4bf',
          purple: '#a855f7',
          glass: 'rgba(15, 23, 42, 0.7)',
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
