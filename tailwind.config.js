/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {}
  },
  plugins: [
    require('prettier-plugin-tailwindcss'),
    require('tailwind-scrollbar-hide'),
    require('@tailwindcss/typography')
  ],
  darkMode: 'class'
}
