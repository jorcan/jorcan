import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4285f4',
        secondary: '#9333ea',
        accent: '#fbbc04',
        surface: '#0f172a'
      }
    }
  },
  plugins: []
} satisfies Config;
