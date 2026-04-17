/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kids-purple': {
          DEFAULT: '#8B5CF6',
          dark: '#7C3AED',
          light: '#A78BFA',
        },
        'kids-green': {
          DEFAULT: '#10B981',
          dark: '#059669',
          light: '#34D399',
        },
        'kids-blue': {
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
          light: '#60A5FA',
        },
        'kids-yellow': {
          DEFAULT: '#FBBF24',
          dark: '#F59E0B',
          light: '#FCD34D',
        },
        'kids-pink': {
          DEFAULT: '#EC4899',
          dark: '#DB2777',
          light: '#F472B6',
        },
        'space-dark': '#0F172A',
        'space-nav': '#1E293B',
      },
      fontFamily: {
        'kids': ['"Outfit"', 'sans-serif'],
        'display': ['"Luckiest Guy"', 'cursive'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'wiggle': 'wiggle 0.3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
