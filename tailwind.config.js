module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'desktop-pattern': "url('/src/assets/background-desktop.png')",
        'mobile-pattern': "url('/src/assets/background-mobile.png')",
      },
      fontFamily: {
        'poppins': ['"Poppins"', 'cursive']
      },
      colors: {
        'transparent': '#FFF0',
        'white': '#FFF',
        'dark-gray': '#3B3C24',

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
