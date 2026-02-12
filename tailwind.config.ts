import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#fafafa',
        foreground: '#0a0a0a',
        primary: '#4f46e5',
        muted: '#f3f4f6'
      }
    }
  },
  plugins: []
};

export default config;
