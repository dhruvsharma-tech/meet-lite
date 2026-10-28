/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-server-list': '#1e1f22',
        'bg-channel-list': '#2b2d31',
        'bg-main': '#313338',
        'bg-input': '#383a40',
        'bg-hover': '#35373c',
        'accent': '#5865f2',
        'accent-hover': '#4752c4',
        'status-online': '#23a55a',
        'status-offline': '#80848e',
        'status-danger': '#f23f42',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-dot': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 150ms ease-out',
        'bounce-dot': 'bounce-dot 1s infinite ease-in-out',
      },
    },
  },
  plugins: [],
}
