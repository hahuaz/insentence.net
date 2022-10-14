/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Arial', 'ui-sans-serif', 'system-ui'],
        display: ['Comfortaa', 'ui-sans-serif', 'system-ui'],
        serif: ['ui-serif', 'Georgia'],
      },
      colors: {
        ['gray']: '#4a4a4a',

        ['black_light']: '#323232',

        ['yellow']: '#ffdb85',
        ['yellow-bold']: '#ffbe0b',

        ['orange']: '#ff8673',
        ['orange-bold']: '#fb5607',

        ['blue']: '#4d99ff',
        ['blue-bold']: '#3a0ca3',

        ['purple-bold']: '#7209b7',
      },
    },
  },
  plugins: [],
};
