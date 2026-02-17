/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        zenyth: {
          green: '#10b981',
          yellow: '#f59e0b',
          dark: '#0f172a',
          light: '#f8fafc',
        },
      },
    },
  },
  plugins: [],
}
