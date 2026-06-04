/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'], // Using your data-theme attribute
  theme: {
    extend: {
      colors: {
        admin: {
          bg: '#f8fafc',
          'bg-dark': '#111111',
          card: '#ffffff',
          'card-dark': '#1a1a1a',
          border: '#e2e8f0',
          'border-dark': '#333333',
          text: '#475569',
          'text-dark': '#aaaaaa',
          heading: '#0f172a',
          'heading-dark': '#f5f5f5',
          accent: '#f24c5c', // matching global secondary color
        }
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        rubik: ['Rubik', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
