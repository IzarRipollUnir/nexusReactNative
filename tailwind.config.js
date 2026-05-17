/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        // Use the keys that match the names used in useFonts in App.tsx
        display: ['SpaceGrotesk'],
        body: ['Manrope'],
      },
    },
  },
  plugins: [],
};