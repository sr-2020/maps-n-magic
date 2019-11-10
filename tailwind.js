// by https://itnext.io/how-to-use-tailwind-css-with-react-16e9d478b8b1
module.exports = {
  theme: {
    extend: {},
    outlineColor: (theme) => ({
      ...theme('colors'),
    }),
  },
  variants: {
    outline: ['responsive', 'focus', 'hover'],
  },
  plugins: [
    require('tailwindcss-enhanced-outlines-plugin'),
  ],
};
