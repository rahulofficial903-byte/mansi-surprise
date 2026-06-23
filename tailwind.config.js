/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Manrope', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 55px rgba(244, 114, 182, .28)',
      },
    },
  },
  plugins: [],
}
