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
      }
    },
    colors: {
      'gray': '#3B3C24',
      'white': '#FFF',
      'transparent': '#FFF0',

      'orange': '#FA9147',
      'light-orange': '#ED6C53',
      'pink': '#FF3E9A',
      'dark-pink': '#FE576C',

      'button': '#FA7A42',
      'hover': '#FFA996',
    }
  },
  plugins: [],
}
