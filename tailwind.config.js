/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060d1f',
          900: '#0a1628',
          800: '#0d1f3c',
          700: '#112650',
          600: '#162f62',
          500: '#1a3a7a',
        },
        gold: {
          300: '#ffe380',
          400: '#ffd93d',
          500: '#f5c518',
          600: '#d4a800',
          700: '#b08a00',
        },
        neon: {
          blue: '#4fc3f7',
          cyan: '#00e5ff',
          green: '#69f0ae',
          red: '#ff5252',
          purple: '#e040fb',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Rajdhani', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(79,195,247,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(79,195,247,0.05) 1px, transparent 1px)",
        'hero-gradient': 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 50%, #112650 100%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(245, 197, 24, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(245, 197, 24, 0.6), 0 0 40px rgba(245, 197, 24, 0.2)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'gold': '0 0 20px rgba(245, 197, 24, 0.3)',
        'neon': '0 0 15px rgba(79, 195, 247, 0.4)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'inner-top': 'inset 0 1px 0 rgba(255,255,255,0.05)',
      },
    },
  },
  plugins: [],
};
