/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ecff',
          500: '#2f6fed',
          600: '#255bd0',
          700: '#1d47a8',
        },
      },
    },
  },
  plugins: [],
};
