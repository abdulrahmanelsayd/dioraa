import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Primary Palette (Luxury Neutrals)
          offWhite:    "#FAF9F6",
          cream:       "#F5F0EB",
          blush:       "#FCE4EC",
          // Rose Family (Brand Signature Pink)
          rose:        "#D8A7B1",
          deepRose:    "#B27A86",
          petal:       "#E8C4CE",
          // Ink Family (Rich Darks)
          ink:         "#1A1A1A",
          slate:       "#4A4A4A",
          mist:        "#8A8A8A",
          // Utility
          transparent: "transparent",
          overlay:     "rgba(26, 26, 26, 0.4)",
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans:  ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 6vw, 6rem)',     { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display':    ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.1',  letterSpacing: '-0.015em' }],
        'heading':    ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.2',  letterSpacing: '-0.01em' }],
        'subheading': ['clamp(1.125rem, 2vw, 1.5rem)', { lineHeight: '1.3' }],
      },
      spacing: {
        'section': 'clamp(4rem, 8vw, 8rem)',
      },
      borderRadius: {
        'luxury': '0.375rem',
      },
      boxShadow: {
        'card':       '0 2px 20px rgba(216, 167, 177, 0.08)',
        'card-hover': '0 8px 40px rgba(216, 167, 177, 0.15)',
        'drawer':     '0 0 60px rgba(26, 26, 26, 0.15)',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}

export default config
