const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    fontSize: {
      '2xs': ['0.50rem', { lineHeight: '0.75rem' }],
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    },
    extend: {
      backgroundImage: {
        'desktop-pattern': "url('/src/assets/background-desktop.svg')",
        'mobile-pattern': "url('/src/assets/background-mobile.svg')",
      },
      boxShadow: {
        DEFAULT: '-4px 0 24px 6px rgba(255, 107, 0, 0.16);',
      },
      fontFamily: {
        poppins: ['"Poppins"', 'cursive'],
      },
      colors: {
        'primary': '#ED6C53',
        'primary-light': '#FFC8A9',
        'secondary': '#FA9147',

        'black': '#141414',
        'dark-gray': '#484848',
        'light-gray': '#969696',
        'ultra-light-gray': '#EEEEF0',
        'white': '#FFF',
        'transparent': '#FFF0',

        'surface': '#F3F3F3',
        'divider': '#DEDEDE',

        'orange': '#FF613E',
        'light-orange': '#FCA104',
        'yellow': '#FFB800',
        'pink': '#FF3E9A',
        'dark-pink': '#FE576C',

        'button': '#FA7A42',
        'hover': '#FFA996',
      },
    },
  },
  plugins: [],
};
