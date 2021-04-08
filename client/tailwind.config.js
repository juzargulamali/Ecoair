const { blue } = require('tailwindcss/colors');
const colors = require('tailwindcss/colors');
module.exports = {
  purge: {
    mode: 'layers',
    content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}']
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      listStyleType: {
        alpha: 'lower-alpha',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['odd', 'even', 'active'],
      textColor: ['group-focus'],
      borderColor: ['group-focus', 'group-hover', 'focus-within'],
      padding: ['first', 'last'],
    },
  },
  plugins: [],
}
