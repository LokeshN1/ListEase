/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'jet-black': '#050606',
        'misty-blue': '#adb3bc',
        'pewter': '#d8d7d5',
        'white': '#fdfdfd',
        'accent': '#050606', // You might want to update or check this as well
        'sky-blue': '#61dafb', // New color added
        'dodger-blue': '#1E90FF',
        'sea-blue' : '#006B8A',
        'hover-blue': '#4cb1e6',
        'gray-700': '#374151',
        'gray-600': '#4b5563',
        'gray-100': '#f7fafc',
        'gray-50': '#f9fafb',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(to bottom, #050606, #adb3bc)',
        'gradient-sky-blue': 'linear-gradient(45deg, #61dafb, transparent)'
      },
      backgroundColor: {
        'primary': '#fdfdfd', // Main content background
        'secondary': '#adb3bc', // Navigation and secondary buttons
        'accent': '#050606', // Call-to-action buttons
        'misty-blue-dark': '#8a9cb9', // Darker shade for hover
      },
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans],
        heading: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
