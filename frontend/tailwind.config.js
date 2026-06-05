/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#003087',
          50: '#e8eef8',
          100: '#c5d4ed',
          200: '#9eb8e1',
          300: '#759cd5',
          400: '#5786cc',
          500: '#3870c2',
          600: '#2558b0',
          700: '#1a4398',
          800: '#102f80',
          900: '#003087',
        },
        accent: '#c41e3a',
        gold: '#f5a623',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
