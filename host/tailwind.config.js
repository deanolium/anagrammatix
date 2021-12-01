module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      animation: {
        nupulse: 'nupulse 1000ms ease-in-out infinite',
      },
      keyframes: {
        nupulse: {
          '0%, 100%': {
            opacity: 0,
          },
          '50%': {
            opacity: 1,
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
