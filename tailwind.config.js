/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./<custom directory>/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{tsx,jsx}",
    "./components/**/*.{jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
