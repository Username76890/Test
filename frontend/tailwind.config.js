/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF8C42', // Orange Accent
        secondary: '#F4EDE4', // Cream Base
        'mocha': '#A87C7C', // Mocha
        'brown': '#6D4C41', // Brown
        'teal': '#008080', // Teal
        'text-dark': '#1F2937',
        'text-light': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
