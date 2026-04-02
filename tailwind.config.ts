import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // FAANG-level mobile-first breakpoints
    screens: {
      'xs': '375px',   // iPhone SE
      'sm': '640px',   // Small tablets
      'md': '768px',   // Tablets
      'lg': '1024px',  // Laptops
      'xl': '1280px',  // Desktops
      '2xl': '1536px', // Large screens
    },
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
      // Mobile-first fluid typography scale
      fontSize: {
        'display-xl': ['clamp(2.5rem, 6vw, 6rem)',     { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display':    ['clamp(2rem, 5vw, 4.5rem)',     { lineHeight: '1.1',  letterSpacing: '-0.015em' }],
        'heading':    ['clamp(1.25rem, 3vw, 2.25rem)', { lineHeight: '1.2',  letterSpacing: '-0.01em' }],
        'subheading': ['clamp(1rem, 2vw, 1.5rem)',     { lineHeight: '1.3' }],
        'mobile-xs':  ['0.75rem',  { lineHeight: '1.4' }],
        'mobile-sm':  ['0.875rem', { lineHeight: '1.4' }],
        'mobile-base':['1rem',     { lineHeight: '1.5' }],
      },
      // Mobile-first spacing scale
      spacing: {
        'section':    'clamp(3rem, 8vw, 8rem)',
        'section-sm': 'clamp(2rem, 5vw, 4rem)',
        'safe-top':   'env(safe-area-inset-top)',
        'safe-bottom':'env(safe-area-inset-bottom)',
        'safe-left':  'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        'touch':      '44px', // Apple HIG minimum touch target
        'touch-sm':   '36px', // Smaller touch target
      },
      // Mobile-first gaps
      gap: {
        'mobile': '1rem',
        'tablet': '1.5rem',
        'desktop': '2rem',
      },
      borderRadius: {
        'luxury': '0.375rem',
        'mobile': '1rem',
        'tablet': '1.25rem',
      },
      boxShadow: {
        'card':       '0 2px 20px rgba(216, 167, 177, 0.08)',
        'card-hover': '0 8px 40px rgba(216, 167, 177, 0.15)',
        'drawer':     '0 0 60px rgba(26, 26, 26, 0.15)',
        'mobile-nav': '0 -4px 20px rgba(0, 0, 0, 0.1)',
        'touch':      '0 2px 8px rgba(0, 0, 0, 0.15)',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'mobile': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      // Mobile gesture animations
      animation: {
        'slide-up':     'slideUp 0.3s ease-out',
        'slide-down':   'slideDown 0.3s ease-out',
        'slide-left':   'slideLeft 0.3s ease-out',
        'slide-right':  'slideRight 0.3s ease-out',
        'fade-in':      'fadeIn 0.2s ease-out',
        'scale-in':     'scaleIn 0.2s ease-out',
        'pull-refresh': 'pullRefresh 0.3s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pullRefresh: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
