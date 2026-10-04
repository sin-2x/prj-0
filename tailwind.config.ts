import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'Georgia', 'serif'],
      },
      colors: {
        night: '#080607',
        wine: '#2b0712',
        burgundy: '#4c1023',
        rose: '#c77b8b',
        ivory: '#fff2df',
        champagne: '#e8c98b',
      },
      boxShadow: {
        glow: '0 0 45px rgba(232, 201, 139, 0.18)',
      },
    },
  },
  plugins: [],
} satisfies Config;
