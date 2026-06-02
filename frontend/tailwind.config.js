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
          'bg-dark': '#0f172a',
          card: '#ffffff',
          'card-dark': '#1e293b',
          border: '#e2e8f0',
          'border-dark': '#334155',
          text: '#475569',
          'text-dark': '#cbd5e1',
          heading: '#0f172a',
          'heading-dark': '#f8fafc',
          accent: '#ef4444', // red-500 matching the hover effect
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
