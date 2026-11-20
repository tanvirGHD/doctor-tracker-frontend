/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eefaf7',
          100: '#d5f2ec',
          200: '#aee4da',
          300: '#7cd0c2',
          400: '#4bb5a6',
          500: '#269a8b',
          600: '#1a7c71',
          700: '#18635b',
          800: '#174f4a',
          900: '#164240',
        },
        ink: { 950: '#071f1e', 900: '#0a2a29', 800: '#0f3836', 700: '#16504d' },
        canvas: '#f3f6f5',
        line: '#e1e8e6',
        coral: { 50: '#fdf0ed', 500: '#e4553f', 600: '#c9432e' },
        amber: { 50: '#fdf6e8', 500: '#e7a02f', 700: '#9a6410' },
      },
      boxShadow: {
        panel: '0 1px 2px rgba(10, 42, 41, 0.05)',
        pop: '0 20px 50px -12px rgba(7, 31, 30, 0.35)',
      },
    },
  },
  plugins: [],
};
