/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F1FFE0',
        secondary: '#9333EA',
        accent: '#F59E0B',
      },
    },
  },
}
