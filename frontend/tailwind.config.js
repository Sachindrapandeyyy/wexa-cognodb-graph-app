/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0d14',
          darker: '#06080d',
          card: '#0f1422',
          cardBorder: '#1c2438',
          accent: '#00f0ff',
          neonGreen: '#00ff88',
          neonRed: '#ff2a55',
          neonAmber: '#ffaa00',
          neonPurple: '#a855f7',
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 240, 255, 0.3)',
        'neon-red': '0 0 15px rgba(255, 42, 85, 0.3)',
        'neon-green': '0 0 15px rgba(0, 255, 136, 0.3)',
      }
    },
  },
  plugins: [],
}
