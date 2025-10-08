import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'rose-primary': '#7B1D26',
        'rose-secondary': '#895A49',
        'rose-accent': '#CA99AB',
        'rose-light': '#E4CDDD',
        'gold': '#D4AF37',
        'cream': '#FFF8F0',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        cormorant: ['var(--font-cormorant)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      backgroundImage: {
        'asian-texture': "url('/images/fondo-flores.jpeg')",
      },
    },
  },
  plugins: [],
};

export default config;