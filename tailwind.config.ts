import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#fafafa',
        foreground: '#0a0a0a',
        primary: '#5b21b6',
        muted: '#f3f4f6'
      }
    }
  },
  plugins: []
};

export default config;
