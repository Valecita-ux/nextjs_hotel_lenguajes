import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 1. EXTENDER LA PALETA DE COLORES
      colors: {
        'rose-primary': 'var(--rose-primary)',
        'rose-secondary': 'var(--rose-secondary)',
        'rose-accent': 'var(--rose-accent)',
        'rose-light': 'var(--rose-light)',
        'gold': 'var(--gold)',
        'cream': 'var(--cream)',
      },
      // 2. EXTENDER LAS FAMILIAS DE FUENTES
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        cormorant: ['var(--font-cormorant)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      // 3. IMAGEN DE FONDO PREDETERMINADA
      backgroundImage: {
        'asian-texture': 'url("/images/fondo-flores.jpeg")',
      },
    },
  },
  plugins: [],
};

export default config;
