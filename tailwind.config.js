const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontSize: {
      'xs': defaultTheme.fontSize.xs,
      'sm': defaultTheme.fontSize.sm,
      'base': ['16px', '22px'],
      'lg': ['18px', '27px'],
      'xl': ['20px', '30px'],
      '2xl': ['22px', '33px'],
      '3xl': ['24px', '36px'],
      '4xl': ['32px', '48px'],
      '5xl': ['40px', '60px'],
    },
    extend: {
      backgroundImage: {
        'desktop-pattern': "url('/src/assets/background-desktop.png')",
        'mobile-pattern': "url('/src/assets/background-mobile.png')",
      },
      boxShadow: {
        'DEFAULT': '-4px 0 24px 6px rgba(255, 107, 0, 0.16);',
      },
      fontFamily: {
        'poppins': ['"Poppins"', 'cursive']
      },
      colors: {
        'primary': '#ED6C53',
        'primary-light': '#FFC8A9',
        'secondary': '#FA9147',

        'black': '#141414',
        'dark-gray': '#484848',
        'light-gray': '#969696',
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
      }
    }
  },
  plugins: [],
}
