/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],

  theme: {
    extend: {
      colors: {
        neon: {
          cyan:  '#22D3EE',
          red:   '#EF4444',
          blood: '#DC2626',
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Courier New"', 'monospace'],
      },

      animation: {
        'fade-in':    'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out forwards',
        'flicker':    'flicker 4s linear infinite',
      },

      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        flicker: {
          '0%,94%,100%': { opacity: '1' },
          '95%':         { opacity: '0.7' },
          '97%':         { opacity: '0.9' },
          '99%':         { opacity: '0.75' },
        },
      },

      boxShadow: {
        'neon-cyan': '0 0 15px rgba(34,211,238,0.5), 0 0 40px rgba(34,211,238,0.15)',
        'neon-red':  '0 0 15px rgba(239,68,68,0.5),  0 0 40px rgba(239,68,68,0.15)',
        'card-dark': '0 10px 40px rgba(0,0,0,0.8)',
      },
    },
  },

  plugins: [],
};
