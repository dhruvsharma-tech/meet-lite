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
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.33%)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        'fade-in': 'fade-in 150ms ease-out',
        'bounce-dot': 'bounce-dot 1s infinite ease-in-out',
        'marquee': 'marquee 28s linear infinite',
        'float': 'float 5s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
